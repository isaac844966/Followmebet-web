"use client"

import type React from "react"
import { useState } from "react"
import { useTheme } from "@/lib/contexts/ThemeContext"
import { Eye, EyeOff } from "lucide-react"

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  leftComponent?: React.ReactNode
  isPassword?: boolean
  error?: string
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  leftComponent,
  isPassword = false,
  error,
  className,
  ...props
}) => {
  const { isDarkMode } = useTheme()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mb-3">
      {label && <label className={`${isDarkMode ? "text-white" : "text-black"} mb-3 font-bold block`}>{label}</label>}
      <div className="flex">
        {leftComponent && (
          <div
            className={`${
              isDarkMode ? "bg-primary-1400" : "bg-primary-1200"
            } rounded-l-lg justify-center items-center flex border-r-[0.2px] ${
              isDarkMode ? "bg-primary-1400" : "border-primary-800"
            }`}
            style={{ width: leftComponent ? 80 : 0 }}
          >
            {leftComponent}
          </div>
        )}
        <div className="relative flex-1">
          <input
            className={`${
              isDarkMode ? "bg-primary-1400 text-white" : "bg-primary-1200 text-black"
            } ${leftComponent ? "rounded-r-lg" : "rounded-lg"} h-20 px-4 ${
              isPassword ? "pr-12" : ""
            } font-bold w-full ${className || ""}`}
            placeholder={props.placeholder || ""}
            type={isPassword && !showPassword ? "password" : "text"}
            autoComplete={isPassword ? "off" : props.autoComplete}
            {...props}
          />
          {isPassword && (
            <button type="button" className="absolute right-4 top-6" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff className="w-6 h-6" color={isDarkMode ? "#6b6b9b" : "#A0A3AC"} />
              ) : (
                <Eye className="w-6 h-6" color={isDarkMode ? "#6b6b9b" : "#A0A3AC"} />
              )}
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 mt-1 text-xs">{error}</p>}
    </div>
  )
}

export default CustomInput
