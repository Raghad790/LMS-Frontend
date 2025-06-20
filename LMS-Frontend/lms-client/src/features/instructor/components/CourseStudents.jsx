import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import styles from "./CourseStudents.module.css";
import { 
  ArrowLeft, 
  Search, 
  Users, 
  Loader, 
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  Filter,
  UserX,
  Mail
} from "lucide-react";

const CourseStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });
  const [filterConfig, setFilterConfig] = useState({ completed: "all" });
  
  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get course info
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data.data);
        
        // Get course enrollments
        const enrollmentsResponse = await api.get(`/courses/${courseId}/enrollments`);
        setEnrollments(enrollmentsResponse.data.data || []);
      } catch (error) {
        toast.error("Failed to load student data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Sort enrollments
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort enrollments
  const filteredAndSortedEnrollments = useMemo(() => {
    // First, filter based on search and completion status
    let result = [...enrollments];
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(enrollment => 
        (enrollment.user?.name?.toLowerCase().includes(searchLower) || 
         enrollment.user?.email?.toLowerCase().includes(searchLower))
      );
    }
    
    if (filterConfig.completed !== "all") {
      const isCompleted = filterConfig.completed === "completed";
      result = result.filter(enrollment => enrollment.completed === isCompleted);
    }
    
    // Then sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Handle nested properties like user.name
        let aValue, bValue;
        
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }
        
        // Handle dates
        if (sortConfig.key === 'created_at') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [enrollments, search, sortConfig, filterConfig]);
  
  // Get completion statistics
  const stats = useMemo(() => {
    const totalStudents = enrollments.length;
    const completedStudents = enrollments.filter(e => e.completed).length;
    const completionRate = totalStudents ? Math.round((completedStudents / totalStudents) * 100) : 0;
    const averageProgress = totalStudents 
      ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / totalStudents) 
      : 0;
      
    return {
      totalStudents,
      completedStudents,
      completionRate,
      averageProgress
    };
  }, [enrollments]);

  // Helper function to get sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };
  
  // Progress bar color based on completion percentage
  const getProgressColor = (progress) => {
    if (progress >= 80) return { background: 'var(--success)' };
    if (progress >= 40) return { background: 'var(--warning)' };
    return { background: 'var(--secondary)' };
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.loadingSpinner} />
        <p>Loading student data...</p>
      </div>
    );
  }

  return (
    <div className={styles.courseStudentsContainer}>
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
            <h1 className={styles.title}>Course Students</h1>
            <p className={styles.courseTitle}>{course?.title || "Unknown Course"}</p>
          </div>
        </div>
        
        <div className={styles.dateDisplay}>
          <Clock size={16} />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className={styles.statsContainer}>
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
            <span className={styles.statValue}>{stats.completedStudents}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Mail size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.completionRate}%</span>
            <span className={styles.statLabel}>Completion Rate</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.averageProgress}%</span>
            <span className={styles.statLabel}>Average Progress</span>
          </div>
        </div>
      </div>
      
      <div className={styles.tableContainer}>
        <div className={styles.tableControls}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterDropdown}>
            <button className={styles.filterButton}>
              <Filter size={16} />
              <span>Filter</span>
              <ChevronDown size={14} />
            </button>
            
            <div className={styles.filterMenu}>
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Completion Status</span>
                <div className={styles.filterOptions}>
                  <button 
                    className={`${styles.filterOption} ${filterConfig.completed === 'all' ? styles.active : ''}`}
                    onClick={() => setFilterConfig({...filterConfig, completed: 'all'})}
                  >
                    All
                  </button>
                  <button 
                    className={`${styles.filterOption} ${filterConfig.completed === 'completed' ? styles.active : ''}`}
                    onClick={() => setFilterConfig({...filterConfig, completed: 'completed'})}
                  >
                    Completed
                  </button>
                  <button 
                    className={`${styles.filterOption} ${filterConfig.completed === 'inprogress' ? styles.active : ''}`}
                    onClick={() => setFilterConfig({...filterConfig, completed: 'inprogress'})}
                  >
                    In Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {filteredAndSortedEnrollments.length === 0 ? (
          <div className={styles.emptyState}>
            <UserX size={48} />
            <h3>No Students Found</h3>
            <p>
              {search 
                ? "No students match your search criteria." 
                : "No students are currently enrolled in this course."}
            </p>
          </div>
        ) : (
          <div className={styles.studentTable}>
            <table>
              <thead>
                <tr>
                  <th onClick={() => requestSort('user.name')}>
                    Student Name {getSortDirectionIndicator('user.name')}
                  </th>
                  <th onClick={() => requestSort('user.email')}>
                    Email {getSortDirectionIndicator('user.email')}
                  </th>
                  <th onClick={() => requestSort('created_at')}>
                    Enrolled Date {getSortDirectionIndicator('created_at')}
                  </th>
                  <th onClick={() => requestSort('progress')}>
                    Progress {getSortDirectionIndicator('progress')}
                  </th>
                  <th onClick={() => requestSort('completed')}>
                    Status {getSortDirectionIndicator('completed')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedEnrollments.map(enrollment => (
                  <tr key={enrollment.id}>
                    <td>
                      <div className={styles.studentName}>
                        <div className={styles.studentAvatar}>
                          {enrollment.user?.name?.charAt(0) || "?"}
                        </div>
                        <span>{enrollment.user?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td>{enrollment.user?.email || "Unknown"}</td>
                    <td>
                      {new Date(enrollment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
                      <div className={styles.progressBarWrapper}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progress}
                            style={{ 
                              width: `${enrollment.progress || 0}%`,
                              ...getProgressColor(enrollment.progress || 0)
                            }}
                          />
                        </div>
                        <span>{enrollment.progress || 0}%</span>
                      </div>
                    </td>
                    <td>
                      <div className={`${styles.statusBadge} ${enrollment.completed ? styles.completed : styles.inProgress}`}>
                        {enrollment.completed ? (
                          <>
                            <CheckCircle size={14} />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <Clock size={14} />
                            <span>In Progress</span>
                          </>
                        )}
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

export default CourseStudents;