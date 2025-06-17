// LMS-Frontend/lms-client/src/features/instructor/components/DiscussionManagement.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FiMessageCircle, FiArrowUp, FiTrash2, FiEdit, 
  FiCheckCircle, FiXCircle, FiSend, FiChevronDown 
} from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import styles from "./DiscussionManagement.module.css";

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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await axios.get(`/api/courses/${courseId}`);
        setCourse(courseResponse.data.data);
        
        // Fetch discussions
        const discussionsResponse = await axios.get(`/api/courses/${courseId}/discussions`);
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
      const response = await axios.post(`/api/discussions/${threadId}/replies`, {
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
    }
  };
  
  const handleMarkAsAnswer = async (threadId, replyId, isAnswer) => {
    try {
      await axios.patch(`/api/discussions/${threadId}/replies/${replyId}`, {
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
    }
  };
  
  const handleDeleteDiscussion = async (threadId) => {
    if (!window.confirm("Are you sure you want to delete this discussion?")) {
      return;
    }
    
    try {
      await axios.delete(`/api/discussions/${threadId}`);
      setDiscussions(discussions.filter(d => d.id !== threadId));
      toast.success("Discussion deleted successfully");
    } catch (error) {
      toast.error("Failed to delete discussion");
      console.error("Error deleting discussion:", error);
    }
  };
  
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.trim()) {
      toast.error("Announcement content cannot be empty");
      return;
    }
    
    try {
      const response = await axios.post("/api/discussions", {
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
    }
  };
  
  const filteredDiscussions = discussions.filter(discussion => {
    if (filter === "announcements") return discussion.is_announcement;
    if (filter === "unanswered") return !discussion.has_answer && !discussion.is_announcement;
    return true; // "all" filter
  });
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  
  if (loading) {
    return <div className={styles.loading}>Loading discussions...</div>;
  }
  
  return (
    <div className={styles.discussionManagement}>
      <div className={styles.header}>
        <div>
          <h1>Discussion Management</h1>
          <p className={styles.courseTitle}>{course?.title || "Unknown Course"}</p>
        </div>
        
        <button
          className={styles.backButton}
          onClick={() => navigate(`/dashboard/instructor/courses/edit/${courseId}`)}
        >
          Back to Course
        </button>
      </div>
      
      <div className={styles.announcementSection}>
        <h3>Post Announcement</h3>
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
            disabled={!newAnnouncement.trim()}
          >
            Post Announcement
          </button>
        </div>
      </div>
      
      <div className={styles.discussionFilters}>
        <button
          className={`${styles.filterButton} ${filter === "all" ? styles.activeFilter : ""}`}
          onClick={() => setFilter("all")}
        >
          All Discussions
        </button>
        <button
          className={`${styles.filterButton} ${filter === "unanswered" ? styles.activeFilter : ""}`}
          onClick={() => setFilter("unanswered")}
        >
          Unanswered
        </button>
        <button
          className={`${styles.filterButton} ${filter === "announcements" ? styles.activeFilter : ""}`}
          onClick={() => setFilter("announcements")}
        >
          Announcements
        </button>
      </div>
      
      <div className={styles.discussionsList}>
        {filteredDiscussions.length === 0 ? (
          <div className={styles.emptyState}>
            <FiMessageCircle size={50} />
            <p>No discussions found for the selected filter.</p>
          </div>
        ) : (
          filteredDiscussions.map(discussion => (
            <div 
              key={discussion.id} 
              className={`${styles.discussionCard} ${discussion.is_announcement ? styles.announcement : ""}`}
            >
              <div className={styles.discussionHeader}>
                {discussion.is_announcement && (
                  <span className={styles.announcementBadge}>Announcement</span>
                )}
                <div className={styles.discussionInfo}>
                  <h3>{discussion.title || "Untitled"}</h3>
                  <span className={styles.postedBy}>
                    Posted by {discussion.user?.name || "Unknown"} on {formatDate(discussion.created_at)}
                  </span>
                </div>
                
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteDiscussion(discussion.id)}
                  title="Delete discussion"
                >
                  <FiTrash2 />
                </button>
              </div>
              
              <div className={styles.discussionContent}>
                <p>{discussion.content}</p>
              </div>
              
              <div className={styles.discussionFooter}>
                <button
                  className={styles.toggleRepliesButton}
                  onClick={() => handleToggleThread(discussion.id)}
                >
                  {expandedThreads[discussion.id] ? "Hide Replies" : "Show Replies"} 
                  ({discussion.replies?.length || 0})
                  <FiChevronDown className={expandedThreads[discussion.id] ? styles.rotateIcon : ""} />
                </button>
                
                {!discussion.is_announcement && !discussion.has_answer && (
                  <span className={styles.unansweredBadge}>Unanswered</span>
                )}
                
                {discussion.has_answer && (
                  <span className={styles.answeredBadge}>
                    <FiCheckCircle /> Answered
                  </span>
                )}
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
                              <FiCheckCircle /> Accepted Answer
                            </div>
                          )}
                          
                          <div className={styles.replyHeader}>
                            <span className={styles.replyAuthor}>{reply.user?.name || "Unknown"}</span>
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
                            >
                              {reply.is_answer ? (
                                <>
                                  <FiXCircle /> Unmark Answer
                                </>
                              ) : (
                                <>
                                  <FiCheckCircle /> Mark as Answer
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
                      disabled={!replyContent[discussion.id]?.trim()}
                    >
                      <FiSend /> Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscussionManagement;