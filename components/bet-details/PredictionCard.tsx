"use client";

import type React from "react";

import { useTheme } from "@/lib/contexts/ThemeContext";

// Define prediction type
type PredictionType = "WIN" | "LOSE" | "DRAW" | null;

// Define props interface
interface PredictionCardProps {
  ownerPrediction: PredictionType;
  ownerTeamName: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  ownerPrediction,
  ownerTeamName,
}) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const primaryBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  const getPredictionColor = (prediction: PredictionType): string => {
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
    <div className={`${primaryBg} rounded-xl p-4 mb-2`}>
      <p className={`${secondaryTextColor} uppercase text-xs mb-2`}>
        PREDICTION
      </p>
      <p className={`${textColor} font-medium`}>
        {ownerTeamName}{" "}
        <span
          className={`${getPredictionColor(ownerPrediction)} font-medium mb-1`}
        >
          {ownerPrediction === "LOSE" ? "WIN" : ownerPrediction}
        </span>
      </p>
    </div>
  );
};
