import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./QuizBuilder.module.css";

const QuizBuilder = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}/quiz`);
        setQuestions(response.data.data || []);
      } catch (error) {
        toast.error("Failed to load quiz questions");
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [courseId]);

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) {
      toast.error("Question text cannot be empty");
      return;
    }

    try {
      const response = await axios.post(`/api/courses/${courseId}/quiz`, {
        text: newQuestion,
        position: questions.length,
      });

      setQuestions([...questions, response.data.data]);
      setNewQuestion("");
      toast.success("Question added successfully");
    } catch (error) {
      toast.error("Failed to add question");
      console.error("Error adding question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await axios.delete(`/api/courses/${courseId}/quiz/${questionId}`);
      setQuestions(questions.filter((q) => q.id !== questionId));
      toast.success("Question deleted successfully");
    } catch (error) {
      toast.error("Failed to delete question");
      console.error("Error deleting question:", error);
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
        await axios.put(`/api/courses/${courseId}/quiz/${question.id}`, {
          position: index,
        });
      });
    } catch (error) {
      toast.error("Failed to save question order");
      console.error("Error updating question positions:", error);
    }
  };

  return (
    <div className={styles.quizBuilder}>
      <div className={styles.header}>
        <h1>Quiz Builder</h1>
        <button
          className={styles.backButton}
          onClick={() => navigate(`/dashboard/instructor/courses/edit/${courseId}`)}
        >
          Back to Course
        </button>
      </div>

      <div className={styles.newQuestionForm}>
        <input
          type="text"
          placeholder="New question text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className={styles.questionInput}
        />
        <button onClick={handleAddQuestion} className={styles.addButton}>
          Add Question
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map((q) => q.id)}>
          <div className={styles.questionList}>
            {questions.map((question) => (
              <SortableQuestion
                key={question.id}
                question={question}
                onDelete={handleDeleteQuestion}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const SortableQuestion = ({ question, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.questionItem}>
      <div className={styles.questionText}>{question.text}</div>
      <div className={styles.actions}>
        <button
          onClick={() => onDelete(question.id)}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>
      <div {...listeners} {...attributes} className={styles.dragHandle}>
        ⋮⋮
      </div>
    </div>
  );
};

export default QuizBuilder;