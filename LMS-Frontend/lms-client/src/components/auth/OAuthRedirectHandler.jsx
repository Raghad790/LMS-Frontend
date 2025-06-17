import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import styles from "./OAuthRedirectHandler.module.css";

const OAuthRedirectHandler = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res?.data?.user || res?.data?.data) {
          const user = res.data.user || res.data.data;
          login(user);
          const role = user.role;
          if (role === "student") navigate("/dashboard");
          else if (role === "admin") navigate("/dashboard/admin");
          else if (role === "instructor") navigate("/dashboard/instructor");
          else navigate("/");
        } else {
          navigate("/unauthorized");
        }
      } catch (err) {
        console.error("OAuth redirect failed", err);
        navigate("/login");
      }
    };

    restoreUser();
  }, [login, navigate]); // Added 'login' and 'navigate' to the dependency array

 return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>Logging you in with Google...</p>
    </div>
  );
};

export default OAuthRedirectHandler;