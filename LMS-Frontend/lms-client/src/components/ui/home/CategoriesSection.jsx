import { Link } from "react-router-dom";
import styles from "./CategoriesSection.module.css";
import { Code, Palette, ChartBar, Database, Server, BookOpen, Globe, Briefcase } from "lucide-react";

const CategoriesSection = () => {
  const categories = [
    {
      id: 1,
      name: "Web Development",
      description: "Learn to build modern, responsive websites and web applications",
      icon: Code,
      color: "#7f56da",
      courses: 42,
      backgroundImage: "https://via.placeholder.com/400x250"
    },
    {
      id: 2,
      name: "UI/UX Design",
      description: "Master the art of creating beautiful user interfaces and experiences",
      icon: Palette,
      color: "#ea6fb8",
      courses: 35,
      backgroundImage: "https://via.placeholder.com/400x250"
    },
    {
      id: 3,
      name: "Data Science",
      description: "Learn to analyze data and extract valuable insights with modern tools",
      icon: ChartBar,
      color: "#56c2da",
      courses: 28,
      backgroundImage: "https://via.placeholder.com/400x250"
    },
    {
      id: 4,
      name: "Database Management",
      description: "Design and maintain efficient databases for your applications",
      icon: Database,
      color: "#da8256",
      courses: 19,
      backgroundImage: "https://via.placeholder.com/400x250"
    },
    {
      id: 5,
      name: "Backend Development",
      description: "Build powerful server-side applications and APIs",
      icon: Server,
      color: "#56da69",
      courses: 31,
      backgroundImage: "https://via.placeholder.com/400x250"
    },
    {
      id: 6,
      name: "Language Learning",
      description: "Master new languages with our interactive courses",
      icon: Globe,
      color: "#5668da",
      courses: 24,
      backgroundImage: "https://via.placeholder.com/400x250"
    },
    {
      id: 7,
      name: "Academic Studies",
      description: "Supplement your academic learning with our comprehensive courses",
      icon: BookOpen,
      color: "#da56a2",
      courses: 37,
      backgroundImage: "https://via.placeholder.com/400x250"
    },
    {
      id: 8,
      name: "Business Skills",
      description: "Develop essential professional skills for the modern workplace",
      icon: Briefcase,
      color: "#dac156",
      courses: 26,
      backgroundImage: "https://via.placeholder.com/400x250"
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>EXPLORE</span>
          <h2 className={styles.title}>Browse Top Categories</h2>
          <p className={styles.subtitle}>
            Discover our wide range of courses across diverse subjects to find your perfect learning path
          </p>
        </div>
        
        <div className={styles.categoriesGrid}>
          {categories.map(category => (
            <Link key={category.id} to={`/categories/${category.id}`} className={styles.categoryCard}>
              <div className={styles.categoryImageWrapper}>
                <img 
                  src={category.backgroundImage} 
                  alt={category.name} 
                  className={styles.categoryImage} 
                />
                <div className={styles.overlay}></div>
              </div>
              
              <div className={styles.categoryContent}>
                <div 
                  className={styles.iconWrapper} 
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <category.icon size={24} color={category.color} />
                </div>
                
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDesc}>{category.description}</p>
                <div className={styles.courseCount}>{category.courses} Courses</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;