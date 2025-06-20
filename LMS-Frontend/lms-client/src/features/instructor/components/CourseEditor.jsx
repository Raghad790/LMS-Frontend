// src/features/instructor/components/CourseEditor.jsx - Update thumbnail handling
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import api from "../../../services/api";
import styles from "./CourseEditor.module.css";
import {
  ArrowLeft,
  BookOpen,
  AlertCircle,
  FileText,
  Tag,
  BarChart2,
  Loader,
  Check,
  Image,
  Upload,
} from "lucide-react";
import FileUploader from "../../../components/ui/FileUploader/FileUploader";
// Fallback categories if API fails
const FALLBACK_CATEGORIES = [
  { id: 1, name: "Programming" },
  { id: 2, name: "Business" },
  { id: 3, name: "Design" },
  { id: 4, name: "Marketing" },
];

// Updated schema - removed price validation
const courseSchema = yup.object().shape({
  title: yup.string().required("Course title is required"),
  description: yup.string().required("Description is required"),
  level: yup.string().required("Please select a difficulty level"),
  category_id: yup.string().required("Please select a category"),
  is_published: yup.boolean(),
});

const CourseEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!courseId;
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [uploadedThumbnail, setUploadedThumbnail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: {
      is_published: false,
      // Removed price default
    },
  });

  // Watch form values for real-time preview
  const watchTitle = watch("title", "");
  const watchLevel = watch("level", "");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        let categoriesData = [];
        if (response.data?.categories) {
          categoriesData = response.data.categories;
        } else if (response.data?.data) {
          categoriesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          categoriesData = response.data;
        }
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchCourse = async () => {
      if (isEditMode) {
        try {
          console.log(`Fetching course with ID: ${courseId}`);
          setLoading(true);

          // Log the auth token status
          const token = localStorage.getItem("token");
          console.log("Auth token present:", !!token);

          const response = await api.get(`/courses/${courseId}`);
          console.log("Course data:", response.data);

          // Handle different API response formats
          let courseData;
          if (response.data?.course) {
            courseData = response.data.course;
          } else if (response.data?.data) {
            courseData = response.data.data;
          } else {
            courseData = response.data;
          }

          if (courseData) {
            console.log("Resetting form with:", courseData);
            reset({
              ...courseData,
              category_id: String(courseData.category_id) || "",
              is_published: Boolean(courseData.is_published),
              level: courseData.level || "beginner", // Provide default
              // Removed price field
            });

            // Set thumbnail preview if available
            if (courseData.thumbnail_url) {
              setThumbnailPreview(courseData.thumbnail_url);
            }
          }
        } catch (error) {
          console.error("Error fetching course:", error);

          // Show more detailed error information
          if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);

            // Show more specific error message
            if (error.response.status === 403) {
              toast.error("You don't have permission to edit this course");
            } else if (error.response.status === 404) {
              toast.error("Course not found");
            } else {
              toast.error(
                `Error: ${
                  error.response.data.message || "Failed to load course"
                }`
              );
            }
          } else {
            toast.error("Network error while loading course");
          }

          // Navigate back on error after showing the toast
          setTimeout(() => navigate("/dashboard/instructor/courses"), 2000);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchCourse();
  }, [courseId, isEditMode, reset, navigate]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Handle when a file is uploaded via the FileUploader component
  const handleThumbnailUpload = (fileData) => {
    setUploadedThumbnail(fileData);
    setThumbnailPreview(fileData.secure_url);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Create FormData for submission
      const formData = new FormData();

      // Add form data
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("level", data.level);
      formData.append("category_id", data.category_id);
      formData.append("is_published", data.is_published);

      // If we have an uploaded file, add the secure URL
      if (uploadedThumbnail) {
        formData.append("thumbnail_url", uploadedThumbnail.secure_url);
      }
      // Or if we have a file selected for upload, append it
      else if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      console.log("Form data being sent:");
      console.log("- title:", data.title);
      console.log("- description:", data.description);
      console.log("- level:", data.level);
      console.log("- category_id:", data.category_id);
      console.log("- is_published:", data.is_published);

      if (isEditMode) {
        await api.put(`/courses/${courseId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Course updated successfully");
      } else {
        await api.post("/courses", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Course created successfully");
      }
      navigate("/dashboard/instructor/courses");
    } catch (error) {
      console.error("Form submission error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred while saving the course");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "#41ce8e";
      case "intermediate":
        return "#ffab49";
      case "advanced":
        return "#ff6b8b";
      default:
        return "#6c6f7d";
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.loadingSpinner} />
        <p>Loading course data...</p>
      </div>
    );
  }

  return (
    <div className={styles.courseEditorPage}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/dashboard/instructor/courses")}
          aria-label="Back to courses"
        >
          <ArrowLeft size={18} />
          <span>Back to Courses</span>
        </button>

        <h1 className={styles.title}>
          {isEditMode ? "Edit Course" : "Create New Course"}
        </h1>
      </div>

      <div className={styles.courseEditorContent}>
        <div className={styles.courseEditor}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                <BookOpen size={20} />
                <span>Basic Information</span>
              </h2>

              <div className={styles.formGroup}>
                <label htmlFor="title">Course Title*</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter course title"
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
                <label htmlFor="description">Description*</label>
                <div className={styles.inputWrapper}>
                  <textarea
                    id="description"
                    placeholder="Enter course description"
                    rows={5}
                    className={errors.description ? styles.inputError : ""}
                    {...register("description")}
                  />
                  {errors.description && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{errors.description.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                <Tag size={20} />
                <span>Course Details</span>
              </h2>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="level">Difficulty Level*</label>
                  <div className={styles.inputWrapper}>
                    <select
                      id="level"
                      className={errors.level ? styles.inputError : ""}
                      {...register("level")}
                    >
                      <option value="">Select difficulty level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    {errors.level && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={16} />
                        <span>{errors.level.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category">Category*</label>
                  <div className={styles.inputWrapper}>
                    <select
                      id="category"
                      className={errors.category_id ? styles.inputError : ""}
                      {...register("category_id")}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={16} />
                        <span>{errors.category_id.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                <Image size={20} />
                <span>Course Thumbnail</span>
              </h2>

              {/* Either use the FileUploader component */}
              <FileUploader
                onUploadComplete={handleThumbnailUpload}
                acceptTypes="image/*"
                maxSizeMB={5}
              />

              {/* Or keep your existing manual upload UI */}
              {!uploadedThumbnail && (
                <div className={styles.thumbnailUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    id="thumbnail"
                    onChange={handleThumbnailChange}
                    className={styles.fileInput}
                  />
                  <label htmlFor="thumbnail" className={styles.thumbnailLabel}>
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Course thumbnail preview"
                        className={styles.thumbnailPreview}
                      />
                    ) : (
                      <div className={styles.uploadPlaceholder}>
                        <Upload size={32} />
                        <p>Upload Thumbnail</p>
                        <span>Recommended size: 1280×720px</span>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>

            <div className={styles.formSection}>
              <div className={styles.toggleSwitch}>
                <input
                  id="isPublished"
                  type="checkbox"
                  {...register("is_published")}
                />
                <label htmlFor="isPublished" className={styles.switchLabel}>
                  <span className={styles.switchToggle}></span>
                  Publish this course
                </label>
              </div>

              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => navigate("/dashboard/instructor/courses")}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className={styles.buttonIcon} />
                      <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} className={styles.buttonIcon} />
                      <span>
                        {isEditMode ? "Update Course" : "Create Course"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className={styles.previewContainer}>
          <h2 className={styles.previewTitle}>
            <FileText size={20} />
            <span>Course Preview</span>
          </h2>

          <div className={styles.coursePreview}>
            <div className={styles.coursePreviewImage}>
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Course thumbnail" />
              ) : (
                <div className={styles.placeholderImage}>
                  <FileText size={40} />
                </div>
              )}
            </div>

            <div className={styles.coursePreviewContent}>
              <h3 className={styles.previewCourseTitle}>
                {watchTitle || "Course Title"}
              </h3>

              {watchLevel && (
                <div
                  className={styles.courseLevel}
                  style={{
                    backgroundColor: getLevelColor(watchLevel) + "20",
                    color: getLevelColor(watchLevel),
                  }}
                >
                  <BarChart2 size={14} />
                  <span>
                    {watchLevel.charAt(0).toUpperCase() + watchLevel.slice(1)}
                  </span>
                </div>
              )}

              <div className={styles.coursePrice}>
                <span className={styles.freeTag}>Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
