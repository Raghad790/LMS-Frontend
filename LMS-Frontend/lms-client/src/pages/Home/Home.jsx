import HomeHero from "../../components/ui/home/HomeHero";
import HomeCoursesSection from "../../components/ui/home/HomeCoursesSection";
import FeaturedInstructors from "../../components/ui/home/FeaturedInstructors";
import TestimonialsSection from "../../components/ui/home/TestimonialsSection";
import CategoriesSection from "../../components/ui/home/CategoriesSection";
import HowItWorksSection from "../../components/ui/home/HowItWorksSection";
import StatisticsSection from "../../components/ui/home/StatisticsSection";
import Footer from "../../components/layout/Footer/Footer";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton/ScrollToTopButton";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.pageWrapper}>
      <HomeHero />
      <CategoriesSection />
      <HomeCoursesSection />
      <HowItWorksSection />
      <StatisticsSection />
      <FeaturedInstructors />
      <TestimonialsSection />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default Home;