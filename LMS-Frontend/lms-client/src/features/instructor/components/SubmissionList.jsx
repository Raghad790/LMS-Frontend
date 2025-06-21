// src/features/instructor/components/SubmissionList.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import styles from "./SubmissionList.module.css";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader,
  Download,
  Search,
  Filter,
  ChevronDown
} from "lucide-react";

const SubmissionList = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, graded, ungraded
  const [sortBy, setSortBy] = useState('submitted_at');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch assignment details
        const assignmentResponse = await api.get(`/api/assignments/${assignmentId}`);
        const assignmentData = assignmentResponse.data.data;
        setAssignment(assignmentData);
        
        // Fetch lesson details
        if (assignmentData?.lesson_id) {
          const lessonResponse = await api.get(`/api/lessons/${assignmentData.lesson_id}`);
          setLesson(lessonResponse.data.data);
        }
        
        // Fetch submissions for this assignment
        const submissionsResponse = await api.get(`/api/submission/assignment/${assignmentId}`);
        setSubmissions(submissionsResponse.data.data || []);
        
      } catch (error) {
        console.error("Error fetching submissions:", error);
        toast.error("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [assignmentId]);
  
  // Filter and sort submissions
  const filteredAndSortedSubmissions = submissions
    .filter(submission => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return submission.user?.name?.toLowerCase().includes(query) || 
               submission.user?.email?.toLowerCase().includes(query);
      }
      return true;
    })
    .filter(submission => {
      // Apply graded/ungraded filter
      if (filter === 'graded') return submission.grade !== null;
      if (filter === 'ungraded') return submission.grade === null;
      return true; // 'all' filter
    })
    .sort((a, b) => {
      // Apply sorting
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      // Handle special cases
      if (sortBy === 'submitted_at') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (sortBy === 'user.name') {
        valA = a.user?.name?.toLowerCase() || '';
        valB = b.user?.name?.toLowerCase() || '';
      } else if (sortBy === 'grade') {
        valA = a.grade !== null ? a.grade : -1;
        valB = b.grade !== null ? b.grade : -1;
      }
      
      // Apply direction
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortBy(field);
      setSortDirection('desc');
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
  
  const getGradeStatus = (submission) => {
    if (submission.grade !== null) {
      const percentage = Math.round((submission.grade / assignment?.max_score) * 100);
      let statusClass;
      
      if (percentage >= 70) statusClass = styles.gradeHigh;
      else if (percentage >= 40) statusClass = styles.gradeMedium;
      else statusClass = styles.gradeLow;
      
      return (
        <div className={`${styles.gradeStatus} ${statusClass}`}>
          <CheckCircle size={14} />
          <span>{submission.grade}/{assignment?.max_score} ({percentage}%)</span>
        </div>
      );
    }
    
    return (
      <div className={styles.notGraded}>
        <AlertCircle size={14} />
        <span>Not graded</span>
      </div>
    );
  };
  
  const isSubmissionLate = (submission) => {
    if (!assignment?.deadline) return false;
    return new Date(submission.submitted_at) > new Date(assignment.deadline);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.loadingSpinner} />
        <p>Loading submissions...</p>
      </div>
    );
  }
  
  if (!assignment) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} />
        <h2>Assignment Not Found</h2>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.submissionListPage}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.backButton}
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
            <span>Back to Assignments</span>
          </button>
          
          <div className={styles.titleArea}>
            <h1 className={styles.title}>Assignment Submissions</h1>
            <p className={styles.assignmentTitle}>{assignment.title}</p>
            {lesson && (
              <p className={styles.lessonTitle}>
                <FileText size={14} />
                <span>Lesson: {lesson.title}</span>
              </p>
            )}
          </div>
        </div>
        
        <div className={styles.assignmentDetails}>
          <div className={styles.detailItem}>
            <Calendar size={16} />
            <span>Due: {formatDate(assignment.deadline)}</span>
          </div>
          <div className={styles.detailItem}>
            <FileText size={16} />
            <span>Max Score: {assignment.max_score}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.submissionControls}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label>Filter:</label>
            <div className={styles.filterOptions}>
              <button 
                onClick={() => setFilter('all')} 
                className={filter === 'all' ? styles.activeFilter : ''}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('graded')} 
                className={filter === 'graded' ? styles.activeFilter : ''}
              >
                Graded
              </button>
              <button 
                onClick={() => setFilter('ungraded')} 
                className={filter === 'ungraded' ? styles.activeFilter : ''}
              >
                Ungraded
              </button>
            </div>
          </div>
          
          <div className={styles.sortGroup}>
            <label>Sort by:</label>
            <div className={styles.dropdown}>
              <button className={styles.dropdownToggle}>
                {sortBy === 'submitted_at' && 'Submission Date'}
                {sortBy === 'user.name' && 'Student Name'}
                {sortBy === 'grade' && 'Grade'}
                <ChevronDown size={14} />
              </button>
              <div className={styles.dropdownMenu}>
                <button onClick={() => handleSort('submitted_at')}>
                  Submission Date
                  {sortBy === 'submitted_at' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
                <button onClick={() => handleSort('user.name')}>
                  Student Name
                  {sortBy === 'user.name' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
                <button onClick={() => handleSort('grade')}>
                  Grade
                  {sortBy === 'grade' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.submissionStats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{submissions.length}</div>
          <div className={styles.statLabel}>Total Submissions</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {submissions.filter(s => s.grade !== null).length}
          </div>
          <div className={styles.statLabel}>Graded</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {submissions.filter(s => s.grade === null).length}
          </div>
          <div className={styles.statLabel}>Need Grading</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {submissions.reduce((avg, s) => {
              if (s.grade !== null) return avg + s.grade;
              return avg;
            }, 0) / submissions.filter(s => s.grade !== null).length || 0}
          </div>
          <div className={styles.statLabel}>Avg. Grade</div>
        </div>
      </div>
      
      {submissions.length === 0 ? (
        <div className={styles.emptyState}>
          <FileText size={48} />
          <h3>No Submissions Yet</h3>
          <p>No students have submitted this assignment yet.</p>
        </div>
      ) : (
        <div className={styles.submissionsTable}>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('user.name')}>
                  Student {sortBy === 'user.name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('submitted_at')}>
                  Submitted {sortBy === 'submitted_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Status</th>
                <th onClick={() => handleSort('grade')}>
                  Grade {sortBy === 'grade' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedSubmissions.map(submission => (
                <tr key={submission.id}>
                  <td className={styles.studentCell}>
                    <div className={styles.studentInfo}>
                      <div className={styles.studentAvatar}>
                        {submission.user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className={styles.studentName}>
                        <div>{submission.user?.name || 'Unknown'}</div>
                        <div className={styles.studentEmail}>{submission.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className={styles.submissionTime}>
                      <Clock size={14} />
                      <span>{formatDate(submission.submitted_at)}</span>
                      {isSubmissionLate(submission) && (
                        <span className={styles.lateIndicator}>
                          <XCircle size={14} />
                          <span>Late</span>
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    {submission.file_url ? (
                      <a 
                        href={submission.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.fileLink}
                      >
                        <Download size={14} />
                        <span>Download</span>
                      </a>
                    ) : (
                      <span className={styles.textSubmission}>Text Submission</span>
                    )}
                  </td>
                  
                  <td>
                    {getGradeStatus(submission)}
                  </td>
                  
                  <td>
                    <button
                      className={styles.gradeButton}
                      onClick={() => navigate(`/dashboard/instructor/submissions/${submission.id}/grade`)}
                    >
                      <FileText size={16} />
                      <span>{submission.grade !== null ? 'Edit Grade' : 'Grade'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;