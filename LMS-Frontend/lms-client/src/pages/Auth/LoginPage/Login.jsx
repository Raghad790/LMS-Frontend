import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "../../../components/ui/auth/LoginForm";

function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") navigate("/dashboard/admin");
      else if (user.role === "instructor") navigate("/dashboard/instructor");
      else navigate("/dashboard");
    }
  }, [user, loading, navigate]); // Added 'navigate' to the dependency array

  return <LoginForm />;
}

export default Login;
