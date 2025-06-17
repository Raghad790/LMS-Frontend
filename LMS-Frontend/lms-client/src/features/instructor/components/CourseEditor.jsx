import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./CourseEditor.module.css";

const courseSchema = yup.object().shape({
  title: yup.string().required("Course title is required"),
  description: yup.string().required("Description is required"),
  level: yup.string().required("Please select a difficulty level"),
  category_id: yup.string().required("Please select a category"),
  price: yup.number().min(0, "Price cannot be negative"),
  is_published: yup.boolean(),
});

const CourseEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!courseId;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: {
      is_published: false,
      price: 0,
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data.data);
      } catch (error) {
        toast.error("Failed to load categories");
        console.error("Error fetching categories:", error);
      }
    };

    const fetchCourse = async () => {
      if (isEditMode) {
        try {
          const response = await axios.get(`/api/courses/${courseId}`);
          const courseData = response.data.data;
          reset({
            ...courseData,
            category_id: courseData.category?.id || "",
          });
        } catch (error) {
          toast.error("Failed to load course data");
          console.error("Error fetching course:", error);
          navigate("/dashboard/instructor");
        }
      }
      setLoading(false);
    };

    fetchCategories();
    fetchCourse();
  }, [courseId, isEditMode, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await axios.put(`/api/courses/${courseId}`, data);
        toast.success("Course updated successfully");
      } else {
        await axios.post("/api/courses", data);
        toast.success("Course created successfully");
      }
      navigate("/dashboard/instructor");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("Error saving course:", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.courseEditor}>
      <h1>{isEditMode ? "Edit Course" : "Create New Course"}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Course Title*</label>
          <input 
            id="title"
            type="text"
            placeholder="Enter course title"
            {...register("title")}
          />
          {errors.title && <p className={styles.error}>{errors.title.message}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="description">Description*</label>
          <textarea 
            id="description"
            placeholder="Enter course description"
            rows={5}
            {...register("description")}
          />
          {errors.description && <p className={styles.error}>{errors.description.message}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="level">Difficulty Level*</label>
          <select id="level" {...register("level")}>
            <option value="">Select difficulty level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {errors.level && <p className={styles.error}>{errors.level.message}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="category">Category*</label>
          <select id="category" {...register("category_id")}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className={styles.error}>{errors.category_id.message}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="price">Price</label>
          <input 
            id="price"
            type="number" 
            min="0" 
            step="0.01"
            {...register("price")}
          />
          {errors.price && <p className={styles.error}>{errors.price.message}</p>}
        </div>
        
        <div className={styles.checkboxGroup}>
          <input 
            id="isPublished"
            type="checkbox"
            {...register("is_published")}
          />
          <label htmlFor="isPublished">Publish this course</label>
        </div>
        
        <div className={styles.buttons}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={() => navigate("/dashboard/instructor")}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            {isEditMode ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseEditor;