import { toast } from "react-toastify";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../../axiosUtils";
import Cookies from "js-cookie";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const clearAuthData = () => {
    dispatch({ type: "LOGOUT" });

    localStorage.removeItem("token");
    localStorage.removeItem("reportedItems");
    localStorage.removeItem("user");
    localStorage.removeItem("phone");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("products");
    localStorage.removeItem("email");
    Cookies.remove("uat");
    Cookies.remove("ue");
    Cookies.remove("account");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      if (error.response?.status !== 401) {
      }
    } finally {
      clearAuthData();

      navigate("/admin/login", { replace: true });
      setTimeout(() => {
        toast.success("You are successfully logged out");
      }, 100);
    }
  };

  return { logout };
};
