// src/features/instructor/components/QuizBuilder.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";
import api from "../../../services/api";
import styles from "./QuizBuilder.module.css";
import {
  ArrowLeft,
  GripVertical,
  Trash2,
  PlusCircle,
  Save,
  HelpCircle,
  AlertCircle,
  Loader,
  Move,
  MessageSquare,
  Edit,
} from "lucide-react";

const QuizBuilder = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [course, setCourse] = useState(null);
  const isEditMode = !!quizId;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);

        // Get course info
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data.data);

        let endpoint = `/courses/${courseId}/quiz`;

        if (isEditMode) {
          endpoint = `/quizzes/${quizId}`;
        }

        const response = await api.get(endpoint);
        setQuestions(response.data.data?.questions || []);
      } catch (error) {
        toast.error("Failed to load quiz questions");
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, quizId, isEditMode]);

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) {
      toast.error("Question text cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      const endpoint = isEditMode
        ? `/quizzes/${quizId}/questions`
        : `/courses/${courseId}/quiz/questions`;

      const response = await api.post(endpoint, {
        text: newQuestion,
        position: questions.length,
      });

      setQuestions([...questions, response.data.data]);
      setNewQuestion("");
      toast.success("Question added successfully");
    } catch (error) {
      toast.error("Failed to add question");
      console.error("Error adding question:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      setSubmitting(true);
      await api.delete(`/quiz/questions/${questionId}`);
      setQuestions(questions.filter((q) => q.id !== questionId));
      toast.success("Question deleted successfully");
    } catch (error) {
      toast.error("Failed to delete question");
      console.error("Error deleting question:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    const reorderedQuestions = arrayMove(questions, oldIndex, newIndex);
    setQuestions(reorderedQuestions);

    // Update positions in the backend
    try {
      reorderedQuestions.forEach(async (question, index) => {
        await api.put(`/quiz/questions/${question.id}`, {
          position: index,
        });
      });
      toast.success("Question order updated");
    } catch (error) {
      toast.error("Failed to save question order");
      console.error("Error updating question positions:", error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.loadingSpinner} />
        <p>Loading quiz questions...</p>
      </div>
    );
  }

  return (
    <div className={styles.quizBuilderPage}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() =>
            navigate(`/dashboard/instructor/courses/${courseId}/quizzes`)
          }
          aria-label="Back to quizzes"
        >
          <ArrowLeft size={18} />
          <span>Back to Quizzes</span>
        </button>
      </div>

      <div className={styles.quizBuilder}>
        <div className={styles.builderHeader}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              {isEditMode ? "Edit Quiz" : "Create New Quiz"}
            </h1>
            {course && (
              <p className={styles.courseTitle}>Course: {course.title}</p>
            )}
          </div>
        </div>

        <div className={styles.builderContent}>
          <div className={styles.questionFormSection}>
            <h2 className={styles.sectionTitle}>
              <MessageSquare size={20} />
              <span>Quiz Questions</span>
            </h2>

            <div className={styles.newQuestionForm}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Enter new question text..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className={styles.questionInput}
                  disabled={submitting}
                />
                <button
                  onClick={handleAddQuestion}
                  className={styles.addButton}
                  disabled={!newQuestion.trim() || submitting}
                >
                  <PlusCircle size={18} />
                  <span>Add Question</span>
                </button>
              </div>

              <div className={styles.helpText}>
                <HelpCircle size={16} />
                <span>You can drag questions to reorder them</span>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className={styles.emptyState}>
                <AlertCircle size={48} />
                <h3>No Questions Added Yet</h3>
                <p>
                  Add your first question using the form above to get started.
                </p>
              </div>
            ) : (
              <div className={styles.dragInstructions}>
                <Move size={16} />
                <span>Drag questions to reorder them</span>
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={questions.map((q) => q.id)}>
                <div className={styles.questionList}>
                  {questions.map((question, index) => (
                    <SortableQuestion
                      key={question.id}
                      question={question}
                      index={index}
                      onDelete={handleDeleteQuestion}
                      disabled={submitting}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
};

const SortableQuestion = ({ question, index, onDelete, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.questionItem} ${isDragging ? styles.dragging : ""}`}
    >
      <div className={styles.questionNumber}>Q{index + 1}</div>

      <div className={styles.questionText}>{question.text}</div>

      <div className={styles.questionActions}>
        <div
          {...listeners}
          {...attributes}
          className={styles.dragHandle}
          title="Drag to reorder"
        >
          <GripVertical size={18} />
        </div>

        <button
          onClick={() => onDelete(question.id)}
          className={styles.deleteButton}
          disabled={disabled}
          title="Delete question"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default QuizBuilder;
