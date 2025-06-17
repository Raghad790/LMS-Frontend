// LMS-Frontend/lms-client/src/features/instructor/components/QuizManagement.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiBarChart2 } from "react-icons/fi";
import styles from "./QuizManagement.module.css";

const QuizManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch course info
        const courseResponse = await axios.get(`/api/courses/${courseId}`);
        setCourse(courseResponse.data.data);
        
        // Fetch quizzes for this course
        const quizzesResponse = await axios.get(`/api/courses/${courseId}/quizzes`);
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
      await axios.delete(`/api/quizzes/${quizId}`);
      setQuizzes(quizzes.filter(q => q.id !== quizId));
      toast.success("Quiz deleted successfully");
    } catch (error) {
      toast.error("Failed to delete quiz");
      console.error("Error deleting quiz:", error);
    }
  };
  
  const handleViewResults = (quizId) => {
    navigate(`/dashboard/instructor/courses/${courseId}/quizzes/${quizId}/results`);
  };
  
  const handlePreview = (quizId) => {
    navigate(`/dashboard/instructor/courses/${courseId}/quizzes/${quizId}/preview`);
  };
  
  if (loading) {
    return <div className={styles.loading}>Loading quizzes...</div>;
  }
  
  return (
    <div className={styles.quizManagement}>
      <div className={styles.header}>
        <div>
          <h1>Quizzes & Assessments</h1>
          <p className={styles.courseTitle}>
            Course: {course?.title || "Unknown Course"}
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <button
            className={styles.backButton}
            onClick={() => navigate(`/dashboard/instructor/courses/edit/${courseId}`)}
          >
            Back to Course
          </button>
          
          <button
            className={styles.createButton}
            onClick={handleCreateQuiz}
          >
            <FiPlus /> Create New Quiz
          </button>
        </div>
      </div>
      
      {quizzes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No quizzes have been created for this course.</p>
          <button
            className={styles.createFirstButton}
            onClick={handleCreateQuiz}
          >
            Create Your First Quiz
          </button>
        </div>
      ) : (
        <div className={styles.quizList}>
          <table className={styles.quizTable}>
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Questions</th>
                <th>Time Limit</th>
                <th>Passing Score</th>
                <th>Attempts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td>{quiz.title}</td>
                  <td>{quiz.questions?.length || 0} questions</td>
                  <td>{quiz.time_limit} minutes</td>
                  <td>{quiz.passing_score}%</td>
                  <td>{quiz.attempts_count || 0}</td>
                  <td className={styles.actions}>
                    <button
                      onClick={() => handleEditQuiz(quiz.id)}
                      title="Edit Quiz"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handlePreview(quiz.id)}
                      title="Preview Quiz"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => handleViewResults(quiz.id)}
                      title="View Results"
                    >
                      <FiBarChart2 />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      title="Delete Quiz"
                      className={styles.deleteButton}
                    >
                      <FiTrash2 />
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

export default QuizManagement;