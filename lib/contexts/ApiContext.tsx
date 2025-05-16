"use client"

import type React from "react"
import { createContext, useContext, type ReactNode } from "react"
import { apiGet, apiPost, apiPut, apiPatch, apiDelete, type ApiResponse } from "../api/apiUtils"
import type { AxiosRequestConfig } from "axios"

interface ApiContextType {
  get: <T>(url: string, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>
  delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const apiContextValue: ApiContextType = {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    patch: apiPatch,
    delete: apiDelete,
  }

  return <ApiContext.Provider value={apiContextValue}>{children}</ApiContext.Provider>
}

export const useApi = () => {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider")
  }
  return context
}
