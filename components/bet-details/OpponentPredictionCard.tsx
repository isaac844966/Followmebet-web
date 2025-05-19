"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";

// Interface for the props
interface OpponentPredictionCardProps {
  challengerPrediction: "WIN" | "LOSE" | "DRAW" | null;
  challengerTeamName: string;
}

export const OpponentPredictionCard: React.FC<OpponentPredictionCardProps> = ({
  challengerPrediction,
  challengerTeamName,
}) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const primaryBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  const getPredictionColor = (prediction: string | null): string => {
    if (!prediction) return "";

    switch (prediction) {
      case "WIN":
        return "text-green-500";
      case "LOSE":
        return "text-green-500";
      case "DRAW":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <div className={`${primaryBg} rounded-xl p-4 xs:p-3 mb-2`}>
      <p
        className={`${secondaryTextColor} uppercase text-xs xs:text-[10px] mb-2 xs:mb-1`}
      >
        OPPONENT PREDICTION
      </p>
      <p className={`${textColor} font-medium xs:text-sm`}>
        {challengerTeamName}{" "}
        <span
          className={`${getPredictionColor(
            challengerPrediction === "LOSE" ? "WIN" : challengerPrediction
          )} font-medium`}
        >
          {challengerPrediction === "LOSE" ? "WIN" : challengerPrediction}
        </span>
      </p>
    </div>
  );
};
