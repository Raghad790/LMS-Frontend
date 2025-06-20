import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import api from "../../../services/api";
import FileUploader from "./FileUploader";
import styles from "./LessonEditor.module.css";
import {
  ArrowLeft,
  BookOpen,
  Save,
  X,
  AlertCircle,
  FileText,
  Hash,
  Loader,
  Info,
  HelpCircle,
} from "lucide-react";

const lessonSchema = yup.object().shape({
  title: yup.string().required("Lesson title is required"),
  content: yup.string().required("Lesson content is required"),
  position: yup.number().integer().min(0, "Position must be a positive number"),
});

const MarkdownTips = () => (
  <div className={styles.markdownTips}>
    <h4>Markdown Tips</h4>
    <ul>
      <li>
        <code># Heading 1</code> - Large heading
      </li>
      <li>
        <code>## Heading 2</code> - Medium heading
      </li>
      <li>
        <code>**bold**</code> - <strong>Bold text</strong>
      </li>
      <li>
        <code>*italic*</code> - <em>Italic text</em>
      </li>
      <li>
        <code>[Link](https://example.com)</code> - <a href="#">Link</a>
      </li>
      <li>
        <code>- item</code> - Bullet list
      </li>
      <li>
        <code>1. item</code> - Numbered list
      </li>
      <li>
        <code>```code```</code> - Code block
      </li>
      <li>
        <code>![Alt text](image-url)</code> - Image
      </li>
    </ul>
  </div>
);

const LessonEditor = () => {
  const { moduleId, lessonId, courseId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!lessonId;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [courseData, setCourseData] = useState(null);
  const [showMarkdownTips, setShowMarkdownTips] = useState(false);
  const [lessonFiles, setLessonFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(lessonSchema),
    defaultValues: {
      position: 0,
    },
  });

  // Warn users about unsaved changes when navigating away
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (moduleId) {
          // Get module info to show the title
          const moduleResponse = await api.get(`/modules/${moduleId}`);
          setModuleTitle(moduleResponse.data.data.title);

          // Get course info if we have courseId
          if (courseId) {
            const courseResponse = await api.get(`/courses/${courseId}`);
            setCourseData(courseResponse.data.data);
          }
        }

        if (isEditMode) {
          // Get lesson data for edit mode
          const lessonResponse = await api.get(`/lessons/${lessonId}`);
          const lessonData = lessonResponse.data.data;
          reset(lessonData);

          // If we don't have courseId in params, get it from the lesson
          if (!courseId && lessonData.course_id) {
            const courseResponse = await api.get(
              `/courses/${lessonData.course_id}`
            );
            setCourseData(courseResponse.data.data);
          }

          // Get lesson files if any
          try {
            const filesResponse = await api.get(`/lessons/${lessonId}/files`);
            setLessonFiles(filesResponse.data.data || []);
          } catch (error) {
            console.error("Error fetching lesson files:", error);
            setLessonFiles([]);
          }
        }
      } catch (error) {
        toast.error("Failed to load data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId, lessonId, courseId, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      if (isEditMode) {
        await api.put(`/lessons/${lessonId}`, data);
        toast.success("Lesson updated successfully");
      } else {
        await api.post("/lessons", {
          ...data,
          module_id: moduleId,
        });
        toast.success("Lesson created successfully");
      }

      // Navigate back to the module manager
      if (courseId) {
        navigate(`/dashboard/instructor/courses/${courseId}/modules`);
      } else if (data.course_id) {
        navigate(`/dashboard/instructor/courses/${data.course_id}/modules`);
      } else {
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.error("Error saving lesson:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileAdded = (file) => {
    setLessonFiles([...lessonFiles, file]);
  };

  const handleFileDeleted = (fileId) => {
    setLessonFiles(lessonFiles.filter((file) => file.id !== fileId));
  };

  const toggleMarkdownTips = () => {
    setShowMarkdownTips(!showMarkdownTips);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.loadingSpinner} />
        <p>Loading lesson data...</p>
      </div>
    );
  }

  return (
    <div className={styles.lessonEditorPage}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          aria-label="Back to module"
        >
          <ArrowLeft size={18} />
          <span>Back to Module</span>
        </button>
      </div>

      <div className={styles.lessonEditor}>
        <div className={styles.editorHeader}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              {isEditMode ? "Edit Lesson" : "Create New Lesson"}
            </h1>
            {moduleTitle && (
              <p className={styles.moduleTitle}>
                <BookOpen size={16} />
                <span>Module: {moduleTitle}</span>
              </p>
            )}
            {courseData && (
              <p className={styles.courseTitle}>
                <BookOpen size={16} />
                <span>Course: {courseData.title}</span>
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <FileText size={20} />
              <span>Lesson Details</span>
            </h2>

            <div className={styles.formGroup}>
              <label htmlFor="title">Lesson Title*</label>
              <div className={styles.inputWrapper}>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter lesson title"
                  className={errors.title ? styles.inputError : ""}
                  {...register("title")}
                />
                {errors.title && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={16} />
                    <span>{errors.title.message}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWithHelp}>
                <label htmlFor="content">Lesson Content*</label>
                <button
                  type="button"
                  className={styles.helpButton}
                  onClick={toggleMarkdownTips}
                >
                  <HelpCircle size={16} />
                  <span>Markdown Help</span>
                </button>
              </div>

              {showMarkdownTips && <MarkdownTips />}

              <div className={styles.inputWrapper}>
                <textarea
                  id="content"
                  placeholder="Enter lesson content (supports markdown)"
                  rows={15}
                  className={errors.content ? styles.inputError : ""}
                  {...register("content")}
                />
                {errors.content && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={16} />
                    <span>{errors.content.message}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="position">Position (Order in Module)</label>
              <div className={styles.inputWrapper}>
                <div className={styles.positionInput}>
                  <Hash size={16} className={styles.positionIcon} />
                  <input
                    id="position"
                    type="number"
                    min="0"
                    className={errors.position ? styles.inputError : ""}
                    {...register("position")}
                  />
                </div>
                {errors.position && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={16} />
                    <span>{errors.position.message}</span>
                  </div>
                )}
                <p className={styles.helperText}>
                  <Info size={14} />
                  <span>Lessons are displayed in ascending order by position</span>
                </p>
              </div>
            </div>
          </div>

          {isEditMode && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                <FileText size={20} />
                <span>Lesson Materials</span>
              </h2>
              <FileUploader
                lessonId={lessonId}
                existingFiles={lessonFiles}
                onFileAdded={handleFileAdded}
                onFileDeleted={handleFileDeleted}
              />
            </div>
          )}

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader size={16} className={styles.buttonIcon} />
                  <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEditMode ? "Update Lesson" : "Create Lesson"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonEditor;