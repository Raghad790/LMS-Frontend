import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./ModuleManager.module.css";

const ModuleManager = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/courses/${courseId}/modules`);
        setModules(response.data.data || []);
      } catch (error) {
        toast.error("Failed to load course modules");
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim()) {
      toast.error("Module title cannot be empty");
      return;
    }

    try {
      const response = await axios.post("/api/modules", {
        title: newModuleTitle,
        course_id: courseId,
        position: modules.length,
      });

      setModules([...modules, response.data.data]);
      setNewModuleTitle("");
      toast.success("Module created successfully");
    } catch (error) {
      toast.error("Failed to create module");
      console.error("Error creating module:", error);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (
      !confirm(
        "Are you sure you want to delete this module? This will also delete all lessons inside."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/api/modules/${moduleId}`);
      setModules(modules.filter((module) => module.id !== moduleId));
      toast.success("Module deleted successfully");
    } catch (error) {
      toast.error("Failed to delete module");
      console.error("Error deleting module:", error);
    }
  };

  const handleAddLesson = (moduleId) => {
    navigate(`/dashboard/instructor/modules/${moduleId}/lessons/create`);
  };

  const handleEditLesson = (lessonId) => {
    navigate(`/dashboard/instructor/lessons/${lessonId}/edit`);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = modules.findIndex((module) => module.id === active.id);
    const newIndex = modules.findIndex((module) => module.id === over.id);

    const reorderedModules = arrayMove(modules, oldIndex, newIndex);
    setModules(reorderedModules);

    // Update position in backend
    try {
      reorderedModules.forEach(async (module, index) => {
        await axios.put(`/api/modules/${module.id}`, { position: index });
      });
    } catch (error) {
      toast.error("Failed to save module order");
      console.error("Error updating module positions:", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading modules...</div>;
  }

  return (
    <div className={styles.moduleManager}>
      <div className={styles.header}>
        <h1>Course Modules</h1>
        <button
          className={styles.backButton}
          onClick={() =>
            navigate(`/dashboard/instructor/courses/edit/${courseId}`)
          }
        >
          Back to Course
        </button>
      </div>

      <div className={styles.newModuleForm}>
        <input
          type="text"
          placeholder="New module title"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          className={styles.moduleInput}
        />
        <button onClick={handleCreateModule} className={styles.addButton}>
          Add Module
        </button>
      </div>

      {modules.length === 0 ? (
        <div className={styles.empty}>
          <p>
            This course doesn't have any modules yet. Add your first module to
            get started.
          </p>
        </div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={modules.map((module) => module.id)}>
            <div className={styles.moduleList}>
              {modules.map((module) => (
                <SortableModule
                  key={module.id}
                  module={module}
                  onDelete={handleDeleteModule}
                  onAddLesson={handleAddLesson}
                  onEditLesson={handleEditLesson}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

const SortableModule = ({ module, onDelete, onAddLesson, onEditLesson }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.moduleItem}>
      <div className={styles.moduleHeader}>
        <div {...listeners} {...attributes} className={styles.dragHandle}>
          ⋮⋮
        </div>
        <h3>{module.title}</h3>
        <button
          onClick={() => onDelete(module.id)}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>

      <div className={styles.lessonList}>
        {module.lessons &&
          module.lessons.map((lesson) => (
            <div key={lesson.id} className={styles.lessonItem}>
              <span>{lesson.title}</span>
              <button
                onClick={() => onEditLesson(lesson.id)}
                className={styles.editButton}
              >
                Edit
              </button>
            </div>
          ))}

        <button
          onClick={() => onAddLesson(module.id)}
          className={styles.addLessonButton}
        >
          + Add Lesson
        </button>
      </div>
    </div>
  );
};

export default ModuleManager;