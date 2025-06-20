import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import styles from "./InstructorCourseManager.module.css";
import {
  PlusCircle,
  Edit,
  Users,
  Loader,
  BarChart2,
  Clock,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react";

const InstructorCourseManager = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Current date for display
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get("/courses/me/mine");
        setCourses(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch your courses");
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, []);

  const handleCreateCourse = () => {
    navigate("/dashboard/instructor/courses/create");
  };

  const handleEditCourse = (courseId) => {
    navigate(`/dashboard/instructor/courses/edit/${courseId}`);
  };

  // Filter and sort courses
  const filteredAndSortedCourses = courses
    .filter((course) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return course.title.toLowerCase().includes(query);
    })
    .sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Handle dates
      if (sortBy === "created_at" || sortBy === "updated_at") {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      // Handle enrollment count (might be null)
      if (sortBy === "enrollment_count") {
        valueA = valueA || 0;
        valueB = valueB || 0;
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  // Calculate stats
  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter((course) => course.is_published).length,
    totalStudents: courses.reduce(
      (total, course) => total + (course.enrollment_count || 0),
      0
    ),
    pendingApproval: courses.filter((course) => !course.approved).length,
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className={styles.courseManager}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>My Courses</h1>
          <p className={styles.subtitle}>
            Manage and organize your teaching content
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
            <CheckCircle size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.publishedCourses}</span>
            <span className={styles.statLabel}>Published Courses</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <AlertTriangle size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.pendingApproval}</span>
            <span className={styles.statLabel}>Pending Approval</span>
          </div>
        </div>
      </div>

      <div className={styles.courseListContainer}>
        <div className={styles.courseListHeader}>
          <div className={styles.courseControls}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.sortControls}>
              <span>Sort by:</span>
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split("-");
                  handleSortChange(field, direction); // Use the handleSortChange function
                }}
              >
                <option value="updated_at-desc">Recently Updated</option>
                <option value="created_at-desc">Recently Created</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="enrollment_count-desc">Most Students</option>
              </select>
            </div>
          </div>

          <button className={styles.createButton} onClick={handleCreateCourse}>
            <PlusCircle size={18} />
            <span>Create Course</span>
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <Loader size={40} className={styles.loadingSpinner} />
            <p>Loading your courses...</p>
          </div>
        ) : filteredAndSortedCourses.length === 0 ? (
          <div className={styles.emptyCourses}>
            {searchQuery ? (
              <>
                <div className={styles.emptyIcon}>
                  <AlertTriangle size={48} />
                </div>
                <h3>No courses found</h3>
                <p>Try different search keywords or clear your search</p>
              </>
            ) : (
              <>
                <div className={styles.emptyIcon}>
                  <BookOpen size={48} />
                </div>
                <h3>No courses created yet</h3>
                <p>Start your teaching journey by creating your first course</p>
                <button
                  className={styles.createFirstButton}
                  onClick={handleCreateCourse}
                >
                  <PlusCircle size={18} />
                  <span>Create Your First Course</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={styles.courseGrid}>
            {filteredAndSortedCourses.map((course) => (
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

                    <div className={styles.detailItem}>
                      <Clock size={14} />
                      <span>Updated {formatDate(course.updated_at)}</span>
                    </div>
                  </div>

                  <div className={styles.courseStatus}>
                    {course.approved ? (
                      <span className={styles.approvedStatus}>
                        <CheckCircle size={14} />
                        <span>Approved</span>
                      </span>
                    ) : (
                      <span className={styles.pendingStatus}>
                        <AlertTriangle size={14} />
                        <span>Pending Approval</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.courseActions}>
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/instructor/courses/${course.id}/analytics`
                      )
                    }
                    className={styles.analyticsButton}
                    title="Course Analytics"
                  >
                    <BarChart2 size={18} />
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/instructor/courses/${course.id}/students`
                      )
                    }
                    className={styles.studentsButton}
                    title="View Students"
                  >
                    <Users size={18} />
                  </button>

                  <button
                    onClick={() => handleEditCourse(course.id)}
                    className={styles.editButton}
                    title="Edit Course"
                  >
                    <Edit size={18} />
                  </button>
                </div>

                <div
                  className={styles.cardOverlay}
                  onClick={() => handleEditCourse(course.id)}
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
    </div>
  );
};

export default InstructorCourseManager;
