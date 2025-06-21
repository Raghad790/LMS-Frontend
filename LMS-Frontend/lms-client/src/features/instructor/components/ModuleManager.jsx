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
import styles from "./ModuleManager.module.css";
import {
  ArrowLeft,
  GripVertical,
  Trash2,
  Edit,
  Plus,
  BookOpen,
  Loader,
  FileText,
  Move,
  Calendar,
  MoreVertical,
  Menu,
  X,
} from "lucide-react";

const ModuleManager = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});

  // Current date for display
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
      try {
        setLoading(true);

        // Fetch course details
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data.data);

        // Fetch modules
        const modulesResponse = await api.get(`/courses/${courseId}/modules`);
        const fetchedModules = modulesResponse.data.data || [];

        // Set all modules to expanded by default
        const initialExpandedState = {};
        fetchedModules.forEach((module) => {
          initialExpandedState[module.id] = true;
        });
        setExpandedModules(initialExpandedState);

        setModules(fetchedModules);
      } catch (error) {
        toast.error("Failed to load course modules");
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim()) {
      toast.error("Module title cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/modules", {
        title: newModuleTitle,
        course_id: courseId,
        position: modules.length,
      });

      const newModule = response.data.data;
      setModules([...modules, newModule]);
      setExpandedModules({ ...expandedModules, [newModule.id]: true });
      setNewModuleTitle("");
      toast.success("Module created successfully");
    } catch (error) {
      toast.error("Failed to create module");
      console.error("Error creating module:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this module? This will also delete all lessons inside."
      )
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      await api.delete(`/modules/${moduleId}`);
      setModules(modules.filter((module) => module.id !== moduleId));
      toast.success("Module deleted successfully");
    } catch (error) {
      toast.error("Failed to delete module");
      console.error("Error deleting module:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLesson = (moduleId) => {
    navigate(`/dashboard/instructor/modules/${moduleId}/lessons/create`);
  };

  const handleEditLesson = (lessonId) => {
    navigate(`/dashboard/instructor/lessons/${lessonId}/edit`);
  };

  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules({
      ...expandedModules,
      [moduleId]: !expandedModules[moduleId],
    });
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
        await api.put(`/modules/${module.id}`, { position: index });
      });
      toast.success("Module order updated");
    } catch (error) {
      toast.error("Failed to save module order");
      console.error("Error updating module positions:", error);
    }
  };

  // Calculate stats
  const stats = {
    totalModules: modules.length,
    totalLessons: modules.reduce(
      (total, module) => total + (module.lessons?.length || 0),
      0
    ),
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.loadingSpinner} />
        <p>Loading modules...</p>
      </div>
    );
  }

  return (
    <div className={styles.moduleManager}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backButton}
            onClick={() =>
              navigate(`/dashboard/instructor/courses/edit/${courseId}`)
            }
            aria-label="Back to course"
          >
            <ArrowLeft size={18} />
            <span>Back to Course</span>
          </button>

          <div className={styles.titleArea}>
            <h1 className={styles.title}>Course Modules</h1>
            <p className={styles.courseTitle}>
              {course?.title || "Unknown Course"}
            </p>
          </div>
        </div>

        <div className={styles.dateDisplay}>
          <Calendar size={16} />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BookOpen size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalModules}</span>
            <span className={styles.statLabel}>Total Modules</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalLessons}</span>
            <span className={styles.statLabel}>Total Lessons</span>
          </div>
        </div>
      </div>

      <div className={styles.moduleContainer}>
        <div className={styles.moduleContainerHeader}>
          <div className={styles.sectionTitle}>
            <BookOpen size={20} />
            <h2>Manage Modules</h2>
          </div>

          <div className={styles.newModuleForm}>
            <input
              type="text"
              placeholder="Enter new module title..."
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className={styles.moduleInput}
              disabled={isSubmitting}
            />
            <button
              onClick={handleCreateModule}
              className={styles.addButton}
              disabled={!newModuleTitle.trim() || isSubmitting}
            >
              <Plus size={18} />
              <span>Add Module</span>
            </button>
          </div>
        </div>

        {modules.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <BookOpen size={48} />
            </div>
            <h3>No Modules Created Yet</h3>
            <p>
              This course doesn't have any modules yet. Add your first module to
              get started with your course content.
            </p>
          </div>
        ) : (
          <div className={styles.dragInstructions}>
            <Move size={16} />
            <span>Drag modules to reorder them</span>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={modules.map((module) => module.id)}>
            <div className={styles.moduleList}>
              {modules.map((module) => (
                <SortableModule
                  key={module.id}
                  module={module}
                  isExpanded={expandedModules[module.id]}
                  onToggleExpand={() => toggleModuleExpansion(module.id)}
                  onDelete={handleDeleteModule}
                  onAddLesson={handleAddLesson}
                  onEditLesson={handleEditLesson}
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

const SortableModule = ({
  module,
  isExpanded,
  onToggleExpand,
  onDelete,
  onAddLesson,
  onEditLesson,
  disabled,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  const lessonCount = module.lessons?.length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.moduleItem} ${isDragging ? styles.dragging : ""}`}
    >
      <div className={styles.moduleHeader}>
        <div className={styles.moduleHeaderLeft}>
          <div {...listeners} {...attributes} className={styles.dragHandle}>
            <GripVertical size={20} />
          </div>
          <div className={styles.moduleInfo}>
            <h3>{module.title}</h3>
            <span className={styles.lessonCount}>
              {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
            </span>
          </div>
        </div>

        <div className={styles.moduleActions}>
          <button
            onClick={onToggleExpand}
            className={styles.expandButton}
            aria-label={isExpanded ? "Collapse module" : "Expand module"}
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            onClick={() => onDelete(module.id)}
            className={styles.deleteButton}
            disabled={disabled}
            aria-label="Delete module"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.moduleContent}>
          <div className={styles.lessonList}>
            {lessonCount > 0 ? (
              module.lessons.map((lesson) => (
                <div key={lesson.id} className={styles.lessonItem}>
                  <div className={styles.lessonInfo}>
                    <FileText size={16} />
                    <span>{lesson.title}</span>
                  </div>
                  <button
                    onClick={() => onEditLesson(lesson.id)}
                    className={styles.editButton}
                    disabled={disabled}
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.noLessons}>
                <p>No lessons yet in this module</p>
              </div>
            )}
          </div>

          <button
            onClick={() => onAddLesson(module.id)}
            className={styles.addLessonButton}
            disabled={disabled}
          >
            <Plus size={16} />
            <span>Add New Lesson</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ModuleManager;
