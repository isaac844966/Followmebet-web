"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  title?: string;
  onPress?: () => void;
  navigateTo?: string;
  showTitle?: boolean;
  containerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  iconSize?: number;
  iconColor?: string;
  rightIcon?: React.ReactNode;
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
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  // Check if we can go back in browser history
  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  const handlePress = () => {
    if (onPress) {
      // Custom handler takes precedence
      onPress();
    } else if (navigateTo) {
      // Navigate to specific route if provided
      router.push(navigateTo);
    } else if (canGoBack) {
      // Use browser history if available
      window.history.back();
    } else {
      // Fallback to a default route or homepage if unable to go back
      router.push("/");
    }
  };

  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const defaultIconColor = iconColor || (isDarkMode ? "#FFFFFF" : "#000");

  return (
    <div
      className={`flex items-center justify-between pb-8 ${backgroundColor} pt-4 w-full`}
    >
      <button
        onClick={handlePress}
        style={containerStyle}
        className="flex items-center active:opacity-70"
        aria-label="Go back"
      >
        {showTitle && (
          <span
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-lg font-semibold ml-4 truncate`}
            style={titleStyle}
          >
            {title}
          </span>
        )}
      </button>
      {rightIcon && <div>{rightIcon}</div>}
    </div>
  );
};

export default BackButton;
