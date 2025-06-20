import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";
import styles from "./DiscussionManagement.module.css";
import api from "../../../services/api";
import { 
  MessageSquare,
  ArrowUp,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Send,
  ChevronDown,
  ArrowLeft,
  Clock,
  AlertCircle,
  User,
  Plus,
  MessageCircle,
  Filter,
  Bell
} from "lucide-react";

const DiscussionManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [expandedThreads, setExpandedThreads] = useState({});
  const [replyContent, setReplyContent] = useState({});
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [filter, setFilter] = useState("all"); // all, unanswered, announcements
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        
        // Fetch course details
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data.data);
        
        // Fetch discussions
        const discussionsResponse = await api.get(`/courses/${courseId}/discussions`);
        setDiscussions(discussionsResponse.data.data || []);
      } catch (error) {
        toast.error("Failed to load discussions");
        console.error("Error fetching discussions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId]);
  
  const handleToggleThread = (threadId) => {
    setExpandedThreads(prev => ({
      ...prev,
      [threadId]: !prev[threadId]
    }));
  };
  
  const handleReplyChange = (threadId, value) => {
    setReplyContent(prev => ({
      ...prev,
      [threadId]: value
    }));
  };
  
  const handleSubmitReply = async (threadId) => {
    const content = replyContent[threadId];
    if (!content?.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await api.post(`/discussions/${threadId}/replies`, {
        content,
        user_id: user.id
      });
      
      // Update discussions with new reply
      setDiscussions(discussions.map(discussion => {
        if (discussion.id === threadId) {
          return {
            ...discussion,
            replies: [...(discussion.replies || []), response.data.data]
          };
        }
        return discussion;
      }));
      
      // Clear reply content
      setReplyContent(prev => ({
        ...prev,
        [threadId]: ""
      }));
      
      toast.success("Reply posted successfully");
    } catch (error) {
      toast.error("Failed to post reply");
      console.error("Error posting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleMarkAsAnswer = async (threadId, replyId, isAnswer) => {
    try {
      setIsSubmitting(true);
      await api.patch(`/discussions/${threadId}/replies/${replyId}`, {
        is_answer: isAnswer
      });
      
      // Update discussions with marked answer
      setDiscussions(discussions.map(discussion => {
        if (discussion.id === threadId) {
          return {
            ...discussion,
            replies: discussion.replies.map(reply => 
              reply.id === replyId ? { ...reply, is_answer: isAnswer } : reply
            ),
            has_answer: isAnswer || discussion.replies.some(r => r.id !== replyId && r.is_answer)
          };
        }
        return discussion;
      }));
      
      toast.success(isAnswer ? "Marked as answer" : "Unmarked as answer");
    } catch (error) {
      toast.error("Failed to update answer status");
      console.error("Error updating answer status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteDiscussion = async (threadId) => {
    if (!window.confirm("Are you sure you want to delete this discussion?")) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await api.delete(`/discussions/${threadId}`);
      setDiscussions(discussions.filter(d => d.id !== threadId));
      toast.success("Discussion deleted successfully");
    } catch (error) {
      toast.error("Failed to delete discussion");
      console.error("Error deleting discussion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.trim()) {
      toast.error("Announcement content cannot be empty");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await api.post("/discussions", {
        course_id: courseId,
        title: "Announcement",
        content: newAnnouncement,
        user_id: user.id,
        is_announcement: true
      });
      
      setDiscussions([response.data.data, ...discussions]);
      setNewAnnouncement("");
      toast.success("Announcement posted successfully");
    } catch (error) {
      toast.error("Failed to post announcement");
      console.error("Error posting announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredDiscussions = discussions.filter(discussion => {
    if (filter === "announcements") return discussion.is_announcement;
    if (filter === "unanswered") return !discussion.has_answer && !discussion.is_announcement;
    return true; // "all" filter
  });
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get stats for the discussions
  const stats = {
    total: discussions.length,
    announcements: discussions.filter(d => d.is_announcement).length,
    unanswered: discussions.filter(d => !d.has_answer && !d.is_announcement).length,
    answered: discussions.filter(d => d.has_answer).length
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading discussions...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.discussionManagement}>
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
            <h1 className={styles.title}>Course Discussions</h1>
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
            <MessageCircle size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total Discussions</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Bell size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.announcements}</span>
            <span className={styles.statLabel}>Announcements</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <AlertCircle size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.unanswered}</span>
            <span className={styles.statLabel}>Unanswered</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.answered}</span>
            <span className={styles.statLabel}>Resolved</span>
          </div>
        </div>
      </div>
      
      <div className={styles.announcementSection}>
        <div className={styles.sectionTitle}>
          <Bell size={20} />
          <h2>Post Announcement</h2>
        </div>
        <div className={styles.announcementForm}>
          <textarea
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            placeholder="Write an important announcement for all students..."
            rows={3}
          />
          <button 
            className={styles.postButton} 
            onClick={handleCreateAnnouncement}
            disabled={!newAnnouncement.trim() || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Announcement'}
          </button>
        </div>
      </div>
      
      <div className={styles.discussionsSection}>
        <div className={styles.sectionTitle}>
          <MessageSquare size={20} />
          <h2>Manage Discussions</h2>
        </div>
        
        <div className={styles.discussionFilters}>
          <button
            className={`${styles.filterButton} ${filter === "all" ? styles.activeFilter : ""}`}
            onClick={() => setFilter("all")}
          >
            <span>All</span>
            <span className={styles.filterCount}>{stats.total}</span>
          </button>
          <button
            className={`${styles.filterButton} ${filter === "unanswered" ? styles.activeFilter : ""}`}
            onClick={() => setFilter("unanswered")}
          >
            <span>Unanswered</span>
            <span className={styles.filterCount}>{stats.unanswered}</span>
          </button>
          <button
            className={`${styles.filterButton} ${filter === "announcements" ? styles.activeFilter : ""}`}
            onClick={() => setFilter("announcements")}
          >
            <span>Announcements</span>
            <span className={styles.filterCount}>{stats.announcements}</span>
          </button>
        </div>
        
        <div className={styles.discussionsList}>
          {filteredDiscussions.length === 0 ? (
            <div className={styles.emptyState}>
              <MessageCircle size={48} />
              <h3>No discussions found</h3>
              <p>There are no discussions matching your current filter.</p>
            </div>
          ) : (
            filteredDiscussions.map(discussion => (
              <div 
                key={discussion.id} 
                className={`${styles.discussionCard} ${discussion.is_announcement ? styles.announcement : ""}`}
              >
                <div className={styles.discussionHeader}>
                  <div className={styles.discussionMeta}>
                    {discussion.is_announcement && (
                      <span className={styles.announcementBadge}>
                        <Bell size={12} />
                        <span>Announcement</span>
                      </span>
                    )}
                    <div className={styles.discussionInfo}>
                      <h3>{discussion.title || "Untitled"}</h3>
                      <div className={styles.discussionDetails}>
                        <span className={styles.postedBy}>
                          <User size={14} />
                          {discussion.user?.name || "Unknown"}
                        </span>
                        <span className={styles.postedDate}>
                          <Clock size={14} />
                          {formatDate(discussion.created_at)}
                        </span>
                        <span className={styles.replyCount}>
                          <MessageCircle size={14} />
                          {discussion.replies?.length || 0} replies
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteDiscussion(discussion.id)}
                    title="Delete discussion"
                    disabled={isSubmitting}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className={styles.discussionContent}>
                  <p>{discussion.content}</p>
                </div>
                
                <div className={styles.discussionFooter}>
                  <div className={styles.threadStatus}>
                    {!discussion.is_announcement && !discussion.has_answer && (
                      <span className={styles.unansweredBadge}>
                        <AlertCircle size={14} />
                        <span>Unanswered</span>
                      </span>
                    )}
                    
                    {discussion.has_answer && (
                      <span className={styles.answeredBadge}>
                        <CheckCircle size={14} />
                        <span>Answered</span>
                      </span>
                    )}
                  </div>
                  
                  <button
                    className={styles.toggleRepliesButton}
                    onClick={() => handleToggleThread(discussion.id)}
                  >
                    <span>{expandedThreads[discussion.id] ? "Hide Replies" : "Show Replies"}</span>
                    <ChevronDown className={expandedThreads[discussion.id] ? styles.rotateIcon : ""} />
                  </button>
                </div>
                
                {expandedThreads[discussion.id] && (
                  <div className={styles.repliesSection}>
                    {discussion.replies?.length > 0 ? (
                      <div className={styles.repliesList}>
                        {discussion.replies.map(reply => (
                          <div 
                            key={reply.id} 
                            className={`${styles.replyCard} ${reply.is_answer ? styles.answerCard : ""}`}
                          >
                            {reply.is_answer && (
                              <div className={styles.answerBadge}>
                                <CheckCircle size={12} />
                                <span>Accepted Answer</span>
                              </div>
                            )}
                            
                            <div className={styles.replyHeader}>
                              <div className={styles.replyAuthorInfo}>
                                <div className={styles.replyAuthorAvatar}>
                                  {reply.user?.name?.charAt(0) || "?"}
                                </div>
                                <span className={styles.replyAuthor}>{reply.user?.name || "Unknown"}</span>
                              </div>
                              <span className={styles.replyDate}>{formatDate(reply.created_at)}</span>
                            </div>
                            
                            <div className={styles.replyContent}>
                              <p>{reply.content}</p>
                            </div>
                            
                            <div className={styles.replyActions}>
                              <button
                                className={`${styles.markAnswerButton} ${reply.is_answer ? styles.unmarkButton : ""}`}
                                onClick={() => handleMarkAsAnswer(discussion.id, reply.id, !reply.is_answer)}
                                title={reply.is_answer ? "Unmark as answer" : "Mark as answer"}
                                disabled={isSubmitting}
                              >
                                {reply.is_answer ? (
                                  <>
                                    <XCircle size={16} />
                                    <span>Unmark Answer</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={16} />
                                    <span>Mark as Answer</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noReplies}>No replies yet</div>
                    )}
                    
                    <div className={styles.replyForm}>
                      <textarea
                        value={replyContent[discussion.id] || ""}
                        onChange={(e) => handleReplyChange(discussion.id, e.target.value)}
                        placeholder="Write a reply..."
                        rows={2}
                      />
                      <button
                        className={styles.sendReplyButton}
                        onClick={() => handleSubmitReply(discussion.id)}
                        disabled={!replyContent[discussion.id]?.trim() || isSubmitting}
                      >
                        <Send size={16} />
                        <span>{isSubmitting ? 'Sending...' : 'Reply'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionManagement;