// src/utils/logoutHandler.js
import api from "../services/api";
import { toast } from "react-toastify";

export const logoutAndRedirect = async () => {
  try {
    await api.post("/auth/logout");
    toast.info("Session expired. You have been logged out.", {
      position: "top-center",
      autoClose: 5000,
    });
  } catch (err) {
    console.warn("Logout failed", err);
    toast.error("Logout failed. Please try again.", {
      position: "top-center",
      autoClose: 5000,
    });
  } finally {
    window.location.href = "/"; // 👈 redirect to homepage
  }
};
