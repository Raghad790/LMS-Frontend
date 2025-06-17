import HomeHero from "../../components/ui/home/HomeHero";
import HomeCoursesSection from "../../components/ui/home/HomeCoursesSection";
import Footer from "../../components/layout/Footer/Footer";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton/ScrollToTopButton";
import styles from "./Home.module.css";
function Home() {
  return (
   
<div className={styles.pageWrapper} >
      <HomeHero />
      <HomeCoursesSection />
       <Footer />
      <ScrollToTopButton />
 </div>
  );
}

export default Home;
