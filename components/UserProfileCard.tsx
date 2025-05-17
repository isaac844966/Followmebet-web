"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { Pencil, Loader2 } from "lucide-react";

interface UserProfileCardProps {
  name: string;
  status: string;
  avatarUrl?: string;
  onEditPress?: () => void;
  showEditButton?: boolean;
  showWelcomeText?: boolean;
  bgColor?: string;
  containerStyle?: React.CSSProperties;
  loading?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  status,
  avatarUrl,
  onEditPress,
  showEditButton = true,
  showWelcomeText = true,
  bgColor,
  containerStyle,
  loading = false,
}) => {
  const { isDarkMode } = useTheme();
  const defaultBgColor =
    bgColor || (isDarkMode ? "bg-primary-100" : "bg-gray-100");
  const defaultAvatarUrl = "https://avatar.iran.liara.run/public/41";
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`${defaultBgColor} rounded-lg p-6 mb-2 flex items-center`}
      style={containerStyle}
    >
      {loading ? (
        <Loader2
          className={`animate-spin ${
            isDarkMode ? "text-white" : "text-[#1E1F68]"
          }`}
          size={24}
        />
      ) : (
        <>
          <div
            className={`w-12 h-12 rounded-full mr-4 border-primary-400 border-2 relative overflow-hidden ${
              isDarkMode ? "bg-primary-400" : "bg-primary-1900"
            }`}
          >
            <Image
              src={
                avatarUrl && avatarUrl.trim() !== "" && !imgError
                  ? avatarUrl
                  : defaultAvatarUrl
              }
              alt={name || "User"}
              fill
              sizes="48px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          </div>

          <div className="flex-1">
            {showWelcomeText && (
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-primary-600"
                } text-xs mb-1`}
              >
                Welcome Back
              </p>
            )}
            <p className="text-white text-lg font-bold">{name || ""}</p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 rounded-full bg-primary-400 mr-2"></div>
              <p className="text-white text-xs uppercase">{status}</p>
            </div>
          </div>
          {showEditButton && onEditPress && (
            <button onClick={onEditPress} className="p-2">
              <Pencil size={16} className="text-white" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfileCard;
