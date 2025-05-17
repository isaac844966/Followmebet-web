"use client";

import type React from "react";

import { useTheme } from "@/lib/contexts/ThemeContext";

// Interface for the props
interface PredictionSelectionCardProps {
  team1Name: string;
  team2Name: string;
  ownerPrediction: "WIN" | "LOSE" | "DRAW" | null;
  selectedApiPrediction: "WIN" | "LOSE" | "DRAW" | null;
  handleSelect: (prediction: string, apiValue: "WIN" | "LOSE" | "DRAW") => void;
}

export const PredictionSelectionCard: React.FC<
  PredictionSelectionCardProps
> = ({
  team1Name,
  team2Name,
  ownerPrediction,
  selectedApiPrediction,
  handleSelect,
}) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const primaryBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  return (
    <div className={`${primaryBg} rounded-xl p-4 mb-2`}>
      <p className={`${secondaryTextColor} mb-4`}>Select your prediction</p>
      <div className="flex space-x-2 gap-2">
        {/* Only show Team1 WIN button if owner didn't predict Team1 WIN */}
        {ownerPrediction !== "WIN" && (
          <button
            className={`flex-1 py-4 rounded-lg items-center px-4 ${
              selectedApiPrediction === "WIN"
                ? "bg-[#2E3192]"
                : "border border-gray-500"
            }`}
            onClick={() => handleSelect(`${team1Name} Win`, "WIN")}
          >
            <div>
              <p
                className={`font-medium text-md text-center ${
                  selectedApiPrediction === "WIN" ? "text-white" : textColor
                }`}
                style={{ wordBreak: "break-word" }}
              >
                {team1Name}
              </p>
              <p
                className={`font-medium text-md text-center ${
                  selectedApiPrediction === "WIN" ? "text-white" : textColor
                }`}
              >
                Win
              </p>
            </div>
          </button>
        )}

        {/* Only show DRAW button if owner didn't predict DRAW */}
        {ownerPrediction !== "DRAW" && (
          <button
            className={`flex-1 py-4 rounded-lg items-center px-4 ${
              selectedApiPrediction === "DRAW"
                ? "bg-[#2E3192]"
                : "border border-gray-500"
            }`}
            onClick={() => handleSelect("DRAW", "DRAW")}
          >
            <p
              className={`font-medium text-center my-auto ${
                selectedApiPrediction === "DRAW" ? "text-white" : textColor
              }`}
            >
              DRAW
            </p>
          </button>
        )}

        {/* Only show Team2 WIN button if owner didn't predict Team2 WIN (LOSE) */}
        {ownerPrediction !== "LOSE" && (
          <button
            className={`flex-1 py-4 rounded-lg items-center px-4 ${
              selectedApiPrediction === "LOSE"
                ? "bg-[#2E3192]"
                : "border border-gray-500"
            }`}
            onClick={() => handleSelect(`${team2Name} Win`, "LOSE")}
          >
            <div>
              <p
                className={`font-medium text-md text-center ${
                  selectedApiPrediction === "LOSE" ? "text-white" : textColor
                }`}
                style={{ wordBreak: "break-word" }}
              >
                {team2Name}
              </p>
              <p
                className={`font-medium text-md text-center ${
                  selectedApiPrediction === "LOSE" ? "text-white" : textColor
                }`}
              >
                Win
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
