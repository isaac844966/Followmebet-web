import { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosClient from "./axiosClient";

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Error response structure from API
export interface ApiErrorDetail {
  source: string;
  reason: string;
  description: string;
  recoverable: boolean;
  details: string;
}

// Error response type
export interface ApiError {
  uniqueId?: string;
  message: string;
  status: number;
  errors?: ApiErrorDetail[] | Record<string, string>; // Allow both array and object format
}

// Generic API request function
const apiRequest = async <T>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    let response: AxiosResponse;

    switch (method.toLowerCase()) {
      case "get":
        response = await axiosClient.get(url, config);
        break;
      case "post":
        response = await axiosClient.post(url, data, config);
        break;
      case "put":
        response = await axiosClient.put(url, data, config);
        break;
      case "patch":
        response = await axiosClient.patch(url, data, config);
        break;
      case "delete":
        response = await axiosClient.delete(url, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return {
      data: response.data,
      status: response.status,
      message: response.data.message,
    };
  } catch (error: any) {
    const apiErrorResponse = error.response?.data;

    // Format error response
    const errorResponse: ApiError = {
      uniqueId: apiErrorResponse?.uniqueId,
      message:
        apiErrorResponse?.errors?.[0]?.details ||
        apiErrorResponse?.errors?.[0]?.description ||
        "Something went wrong",
      status: error.response?.status || 500,
      errors: apiErrorResponse?.errors || [],
    };

    throw errorResponse;
  }
};

// Convenience methods
export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  apiRequest<T>("get", url, undefined, config);

export const apiPost = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => apiRequest<T>("post", url, data, config);

export const apiPut = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => apiRequest<T>("put", url, data, config);

export const apiPatch = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => apiRequest<T>("patch", url, data, config);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  apiRequest<T>("delete", url, undefined, config);
