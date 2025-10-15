import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { api } from "../../axiosUtils";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (values) => {
    setIsLoading(true);

    try {
      const loginPayload = {
        email: values.email,
        password: values.password,
        role_id: "merchant",
      };

      const response = await api.post("/login", loginPayload);

      if (response.data && response.data.data && response.data.data.token) {
        const { token, user } = response.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role_id.toString());

        dispatch({
          type: "LOGIN",
          payload: user,
        });

        sessionStorage.removeItem("registrationEmail");
        sessionStorage.removeItem("registrationPassword");

        toast.success("Login successful!");

        navigate("/super-admin/dashboard");
      } else {
        toast.error(
          response.data?.message || "Login failed. Please try again.",
          { variant: "error" }
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
        { variant: "error" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
