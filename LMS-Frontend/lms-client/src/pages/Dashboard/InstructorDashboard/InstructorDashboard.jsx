// src/pages/Dashboard/InstructorDashboard/InstructorDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useCourses } from "../../../hooks/useCourses";
import api from "../../../services/api";
import styles from "./InstructorDashboard.module.css";
import {
  BookOpen,
  Users,
  Clock,
  PlusCircle,
  Layers,
  ChevronRight,
  Edit,
  Calendar,
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader,
  BarChart,
  Video,
  FileText,
  Award,
} from "lucide-react";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { instructorCourses, loading } = useCourses();

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalVideos: 0,
    pendingGradings: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchAdditionalStats = async () => {
      try {
        const assignmentsResponse = await api.get(
          "/assignments/pending-grading"
        );
        const pendingAssignments = assignmentsResponse.data.data || [];

        let videoCount = 0;
        for (const course of instructorCourses) {
          const modulesResponse = await api.get(`/modules/course/${course.id}`);
          const modules = modulesResponse.data.data || [];

          for (const module of modules) {
            const lessonsResponse = await api.get(
              `/lessons/module/${module.id}`
            );
            const lessons = lessonsResponse.data.data || [];

            videoCount += lessons.filter(
              (lesson) => lesson.content_type === "video"
            ).length;
          }
        }

        setStats((prevStats) => ({
          ...prevStats,
          totalVideos: videoCount,
          pendingGradings: pendingAssignments.length,
        }));
      } catch (error) {
        console.error("Error fetching additional stats:", error);
      }
    };

    const fetchTimeline = async () => {
      try {
        const timelineResponse = await api.get("/timeline/upcoming");
        setTimeline(timelineResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching timeline:", error);
      }
    };

    fetchAdditionalStats();
    fetchTimeline();
  }, [instructorCourses]);

  useEffect(() => {
    setStats({
      totalCourses: instructorCourses.length,
      totalStudents: instructorCourses.reduce(
        (total, course) => total + (course.enrollment_count || 0),
        0
      ),
      totalVideos: stats.totalVideos,
      pendingGradings: stats.pendingGradings,
    });

    setRecentCourses(instructorCourses.slice(0, 3));
  }, [instructorCourses, stats.totalVideos, stats.pendingGradings]);

  // Current date for display
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {user?.name || "Instructor"}!
          </h1>
          <p className={styles.welcomeSubtitle}>
            Here's what's happening with your courses today.
          </p>
        </div>

        <div className={styles.dateDisplay}>
          <Calendar size={16} />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BookOpen size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalCourses}</span>
            <span className={styles.statLabel}>Total Courses</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalStudents}</span>
            <span className={styles.statLabel}>Total Students</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Video size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalVideos}</span>
            <span className={styles.statLabel}>Video Lessons</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.pendingGradings}</span>
            <span className={styles.statLabel}>Pending Gradings</span>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.actionsSection}>
          <div className={styles.sectionHeader}>
            <h2>Quick Actions</h2>
          </div>

          <div className={styles.quickActions}>
            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <PlusCircle size={24} />
              </div>
              <div className={styles.actionContent}>
                <h3>Create Course</h3>
                <p>Start building a new course</p>
                <button
                  className={styles.actionButton}
                  onClick={() =>
                    navigate("/dashboard/instructor/courses/create")
                  }
                >
                  <span>Get Started</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <Layers size={24} />
              </div>
              <div className={styles.actionContent}>
                <h3>Manage Courses</h3>
                <p>Edit and organize your courses</p>
                <button
                  className={styles.actionButton}
                  onClick={() => navigate("/dashboard/instructor/courses")}
                >
                  <span>View Courses</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <BarChart size={24} />
              </div>
              <div className={styles.actionContent}>
                <h3>Analytics</h3>
                <p>View student performance data</p>
                <button
                  className={styles.actionButton}
                  onClick={() => navigate("/dashboard/instructor/analytics")}
                >
                  <span>View Analytics</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <Award size={24} />
              </div>
              <div className={styles.actionContent}>
                <h3>Post Announcement</h3>
                <p>Share updates with your students</p>
                <button
                  className={styles.actionButton}
                  onClick={() =>
                    navigate("/dashboard/instructor/announcements/create")
                  }
                >
                  <span>Post Now</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.recentCourses}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <BookOpen size={20} />
              <h2>Recent Courses</h2>
            </div>

            <button
              className={styles.viewAllButton}
              onClick={() => navigate("/dashboard/instructor/courses")}
            >
              <span>View All</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <Loader size={40} className={styles.loadingSpinner} />
              <p>Loading your courses...</p>
            </div>
          ) : recentCourses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <BookOpen size={48} />
              </div>
              <h3>No Courses Created Yet</h3>
              <p>Start your teaching journey by creating your first course</p>
              <button
                className={styles.createFirstButton}
                onClick={() => navigate("/dashboard/instructor/courses/create")}
              >
                <PlusCircle size={18} />
                <span>Create Your First Course</span>
              </button>
            </div>
          ) : (
            <div className={styles.courseCards}>
              {recentCourses.map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <div className={styles.thumbnailContainer}>
                    {course.is_published && (
                      <span className={styles.publishedBadge}>
                        <CheckCircle size={12} />
                        <span>Published</span>
                      </span>
                    )}
                    <img
                      src={
                        course.thumbnail_url ||
                        "https://placehold.co/300x160?text=No+Thumbnail"
                      }
                      alt={course.title}
                      className={styles.thumbnail}
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/300x160?text=No+Thumbnail";
                      }}
                    />
                  </div>

                  <div className={styles.courseInfo}>
                    <h3 className={styles.courseTitle}>{course.title}</h3>

                    <div className={styles.courseDetails}>
                      <div className={styles.detailItem}>
                        <Users size={14} />
                        <span>{course.enrollment_count || 0} students</span>
                      </div>

                      <div className={styles.courseStatus}>
                        {course.approved ? (
                          <span className={styles.approvedStatus}>
                            <CheckCircle size={14} />
                            <span>Approved</span>
                          </span>
                        ) : (
                          <span className={styles.pendingStatus}>
                            <AlertCircle size={14} />
                            <span>Pending</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className={styles.editButton}
                      onClick={() =>
                        navigate(
                          `/dashboard/instructor/courses/edit/${course.id}`
                        )
                      }
                    >
                      <Edit size={16} />
                      <span>Edit Course</span>
                    </button>
                    <button
                      className={styles.modulesButton}
                      onClick={() =>
                        navigate(
                          `/dashboard/instructor/courses/${course.id}/modules`
                        )
                      }
                    >
                      <Layers size={16} />
                      <span>Modules</span>
                    </button>
                  </div>

                  <div
                    className={styles.cardOverlay}
                    onClick={() =>
                      navigate(
                        `/dashboard/instructor/courses/edit/${course.id}`
                      )
                    }
                  >
                    <div className={styles.overlayContent}>
                      <span>Manage Course</span>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.timelineSection}>
          <div className={styles.sectionHeader}>
            <h2>
              <Clock size={20} /> Upcoming Activities
            </h2>
          </div>

          <div className={styles.timeline}>
            {timeline.length === 0 ? (
              <p>No upcoming activities</p>
            ) : (
              timeline.map((event, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDate}>
                      <Clock size={14} />
                      <span>{event.date}</span>
                    </div>
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
