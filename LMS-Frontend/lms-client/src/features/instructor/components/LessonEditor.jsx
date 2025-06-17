import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./LessonEditor.module.css";

const lessonSchema = yup.object().shape({
  title: yup.string().required("Lesson title is required"),
  content: yup.string().required("Lesson content is required"),
  position: yup.number().integer().min(0)
});

const LessonEditor = () => {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!lessonId;
  const [loading, setLoading] = useState(true);
  const [moduleTitle, setModuleTitle] = useState("");
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(lessonSchema),
    defaultValues: {
      position: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (moduleId) {
          // Get module info to show the title
          const moduleResponse = await axios.get(`/api/modules/${moduleId}`);
          setModuleTitle(moduleResponse.data.data.title);
        }
        
        if (isEditMode) {
          // Get lesson data for edit mode
          const lessonResponse = await axios.get(`/api/lessons/${lessonId}`);
          reset(lessonResponse.data.data);
        }
      } catch (error) {
        toast.error("Failed to load data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId, lessonId, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await axios.put(`/api/lessons/${lessonId}`, data);
        toast.success("Lesson updated successfully");
      } else {
        await axios.post("/api/lessons", {
          ...data,
          module_id: moduleId
        });
        toast.success("Lesson created successfully");
      }
      
      // Navigate back to the module manager
      if (moduleId) {
        navigate(`/dashboard/instructor/courses/${data.course_id}/modules`);
      } else {
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.error("Error saving lesson:", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.lessonEditor}>
      <div className={styles.header}>
        <h1>{isEditMode ? "Edit Lesson" : `Add Lesson to "${moduleTitle}"`}</h1>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Lesson Title*</label>
          <input 
            id="title"
            type="text"
            placeholder="Enter lesson title"
            {...register("title")}
          />
          {errors.title && <p className={styles.error}>{errors.title.message}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="content">Lesson Content*</label>
          <textarea 
            id="content"
            placeholder="Enter lesson content (supports markdown)"
            rows={15}
            {...register("content")}
          />
          {errors.content && <p className={styles.error}>{errors.content.message}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="position">Position (Order in Module)</label>
          <input 
            id="position"
            type="number"
            min="0"
            {...register("position")}
          />
          {errors.position && <p className={styles.error}>{errors.position.message}</p>}
        </div>
        
        <div className={styles.buttons}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            {isEditMode ? "Update Lesson" : "Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonEditor;