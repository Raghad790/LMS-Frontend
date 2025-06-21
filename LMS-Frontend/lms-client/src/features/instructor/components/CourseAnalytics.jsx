import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./CourseAnalytics.module.css";
import {
  ArrowLeft,
  Users,
  UserCheck,
  Award,
  TrendingUp,
  Loader,
} from "lucide-react";

const CourseAnalytics = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [analytics, setAnalytics] = useState({
    enrollments: [],
    completionRate: 0,
    avgProgress: 0,
    totalStudents: 0,
    activeStudents: 0,
    quizStats: [],
    moduleCompletion: [],
    weeklyActivity: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch course details
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data.data);

        // Fetch analytics data
        const analyticsResponse = await api.get(
          `/courses/${courseId}/analytics`
        );
        setAnalytics(analyticsResponse.data.data);
      } catch (error) {
        toast.error("Failed to load analytics data");
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Format date for charts
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const COLORS = ["#8367ff", "#ff6b8b", "#41ce8e", "#ffab49", "#5abdf9"];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.loadingSpinner} />
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1>Course Analytics</h1>
          <p className={styles.courseTitle}>
            {course?.title || "Unknown Course"}
          </p>
        </div>

        <button
          className={styles.backButton}
          onClick={() =>
            navigate(`/dashboard/instructor/courses/edit/${courseId}`)
          }
        >
          <ArrowLeft size={16} />
          <span>Back to Course</span>
        </button>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Summary Cards */}
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users size={22} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{analytics.totalStudents}</div>
              <div className={styles.statLabel}>Total Students</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <UserCheck size={22} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{analytics.activeStudents}</div>
              <div className={styles.statLabel}>Active Students</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Award size={22} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {analytics.completionRate}%
              </div>
              <div className={styles.statLabel}>Completion Rate</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <TrendingUp size={22} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{analytics.avgProgress}%</div>
              <div className={styles.statLabel}>Avg. Progress</div>
            </div>
          </div>
        </div>

        {/* Enrollment Trend Chart */}
        <div className={styles.chartCard}>
          <h3>Enrollment Trend</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={analytics.enrollments.map((item) => ({
                  ...item,
                  date: formatDate(item.date),
                }))}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fill: "#666" }} />
                <YAxis tick={{ fill: "#666" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="New Enrollments"
                  stroke="#8367ff"
                  strokeWidth={2}
                  dot={{ fill: "#8367ff", stroke: "#8367ff", r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#8367ff",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module Completion Chart */}
        <div className={styles.chartCard}>
          <h3>Module Completion Rates</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={analytics.moduleCompletion}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fill: "#666" }} />
                <YAxis tick={{ fill: "#666" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="completion_rate"
                  name="Completion %"
                  radius={[4, 4, 0, 0]}
                >
                  {analytics.moduleCompletion.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quiz Performance Chart */}
        <div className={styles.chartCard}>
          <h3>Quiz Performance</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={analytics.quizStats}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="quiz_title" tick={{ fill: "#666" }} />
                <YAxis tick={{ fill: "#666" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="avg_score"
                  name="Average Score"
                  fill="#8367ff"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="passing_rate"
                  name="Passing Rate %"
                  fill="#ff6b8b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className={styles.chartCard}>
          <h3>Weekly Student Activity</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={analytics.weeklyActivity.map((item) => ({
                  ...item,
                  week: formatDate(item.start_date),
                }))}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="week" tick={{ fill: "#666" }} />
                <YAxis tick={{ fill: "#666" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="active_users"
                  name="Active Students"
                  stroke="#8367ff"
                  strokeWidth={2}
                  dot={{ fill: "#8367ff", stroke: "#8367ff", r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#8367ff",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="content_views"
                  name="Content Views"
                  stroke="#ff6b8b"
                  strokeWidth={2}
                  dot={{ fill: "#ff6b8b", stroke: "#ff6b8b", r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#ff6b8b",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;
