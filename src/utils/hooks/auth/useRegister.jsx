import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "../../axiosUtils";
export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const register = async (userData, formikRef) => {
    setIsLoading(true);
    setFieldErrors({});

    try {
      const registerPayload = {
        ...userData,
        role_id: userData.role_id || "merchant",
      };

      const response = await api.post("/register", registerPayload);

      if (response.data) {
        const responseData = response.data.data || response.data;
        if (responseData.token) {
          toast.success("Registration successful! Please login to continue.");
          navigate("/admin/login");
          return responseData;
        } else {
          toast.success(
            response.data.message ||
              "Registration successful! Please check your email for verification."
          );
          navigate("/admin/login");
          return responseData;
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      const errorResponse = handleError(error);
      if (errorResponse.data?.errors) {
        const errors = errorResponse.data.errors;
        setFieldErrors(errors);
        if (formikRef) {
          Object.keys(errors).forEach((field) => {
            if (errors[field] && errors[field].length > 0) {
              formikRef.setFieldError(field, errors[field][0]);
            }
          });
        }
        Object.keys(errors).forEach((field) => {
          if (errors[field] && errors[field].length > 0) {
            toast.error(errors[field][0]);
          }
        });
      } else {
        toast.error(
          errorResponse.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, fieldErrors, setFieldErrors };
};
