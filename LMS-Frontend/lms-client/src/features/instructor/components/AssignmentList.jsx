// src/features/instructor/components/AssignmentList.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import styles from "./AssignmentList.module.css";
import {
  Plus,
  FileText,
  Trash2,
  Edit,
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  Loader,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const AssignmentList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch course info
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data.data);

        // Fetch modules
        const modulesResponse = await api.get(`/courses/${courseId}/modules`);
        const modulesData = modulesResponse.data.data || [];

        // For each module, get its lessons
        const modulesWithLessonsPromises = modulesData.map(async (module) => {
          const lessonsResponse = await api.get(
            `/modules/${module.id}/lessons`
          );
          const lessons = lessonsResponse.data.data || [];

          // For each lesson, get assignments
          const lessonsWithAssignmentsPromises = lessons.map(async (lesson) => {
            const assignmentsResponse = await api.get(
              `/lessons/${lesson.id}/assignments`
            );
            return {
              ...lesson,
              assignments: assignmentsResponse.data.data || [],
            };
          });

          const lessonsWithAssignments = await Promise.all(
            lessonsWithAssignmentsPromises
          );

          return {
            ...module,
            lessons: lessonsWithAssignments,
          };
        });

        const modulesWithData = await Promise.all(modulesWithLessonsPromises);
        setModules(modulesWithData);

        // Flatten all assignments for easier access
        const allAssignments = [];
        modulesWithData.forEach((module) => {
          module.lessons.forEach((lesson) => {
            lesson.assignments.forEach((assignment) => {
              allAssignments.push({
                ...assignment,
                lesson_title: lesson.title,
                module_title: module.title,
              });
            });
          });
        });

        setAssignments(allAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleAddAssignment = (lessonId) => {
    navigate(`/dashboard/instructor/lessons/${lessonId}/assignments/create`);
  };

  const handleEditAssignment = (assignmentId) => {
    navigate(`/dashboard/instructor/assignments/${assignmentId}/edit`);
  };

  const handleViewSubmissions = (assignmentId) => {
    navigate(`/dashboard/instructor/assignments/${assignmentId}/submissions`);
  };
  const handleDeleteAssignment = async (assignmentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this assignment? All associated submissions will be lost."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/assignments/${assignmentId}`);

      // Remove assignment from state
      setAssignments(assignments.filter((a) => a.id !== assignmentId));

      // Update modules state to reflect the change
      const updatedModules = modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => ({
          ...lesson,
          assignments: lesson.assignments.filter((a) => a.id !== assignmentId),
        })),
      }));
      setModules(updatedModules);

      toast.success("Assignment deleted successfully");
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Failed to delete assignment");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  };

  const calculateStatus = (assignment) => {
    const deadlinePassed = isDeadlinePassed(assignment.deadline);
    const hasSubmissions = assignment.submissions_count > 0;
    const pendingGrading = assignment.pending_grading_count > 0;

    if (deadlinePassed && !hasSubmissions) {
      return {
        label: "No submissions",
        icon: <AlertTriangle size={14} />,
        className: styles.statusWarning,
      };
    }

    if (pendingGrading) {
      return {
        label: `${assignment.pending_grading_count} need grading`,
        icon: <AlertCircle size={14} />,
        className: styles.statusPending,
      };
    }

    if (hasSubmissions && !pendingGrading) {
      return {
        label: "All graded",
        icon: <CheckCircle size={14} />,
        className: styles.statusComplete,
      };
    }

    return {
      label: "Active",
      icon: <Clock size={14} />,
      className: styles.statusActive,
    };
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.loadingSpinner} />
        <p>Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className={styles.assignmentListPage}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backButton}
            onClick={() =>
              navigate(`/dashboard/instructor/courses/edit/${courseId}`)
            }
            aria-label="Back to course"
          >
            <ArrowLeft size={18} />
            <span>Back to Course</span>
          </button>

          <div className={styles.titleArea}>
            <h1 className={styles.title}>Course Assignments</h1>
            <p className={styles.courseTitle}>
              {course?.title || "Unknown Course"}
            </p>
          </div>
        </div>

        <div className={styles.dateDisplay}>
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FileText size={48} />
          </div>
          <h3>No Assignments Yet</h3>
          <p>
            Add assignments to your lessons to assess your students' knowledge
            and skills.
          </p>
        </div>
      ) : (
        <div className={styles.assignmentListContainer}>
          {modules.map((module) => {
            // Check if module has any lessons with assignments
            const hasAssignments = module.lessons.some(
              (lesson) => lesson.assignments && lesson.assignments.length > 0
            );

            if (!hasAssignments) return null;

            return (
              <div key={module.id} className={styles.moduleSection}>
                <h2 className={styles.moduleTitle}>
                  <BookOpen size={18} />
                  <span>{module.title}</span>
                </h2>

                {module.lessons.map((lesson) => {
                  if (!lesson.assignments || lesson.assignments.length === 0)
                    return null;

                  return (
                    <div key={lesson.id} className={styles.lessonSection}>
                      <h3 className={styles.lessonTitle}>
                        <FileText size={16} />
                        <span>{lesson.title}</span>
                      </h3>

                      <div className={styles.assignmentGrid}>
                        {lesson.assignments.map((assignment) => {
                          const status = calculateStatus(assignment);

                          return (
                            <div
                              key={assignment.id}
                              className={styles.assignmentCard}
                              onClick={() =>
                                handleViewSubmissions(assignment.id)
                              }
                            >
                              <div className={styles.assignmentDetails}>
                                <h4 className={styles.assignmentTitle}>
                                  {assignment.title}
                                </h4>

                                <div className={styles.assignmentMetadata}>
                                  <div className={styles.metaItem}>
                                    <Calendar size={14} />
                                    <span
                                      className={
                                        isDeadlinePassed(assignment.deadline)
                                          ? styles.deadlinePassed
                                          : ""
                                      }
                                    >
                                      {formatDate(assignment.deadline)}
                                    </span>
                                  </div>

                                  <div className={styles.metaItem}>
                                    <FileText size={14} />
                                    <span>
                                      {assignment.submissions_count || 0}{" "}
                                      submissions
                                    </span>
                                  </div>

                                  <div
                                    className={`${styles.metaItem} ${status.className}`}
                                  >
                                    {status.icon}
                                    <span>{status.label}</span>
                                  </div>
                                </div>

                                <div className={styles.assignmentDescription}>
                                  {assignment.description ? (
                                    <p>
                                      {assignment.description.substring(0, 100)}
                                      {assignment.description.length > 100
                                        ? "..."
                                        : ""}
                                    </p>
                                  ) : (
                                    <p className={styles.noDescription}>
                                      No description
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className={styles.assignmentActions}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAssignment(assignment.id);
                                  }}
                                  className={styles.editButton}
                                  disabled={isDeleting}
                                >
                                  <Edit size={16} />
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAssignment(assignment.id);
                                  }}
                                  className={styles.deleteButton}
                                  disabled={isDeleting}
                                >
                                  <Trash2 size={16} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        <button
                          className={styles.addAssignmentCard}
                          onClick={() => handleAddAssignment(lesson.id)}
                        >
                          <Plus size={24} />
                          <p>Add New Assignment</p>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
