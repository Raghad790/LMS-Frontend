// src/features/instructor/components/QuizManagement.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import styles from "./QuizManagement.module.css";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart2,
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Loader,
  Calendar,
  Clock,
  CheckCircle,
  MoreVertical,
  MessageSquare
} from "lucide-react";

const QuizManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Current date for display
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch course info
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data.data);
        
        // Fetch quizzes for this course
        const quizzesResponse = await api.get(`/courses/${courseId}/quizzes`);
        setQuizzes(quizzesResponse.data.data || []);
      } catch (error) {
        toast.error("Failed to load quizzes");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId]);
  
  const handleCreateQuiz = () => {
    navigate(`/dashboard/instructor/courses/${courseId}/quizzes/create`);
  };
  
  const handleEditQuiz = (quizId) => {
    navigate(`/dashboard/instructor/courses/${courseId}/quizzes/${quizId}/edit`);
  };
  
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await api.delete(`/quizzes/${quizId}`);
      setQuizzes(quizzes.filter(q => q.id !== quizId));
      toast.success("Quiz deleted successfully");
    } catch (error) {
      toast.error("Failed to delete quiz");
      console.error("Error deleting quiz:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleViewResults = (quizId) => {
    navigate(`/dashboard/instructor/courses/${courseId}/quizzes/${quizId}/results`);
  };
  
  const handlePreview = (quizId) => {
    navigate(`/dashboard/instructor/courses/${courseId}/quizzes/${quizId}/preview`);
  };
  
  // Calculate stats
  const stats = {
    totalQuizzes: quizzes.length,
    totalQuestions: quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0),
    totalAttempts: quizzes.reduce((sum, quiz) => sum + (quiz.attempts_count || 0), 0)
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.loadingSpinner} />
        <p>Loading quizzes...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.quizManagementPage}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.backButton}
            onClick={() => navigate(`/dashboard/instructor/courses/edit/${courseId}`)}
            aria-label="Back to course"
          >
            <ArrowLeft size={18} />
            <span>Back to Course</span>
          </button>
          
          <div className={styles.titleArea}>
            <h1 className={styles.title}>Quizzes & Assessments</h1>
            <p className={styles.courseTitle}>
              <BookOpen size={16} />
              <span>{course?.title || "Unknown Course"}</span>
            </p>
          </div>
        </div>
        
        <div className={styles.dateDisplay}>
          <Calendar size={16} />
          <span>{currentDate}</span>
        </div>
      </div>
      
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <MessageSquare size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalQuizzes}</span>
            <span className={styles.statLabel}>Total Quizzes</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalQuestions}</span>
            <span className={styles.statLabel}>Total Questions</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BarChart2 size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalAttempts}</span>
            <span className={styles.statLabel}>Quiz Attempts</span>
          </div>
        </div>
      </div>
      
      <div className={styles.quizContainer}>
        <div className={styles.quizContainerHeader}>
          <div className={styles.sectionTitle}>
            <MessageSquare size={20} />
            <h2>Manage Quizzes</h2>
          </div>
          
          <button
            className={styles.createButton}
            onClick={handleCreateQuiz}
          >
            <Plus size={18} />
            <span>Create New Quiz</span>
          </button>
        </div>
        
        {quizzes.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <MessageSquare size={48} />
            </div>
            <h3>No Quizzes Created Yet</h3>
            <p>Create your first quiz to assess your students' knowledge.</p>
            <button
              className={styles.createFirstButton}
              onClick={handleCreateQuiz}
            >
              <Plus size={18} />
              <span>Create Your First Quiz</span>
            </button>
          </div>
        ) : (
          <div className={styles.quizTableContainer}>
            <table className={styles.quizTable}>
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th className={styles.hideOnMobile}>Questions</th>
                  <th className={styles.hideOnSmall}>Time Limit</th>
                  <th className={styles.hideOnMobile}>Passing Score</th>
                  <th className={styles.hideOnSmall}>Attempts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td className={styles.quizTitle}>
                      <MessageSquare size={16} className={styles.quizIcon} />
                      <span>{quiz.title}</span>
                    </td>
                    <td className={styles.hideOnMobile}>{quiz.questions?.length || 0}</td>
                    <td className={styles.hideOnSmall}>
                      <div className={styles.timeLimit}>
                        <Clock size={14} />
                        <span>{quiz.time_limit} min</span>
                      </div>
                    </td>
                    <td className={styles.hideOnMobile}>{quiz.passing_score}%</td>
                    <td className={styles.hideOnSmall}>{quiz.attempts_count || 0}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleEditQuiz(quiz.id)}
                          title="Edit Quiz"
                          disabled={isDeleting}
                          className={styles.editButton}
                        >
                          <Edit size={16} />
                          <span className={styles.hideButtonText}>Edit</span>
                        </button>
                        <button
                          onClick={() => handlePreview(quiz.id)}
                          title="Preview Quiz"
                          disabled={isDeleting}
                          className={styles.previewButton}
                        >
                          <Eye size={16} />
                          <span className={styles.hideButtonText}>Preview</span>
                        </button>
                        <button
                          onClick={() => handleViewResults(quiz.id)}
                          title="View Results"
                          disabled={isDeleting}
                          className={styles.resultsButton}
                        >
                          <BarChart2 size={16} />
                          <span className={styles.hideButtonText}>Results</span>
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          title="Delete Quiz"
                          disabled={isDeleting}
                          className={styles.deleteButton}
                        >
                          <Trash2 size={16} />
                          <span className={styles.hideButtonText}>Delete</span>
                        </button>
                      </div>
                      
                      <div className={styles.mobileActions}>
                        <div className={styles.dropdown}>
                          <button className={styles.dropdownToggle}>
                            <MoreVertical size={18} />
                          </button>
                          <div className={styles.dropdownMenu}>
                            <button onClick={() => handleEditQuiz(quiz.id)}>
                              <Edit size={16} />
                              <span>Edit</span>
                            </button>
                            <button onClick={() => handlePreview(quiz.id)}>
                              <Eye size={16} />
                              <span>Preview</span>
                            </button>
                            <button onClick={() => handleViewResults(quiz.id)}>
                              <BarChart2 size={16} />
                              <span>Results</span>
                            </button>
                            <button onClick={() => handleDeleteQuiz(quiz.id)}>
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManagement;