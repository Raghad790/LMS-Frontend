// src/features/instructor/components/SubmissionGrading.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import styles from "./SubmissionGrading.module.css";
import {
  ArrowLeft,
  File,
  User,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
  AlertCircle,
  Loader,
  Save,
  Download,
  ExternalLink
} from "lucide-react";

const SubmissionGrading = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get submission details
        const submissionResponse = await api.get(`/submission/${submissionId}`);
        const submissionData = submissionResponse.data.data;
        setSubmission(submissionData);
        
        if (submissionData) {
          // Get assignment details
          const assignmentResponse = await api.get(`/assignments/${submissionData.assignment_id}`);
          setAssignment(assignmentResponse.data.data);
          
          // Get student details
          const studentResponse = await api.get(`/users/${submissionData.user_id}`);
          setStudent(studentResponse.data.data);
          
          // Set initial grade and feedback if exists
          setGrade(submissionData.grade?.toString() || "");
          setFeedback(submissionData.feedback || "");
        }
      } catch (error) {
        console.error("Error loading submission:", error);
        toast.error("Failed to load submission data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [submissionId]);
  
  const handleSubmitGrade = async () => {
    if (!grade.trim()) {
      toast.error("Please enter a grade");
      return;
    }
    
    const gradeValue = parseInt(grade);
    
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > (assignment?.max_score || 100)) {
      toast.error(`Grade must be between 0 and ${assignment?.max_score || 100}`);
      return;
    }
    
    try {
      setSubmitting(true);
      
      await api.put(`/submission/${submissionId}/grade`, {
        grade: gradeValue,
        feedback
      });
      
      toast.success("Grade submitted successfully");
      
      // Update local submission data
      setSubmission({
        ...submission,
        grade: gradeValue,
        feedback,
        graded_at: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error submitting grade:", error);
      toast.error("Failed to submit grade");
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.loadingSpinner} />
        <p>Loading submission data...</p>
      </div>
    );
  }

  return (
    <div className={styles.gradingPage}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        
        <h1 className={styles.title}>Grade Submission</h1>
      </div>
      
      <div className={styles.gradingContainer}>
        <div className={styles.submissionInfo}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h2><FileText size={18} /> Assignment</h2>
            </div>
            
            <div className={styles.cardContent}>
              <h3>{assignment?.title}</h3>
              <div className={styles.assignmentDescription}>
                {assignment?.description}
              </div>
              
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <Calendar size={14} /> Due Date
                  </span>
                  <span className={styles.detailValue}>
                    {formatDate(assignment?.deadline)}
                  </span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <CheckCircle size={14} /> Max Score
                  </span>
                  <span className={styles.detailValue}>
                    {assignment?.max_score || 100}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h2><User size={18} /> Student</h2>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.studentInfo}>
                <div className={styles.studentAvatar}>
                  {student?.avatar ? (
                    <img src={student.avatar} alt={student?.name} />
                  ) : (
                    <div className={styles.avatarFallback}>
                      {student?.name?.charAt(0).toUpperCase() || "S"}
                    </div>
                  )}
                </div>
                
                <div className={styles.studentDetails}>
                  <h3>{student?.name}</h3>
                  <p>{student?.email}</p>
                </div>
              </div>
              
              <div className={styles.submissionDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <Clock size={14} /> Submitted
                  </span>
                  <span className={styles.detailValue}>
                    {formatDate(submission?.submitted_at)}
                  </span>
                </div>
                
                {assignment?.deadline && submission?.submitted_at && 
                  new Date(submission.submitted_at) > new Date(assignment.deadline) && (
                    <div className={styles.lateSubmission}>
                      <AlertCircle size={14} />
                      <span>Late submission</span>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.submissionContent}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h2><File size={18} /> Submission</h2>
              
              {submission?.submission_url && (
                <a 
                  href={submission.submission_url} 
                  download 
                  className={styles.downloadButton}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download size={16} />
                  <span>Download</span>
                </a>
              )}
            </div>
            
            <div className={styles.cardContent}>
              {submission?.submission_url ? (
                <div className={styles.submissionPreview}>
                  {submission.submission_url.toLowerCase().endsWith('.pdf') ? (
                    <iframe 
                      src={submission.submission_url} 
                      className={styles.pdfPreview}
                      title="PDF Preview"
                    ></iframe>
                  ) : submission.submission_url.match(/\.(jpe?g|png|gif|webp)$/i) ? (
                    <img 
                      src={submission.submission_url} 
                      alt="Submission preview" 
                      className={styles.imagePreview}
                    />
                  ) : (
                    <div className={styles.filePreview}>
                      <File size={48} />
                      <p>Preview not available</p>
                      <a 
                        href={submission.submission_url}
                        target="_blank"
                        rel="noreferrer" 
                        className={styles.viewFileButton}
                      >
                        <ExternalLink size={16} />
                        <span>View File</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.textSubmission}>
                  {submission?.content ? (
                    <div className={styles.textContent}>
                      {submission.content}
                    </div>
                  ) : (
                    <div className={styles.noSubmission}>
                      <AlertCircle size={24} />
                      <p>No content submitted</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h2><CheckCircle size={18} /> Grading</h2>
              
              {submission?.graded_at && (
                <span className={styles.gradedBadge}>
                  <Clock size={14} />
                  <span>Graded {formatDate(submission.graded_at)}</span>
                </span>
              )}
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.gradingForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="grade">
                    Grade (0-{assignment?.max_score || 100})
                    <span className={styles.required}>*</span>
                  </label>
                  <input 
                    type="number"
                    id="grade"
                    min="0"
                    max={assignment?.max_score || 100}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className={styles.gradeInput}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="feedback">Feedback</label>
                  <textarea 
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback on this submission..."
                    className={styles.feedbackInput}
                    rows={6}
                  ></textarea>
                </div>
                
                <button 
                  onClick={handleSubmitGrade}
                  className={styles.submitButton}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader size={16} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Submit Grade</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionGrading;