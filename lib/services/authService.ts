import { apiGet, apiPost } from "../api/apiUtils";
import { formatApiError } from "../utils/errorUtils";
import { useAuthStore } from "../store/authStore";
import type { User } from "../types/User";
import axios from "axios";
import { API_URL } from "../api/axiosClient";

interface LoginCredentials {
  mobile: string;
  password: string;
}

interface ValidationErrors {
  phoneNumber?: string;
  password?: string;
  general?: string;
  [key: string]: string | undefined;
}

interface RegisterCredentials {
  mobile: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<void> => {
  try {
    const errors: ValidationErrors = {};
    if (!credentials.mobile) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(credentials.mobile.replace(/\D/g, ""))) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    if (!credentials.password) {
      errors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      throw {
        message: "Validation failed",
        status: 422,
        errors,
      };
    }

    useAuthStore.getState().setLoading(true);

    const res = await axios.post(`${API_URL}/auth/login`, credentials);
    console.log("Login successful:", res.data);

    const token = res.data.token;

    // First save to localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("registeredMobile", credentials.mobile);

    // Then update the store
    useAuthStore.getState().login(token);
;

    try {
      await fetchUserProfile();
    } catch (profileError) {
      console.error("Failed to fetch user profile after login:", profileError);
      // Continue with login even if profile fetch fails
      // The protected route will handle this case
    }
  } catch (error: any) {
    let errorMessage = "Login failed";
    let formattedErrors: ValidationErrors = {};
    let errorStatus = error.status || 500;

    if (
      error.status === 422 &&
      error.errors &&
      typeof error.errors === "object" &&
      !Array.isArray(error.errors)
    ) {
      errorMessage = error.message || "Validation failed";
      formattedErrors = error.errors;
    } else {
      const apiError = error.response?.data;

      if (
        apiError &&
        Array.isArray(apiError.errors) &&
        apiError.errors.length > 0
      ) {
        const err = apiError.errors[0];

        if (err.reason === "UNAUTHORIZED") {
          errorStatus = 401;
          formattedErrors = {
            general:
              err.details ||
              "Invalid credentials. Please check your phone number and password.",
          };
        } else {
          formattedErrors = {
            general: err.details || errorMessage,
          };
        }

        errorMessage = apiError.message || errorMessage;
      }
    }

    useAuthStore.getState().setError(errorMessage);

    throw {
      message: errorMessage,
      status: errorStatus,
      errors: formattedErrors,
    };
  } finally {
    useAuthStore.getState().setLoading(false);
    console.log("Login attempt completed");
  }
};

export const logout = (): void => {
  useAuthStore.getState().logout();
  localStorage.removeItem("authToken") 
};

export const fetchUserProfile = async (): Promise<User | null> => {
  try {
    useAuthStore.getState().setLoading(true);

    // Get the token from localStorage to ensure we're using the most up-to-date token
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("Fetching user profile with token:", token);

    const { data: user } = await apiGet<User>("/users/me");
    console.log("User profile fetched successfully:", user);

    useAuthStore.getState().setUser(user);
    localStorage.setItem("userData", JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    const formattedError = formatApiError(
      error,
      "Failed to fetch user profile"
    );
    useAuthStore.getState().setError(formattedError.message);
    throw formattedError;
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

export const checkAuthStatus = async (): Promise<boolean> => {
  // Get token from localStorage
  const token = localStorage.getItem("authToken");

  if (!token) {
    return false;
  }

  // Update the store with the token from localStorage
  useAuthStore.getState().login(token);

  try {
    // Fetch user profile and store in auth store
    const user = await fetchUserProfile();
    return !!user;
  } catch (error) {
    console.error("Failed to verify auth status:", error);
    useAuthStore.getState().logout();
    return false;
  }
};

export const register = async (
  credentials: RegisterCredentials
): Promise<void> => {
  try {
    // Validate credentials
    const errors: { [key: string]: string } = {};
    if (!credentials.mobile) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?\d{10,15}$/.test(credentials.mobile)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }
    if (!credentials.password) {
      errors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (Object.keys(errors).length > 0) {
      throw { message: "Validation failed", status: 422, errors };
    }

    useAuthStore.getState().setLoading(true);

    const response = await apiPost("/auth/register", credentials);
    interface RegisterData {
      token: string;
      mobile: string;
    }
    if (response.data) {
      const { token, mobile }: RegisterData | any = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", token);
        localStorage.setItem("registeredMobile", mobile);
      }

      // Update the auth store with the token
      useAuthStore.getState().login(token);
    }
  } catch (error: any) {
    let extractedErrors;

    // Check for API response errors (from apiPost)
    if (error?.response?.data?.errors) {
      extractedErrors = error.response.data.errors;
    } else if (error.errors) {
      extractedErrors = error.errors;
    }

    const errorMessage = "Registration failed";
    useAuthStore.getState().setError(errorMessage);

    throw {
      message: errorMessage,
      status: error?.response?.status || error.status || 500,
      errors: extractedErrors,
    };
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

export const verifyOtp = async (
  otpCode: string,
  credentials?: { mobile: string; password: string }
): Promise<any> => {
  try {
    useAuthStore.getState().setLoading(true);

    // Validate OTP
    const errors: { [key: string]: string } = {};
    if (!otpCode) {
      errors.otp = "OTP is required";
    } else if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      errors.otp = "OTP must be 6 digits";
    }
    if (Object.keys(errors).length > 0) {
      throw { message: "Validation failed", status: 422, errors };
    }

    const tempToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!tempToken) {
      throw {
        message: "Session expired",
        status: 401,
        errors: { general: "Please restart the signup process." },
      };
    }

    const response = await apiPost(`/auth/${tempToken}/user-confirm`, {
      otp: otpCode,
    });

    const newToken = response.data.token ;

    if (credentials && credentials.mobile && credentials.password) {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);

        const newToken = response.data.token;

        // Update the auth store with the token
        useAuthStore.getState().login(newToken);

        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", newToken);
        }

        // Make sure to fetch and set the user profile
        await fetchUserProfile();
      } catch (loginError) {
        console.error(
          "Failed to auto-login after OTP verification:",
          loginError
        );
      }
    } else {
      useAuthStore.getState().login(newToken);

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", newToken);
      }

      // Make sure to fetch and set the user profile
      await fetchUserProfile();
    }

    return response.data;
  } catch (error: any) {
    // Error handling remains the same
    let errorMessage = "OTP verification failed";
    let formattedErrors: { [key: string]: string } = {};
    if (
      error.status === 422 &&
      error.errors &&
      typeof error.errors === "object"
    ) {
      errorMessage = error.message || "Validation failed";
      formattedErrors = error.errors;
    } else {
      const formattedError = formatApiError(error, "OTP verification failed");
      errorMessage = formattedError.message;
      formattedErrors = { general: errorMessage };
    }
    useAuthStore.getState().setError(errorMessage);
    throw {
      message: errorMessage,
      status: error.status || 500,
      errors: formattedErrors,
    };
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

export const resendOtp = async (): Promise<any> => {
  try {
    useAuthStore.getState().setLoading(true);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      throw {
        message: "Authentication token not found",
        status: 401,
        errors: {
          general: "No authentication token found. Please sign in again.",
        },
      };
    }

    const response = await apiPost(`/auth/${token}/resend-otp`, {
      otpType: "VERIFICATION",
    });
    return response.data;
  } catch (error: any) {
    const formattedError = formatApiError(error, "Failed to resend OTP");
    const errorMessage = formattedError.message;
    useAuthStore.getState().setError(errorMessage);
    throw {
      message: errorMessage,
      status: error.status || 500,
      errors: { general: errorMessage },
    };
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

export const requestPasswordReset = async (mobile: string): Promise<string> => {
  try {
    useAuthStore.getState().setLoading(true);

    if (!mobile || !/^\+?\d{10,15}$/.test(mobile)) {
      throw {
        message: "Validation failed",
        status: 422,
        errors: {
          phoneNumber: "Please enter a valid phone number",
        },
      };
    }

    const response = await apiPost("/auth/password-reset", {
      mobile,
    });

    const data= response.data as any;

    if (typeof window !== "undefined") {
      localStorage.setItem("passwordResetToken", data.token);
      localStorage.setItem("registeredMobile", mobile);
    }

    return data.token;
  } catch (error: any) {
    const formattedError = formatApiError(
      error,
      "Password reset request failed"
    );
    useAuthStore.getState().setError(formattedError.message);

    throw {
      message: formattedError.message,
      status: error.status || 500,
      errors: formattedError.errors || { general: formattedError.message },
    };
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

export const passwordverifyOtp = async (
  otp: string,
  newPassword: string
): Promise<any> => {
  try {
    useAuthStore.getState().setLoading(true);

    const errors: { [key: string]: string } = {};
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      errors.otp = "OTP must be a 6-digit number";
    }
    if (!newPassword || newPassword.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      throw { message: "Validation failed", status: 422, errors };
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("passwordResetToken")
        : null;

    if (!token) {
      throw {
        message: "Reset token not found",
        status: 401,
        errors: {
          general:
            "No reset token found. Please start the reset process again.",
        },
      };
    }

    const response = await apiPost(`/auth/${token}/password-reset-confirm`, {
      otp,
      password: newPassword,
    });

    return response.data;
  } catch (error: any) {
    const formattedError = formatApiError(error, "OTP verification failed");
    useAuthStore.getState().setError(formattedError.message);

    throw {
      message: formattedError.message,
      status: error.status || 500,
      errors: formattedError.errors || { general: formattedError.message },
    };
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};
