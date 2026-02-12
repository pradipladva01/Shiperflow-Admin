import axios from "axios";
import Cookies from "js-cookie";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + "api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const { localLanguage, formLanguage } = JSON.parse(
    window.localStorage.getItem("languageContext") || "{}"
  );

  config.headers["accept-lang"] = localLanguage || formLanguage || "en";

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.code === "ECONNABORTED" ||
      error.message === "timeout of 30000ms exceeded"
    ) {
      error.message = "Request timeout. Please try again.";
    } else if (error.code === "NETWORK_ERROR" || !error.response) {
      error.message = "Network error. Please check your connection.";
    }

    if (error?.response?.status === 401) {
      Cookies.remove("uat");
      
      Cookies.remove("ue");
      Cookies.remove("account");
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const request = async ({ ...options }, router, headerOption) => {
  const onSuccess = (response) => response;
  const onError = (error) => {
    if (error?.response?.status === 401) {
      Cookies.remove("uat");
      Cookies.remove("ue");
      Cookies.remove("account");
      localStorage.removeItem("token");
      // router && router.push("/login");
    }
    return error;
  };
  try {
    if (headerOption) {
      options.headers = { ...options.headers, ...headerOption };
    }
    const response = await client(options);
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};

const api = {
  get: (url, config = {}) => {
    return client.get(url, config);
  },

  post: (url, data = {}, config = {}) => {
    return client.post(url, data, config);
  },

  put: (url, data = {}, config = {}) => {
    return client.put(url, data, config);
  },

  patch: (url, data = {}, config = {}) => {
    return client.patch(url, data, config);
  },

  delete: (url, config = {}) => {
    return client.delete(url, config);
  },

  upload: (url, formData, config = {}) => {
    return client.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  download: (url, config = {}) => {
    return client.get(url, {
      ...config,
      responseType: "blob",
    });
  },

  request: (options) => {
    return request(options);
  },
};

const tokenUtils = {
  setToken: (token) => {
    localStorage.setItem("token", token);
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  removeToken: () => {
    localStorage.removeItem("token");
  },

  hasToken: () => {
    return !!localStorage.getItem("token");
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    Cookies.remove("uat");
    Cookies.remove("ue");
    Cookies.remove("account");
  },
};

const handleError = (error) => {
  if (error?.response) {
    const { status, data } = error.response;

    let message = "Something went wrong";

    switch (status) {
      case 400:
        message = data?.message || "Bad request. Please check your input.";
        break;
      case 401:
        message = data?.message || "Unauthorized. Please login again.";
        break;
      case 403:
        message =
          data?.message || "Access forbidden. You don't have permission.";
        break;
      case 404:
        message =
          data?.message || "API endpoint not found. Please contact support.";
        break;
      case 422:
        message = data?.message || "Validation error. Please check your input.";
        break;
      case 429:
        message = data?.message || "Too many requests. Please wait a moment.";
        break;
      case 500:
        message = data?.message || "Server error. Please try again later.";
        break;
      case 502:
        message = "Bad gateway. Server is temporarily unavailable.";
        break;
      case 503:
        message = "Service unavailable. Please try again later.";
        break;
      default:
        message = data?.message || "Something went wrong";
    }

    return {
      success: false,
      status,
      message,
      data: data,
    };
  } else if (error?.request) {
    return {
      success: false,
      message:
        "Network error. Please check your internet connection and try again.",
      data: null,
    };
  } else {
    return {
      success: false,
      message: error.message || "Something went wrong",
      data: null,
    };
  }
};

const handleSuccess = (response) => {
  return {
    success: true,
    status: response.status,
    message: response.data?.message || "Success",
    data: response.data,
  };
};

export default client;
export { request, api, tokenUtils, handleError, handleSuccess, API_BASE_URL };
