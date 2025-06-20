import { useState, useEffect } from "react";
import styles from "./TestimonialsSection.module.css";
import { Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Omar Al-Farsi",
      role: "Web Developer",
      company: "Tech Innovate",
      image: "https://via.placeholder.com/100",
      text: "Khatwa completely transformed my career path. I went from basic coding knowledge to becoming a full-stack developer in just 6 months. The structured curriculum and hands-on projects gave me real-world skills that employers value.",
      rating: 5
    },
    {
      id: 2,
      name: "Leila Nasser",
      role: "UX Designer",
      company: "Creative Solutions",
      image: "https://via.placeholder.com/100",
      text: "After completing the UX/UI design courses on Khatwa, I was able to transition from graphic design to UX design seamlessly. The instructors were incredibly knowledgeable and supportive throughout my learning journey.",
      rating: 5
    },
    {
      id: 3,
      name: "Faisal Ibrahim",
      role: "Data Analyst",
      company: "Data Metrics",
      image: "https://via.placeholder.com/100",
      text: "As someone with zero background in data science, Khatwa made the learning process accessible and engaging. The step-by-step approach helped me build confidence and skills that I now use daily in my new role as a data analyst.",
      rating: 5
    },
    {
      id: 4,
      name: "Zainab Khalid",
      role: "Frontend Developer",
      company: "WebSolutions",
      image: "https://via.placeholder.com/100",
      text: "The frontend development path on Khatwa is exceptional. I learned modern frameworks and best practices that made me stand out in job interviews. Within weeks of completing the courses, I received multiple job offers.",
      rating: 5
    }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [autoplay, setAutoplay] = useState(true);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);
  
  const getVisibleCount = () => {
    if (windowWidth >= 1200) return 3;
    if (windowWidth >= 768) return 2;
    return 1;
  };
  
  const visibleCount = getVisibleCount();
  
  const handleDotClick = (index) => {
    setActiveIndex(index);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };
  
  return (
    <section className={styles.section}>
      <div className={styles.shapesContainer}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>SUCCESS STORIES</span>
          <h2 className={styles.title}>What Our Students Say</h2>
          <p className={styles.subtitle}>
            Hear from students who have changed their careers and lives with Khatwa
          </p>
        </div>
        
        <div className={styles.testimonialSlider}>
          <div className={styles.testimonialTrack} style={{ 
            transform: `translateX(-${activeIndex * (100 / visibleCount)}%)`,
            width: `${(testimonials.length / visibleCount) * 100}%`
          }}>
            {testimonials.map(testimonial => (
              <div 
                key={testimonial.id} 
                className={styles.testimonialCard}
                style={{ width: `${100 / testimonials.length * visibleCount}%` }}
              >
                <div className={styles.cardInner}>
                  <div className={styles.quoteIcon}>
                    <Quote size={24} />
                  </div>
                  
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`${styles.star} ${i < testimonial.rating ? styles.filled : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  
                  <p className={styles.testimonialText}>{testimonial.text}</p>
                  
                  <div className={styles.testimonialAuthor}>
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className={styles.authorImage}
                    />
                    <div className={styles.authorInfo}>
                      <h4 className={styles.authorName}>{testimonial.name}</h4>
                      <p className={styles.authorRole}>
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.dots}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;