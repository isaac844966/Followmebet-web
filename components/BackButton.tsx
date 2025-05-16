"use client"

import type React from "react"
import { useTheme } from "@/lib/contexts/ThemeContext"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  title?: string
  onPress?: () => void
  navigateTo?: string
  showTitle?: boolean
  containerStyle?: React.CSSProperties
  titleStyle?: React.CSSProperties
  iconSize?: number
  iconColor?: string
  rightIcon?: React.ReactNode
}

const BackButton: React.FC<BackButtonProps> = ({
  title = "Back",
  onPress,
  navigateTo,
  showTitle = true,
  containerStyle,
  titleStyle,
  iconSize = 24,
  iconColor,
  rightIcon,
}) => {
  const { isDarkMode } = useTheme()
  const router = useRouter()

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else if (navigateTo) {
      router.push(navigateTo)
    } else {
      router.back()
    }
  }

  const defaultIconColor = iconColor || (isDarkMode ? "#FFFFFF" : "#000")

  return (
    <div className="flex items-center  mb-4 px-2">
      <button onClick={handlePress} style={containerStyle} className="flex items-center  active:opacity-70">
        <ChevronLeft size={iconSize} color={defaultIconColor} />
        {showTitle && (
          <span
            className={`${isDarkMode ? "text-white" : "text-black"} text-lg font-semibold ml-4 truncate`}
            style={titleStyle}
          >
            {title}
          </span>
        )}
      </button>
      {rightIcon && <div className="mr-4">{rightIcon}</div>}
    </div>
  )
}

export default BackButton
