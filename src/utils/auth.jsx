import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const userSession = JSON.parse(localStorage.getItem("userSession")); // Get session from localStorage

  useEffect(() => {
    if (!userSession) {
      toast.info("🔒 Please log in first!", { autoClose: 2000 });
      console.log("No user session found. Redirecting to login...");
      navigate('/'); // Redirect to login page
    }
  }, [userSession, navigate]);
};
