"use client"

import type React from "react"
import type { ReactNode } from "react"
import { useTheme } from "@/lib/contexts/ThemeContext"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import SuccessIcon from "./SuccessIcon"

type StatusType = "success" | "error" | "warning" | "info"

interface StatusModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  message: string
  buttonText?: string
  type?: StatusType
  customIcon?: ReactNode
  hideCloseOnOverlayPress?: boolean
  onButtonPress?: () => void
  icon?: ReactNode
}

const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  onClose,
  title,
  message,
  buttonText = "OK",
  type = "success",
  customIcon,
  hideCloseOnOverlayPress = false,
  onButtonPress,
  icon,
}) => {
  const { isDarkMode } = useTheme()

  if (!visible) return null

  const getTypeColors = () => {
    switch (type) {
      case "success":
        return {
          primary: "#FBB03B",
          light: "#E8F5E9",
          dark: "#FBB03B",
        }
      case "error":
        return {
          primary: "#FC0900",
          light: "#FFEBEE",
          dark: "#FC0900",
        }
      case "warning":
        return {
          primary: "#FFC107",
          light: "#FFF8E1",
          dark: "#F57F17",
        }
      case "info":
        return {
          primary: "rgb(255,167,38)",
          light: "#E3F2FD",
          dark: "rgb(255,167,38)",
        }
      default:
        return {
          primary: "#4CAF50",
          light: "#E8F5E9",
          dark: "#2E7D32",
        }
    }
  }

  const colors = getTypeColors()
  const buttonColor = colors.primary
  const buttonTextColor = "#FFFFFF"

  const handleOverlayPress = () => {
    if (!hideCloseOnOverlayPress) {
      onClose()
    }
  }

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress()
    } else {
      onClose()
    }
  }

  const renderIcon = () => {
    if (icon) return icon
    if (customIcon) return customIcon

    switch (type) {
      case "success":
        return (
          <div className="w-20 h-20 rounded-full border-8 border-primary-400 flex items-center justify-center">
            <SuccessIcon/>
          </div>
        )
      case "error":
        return (
          <div className="w-20 h-20 rounded-full border-8 border-red-500 flex items-center justify-center">
            <X size={48} color="#FC0900" />
          </div>
        )
      case "warning":
        return (
          <div className="w-20 h-20 rounded-full border-8 border-yellow-500 flex items-center justify-center">
            <AlertCircle size={48} color={colors.primary} />
          </div>
        )
      case "info":
        return (
          <div className="w-20 h-20 rounded-full border-8 border-blue-500 flex items-center justify-center">
            <Info size={48} color={colors.primary} />
          </div>
        )
      default:
        return (
          <div className="w-20 h-20 rounded-full border-8 border-primary-400 flex items-center justify-center">
            <CheckCircle size={48} color={colors.primary} />
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <div
          className={`${
            isDarkMode ? "bg-primary-500" : "bg-white"
          } rounded-xl p-6 items-center flex flex-col max-w-md w-[85vw] shadow-lg`}
        >
          <div className="mb-6 mt-2">{renderIcon()}</div>

          {title && (
            <h3 className={`${isDarkMode ? "text-white" : "text-black"} text-xl font-bold mb-3 text-center`}>
              {title}
            </h3>
          )}

          <p
            className={`${
              isDarkMode ? "text-primary-800" : "text-primary-700"
            } text-base mb-16 text-center font-medium leading-6`}
          >
            {message}
          </p>

          <button
            className="w-full rounded-lg py-4 items-center justify-center flex"
            style={{ backgroundColor: buttonColor }}
            onClick={handleButtonPress}
          >
            <span className="text-base font-medium" style={{ color: buttonTextColor }}>
              {buttonText}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatusModal
