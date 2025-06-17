// LMS-Frontend/lms-client/src/features/instructor/components/CourseAnalytics.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import styles from "./CourseAnalytics.module.css";

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
    weeklyActivity: []
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await axios.get(`/api/courses/${courseId}`);
        setCourse(courseResponse.data.data);
        
        // Fetch analytics data
        const analyticsResponse = await axios.get(`/api/courses/${courseId}/analytics`);
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
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  
  if (loading) {
    return <div className={styles.loading}>Loading analytics data...</div>;
  }
  
  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <div>
          <h1>Course Analytics</h1>
          <p className={styles.courseTitle}>{course?.title || "Unknown Course"}</p>
        </div>
        
        <button
          className={styles.backButton}
          onClick={() => navigate(`/dashboard/instructor/courses/edit/${courseId}`)}
        >
          Back to Course
        </button>
      </div>
      
      <div className={styles.dashboardGrid}>
        {/* Summary Cards */}
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{analytics.totalStudents}</div>
            <div className={styles.statLabel}>Total Students</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statValue}>{analytics.activeStudents}</div>
            <div className={styles.statLabel}>Active Students</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statValue}>{analytics.completionRate}%</div>
            <div className={styles.statLabel}>Completion Rate</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statValue}>{analytics.avgProgress}%</div>
            <div className={styles.statLabel}>Avg. Progress</div>
          </div>
        </div>
        
        {/* Enrollment Trend Chart */}
        <div className={styles.chartCard}>
          <h3>Enrollment Trend</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={analytics.enrollments.map(item => ({
                  ...item,
                  date: formatDate(item.date)
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="New Enrollments"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
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
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completion_rate" name="Completion %" fill="#82ca9d" />
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
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz_title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg_score" name="Average Score" fill="#8884d8" />
                <Bar dataKey="passing_rate" name="Passing Rate %" fill="#82ca9d" />
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
                data={analytics.weeklyActivity.map(item => ({
                  ...item,
                  week: formatDate(item.start_date)
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="active_users"
                  name="Active Students"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="content_views"
                  name="Content Views"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
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