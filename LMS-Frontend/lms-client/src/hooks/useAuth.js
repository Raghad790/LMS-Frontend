import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

// Custom hook for using auth context
const useAuth = () => useContext(AuthContext);

export default useAuth;
