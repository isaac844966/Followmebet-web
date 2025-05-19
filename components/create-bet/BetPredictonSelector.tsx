"use client";

import type React from "react";

type Team = {
  name?: string;
};

type Fixture = {
  item1?: Team;
  item2?: Team;
};

type PredictionType = "WIN" | "DRAW" | "LOSE";

type BetPredictionSelectorProps = {
  fixture: Fixture;
  selectedPrediction: PredictionType;
  onSelectPrediction: (prediction: PredictionType) => void;
  isDarkMode: boolean;
};

const BetPredictionSelector: React.FC<BetPredictionSelectorProps> = ({
  fixture,
  selectedPrediction,
  onSelectPrediction,
  isDarkMode,
}) => {
  const textColor = isDarkMode ? "text-white" : "text-black";
  const cardBackground = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";
  const activeButtonBg = "bg-[#2E3192]";
  const inactiveButtonBg = isDarkMode ? "bg-[#27274d]" : "bg-[#E8E8FF]";
  const activeButtonText = "text-white";
  const inactiveButtonText = isDarkMode ? "text-white" : "text-black";

  return (
    <div className="mb-4 mt-4 xs:mt-2">
      <p className={`${textColor} text-base xs:text-sm font-medium mb-2`}>
        Select your Prediction
      </p>

      <div
        className={`flex justify-between px-2 xs:px-1 py-3 xs:py-2 rounded-lg ${cardBackground} border-[0.3px] border-gray-600`}
      >
        {/* WIN */}
        <button
          className={`${
            selectedPrediction === "WIN" ? activeButtonBg : inactiveButtonBg
          } p-1 rounded-md flex-1 flex flex-col justify-center items-center ${
            selectedPrediction === "WIN" ? `border-[0.2px] border-gray-600` : ""
          }`}
          onClick={() => onSelectPrediction("WIN")}
        >
          <span
            className={`${
              selectedPrediction === "WIN"
                ? activeButtonText
                : inactiveButtonText
            } text-center font-medium text-sm xs:text-xs`}
          >
            {fixture.item1?.name?.split(" ")[0] || "Team 1"}
          </span>
          <span
            className={`${
              selectedPrediction === "WIN"
                ? activeButtonText
                : inactiveButtonText
            } text-center font-medium text-sm xs:text-xs`}
          >
            Win
          </span>
        </button>

        {/* DRAW */}
        <button
          className={`${
            selectedPrediction === "DRAW" ? activeButtonBg : inactiveButtonBg
          } p-1 rounded-md flex-1 mx-1 flex flex-col justify-center items-center ${
            selectedPrediction === "DRAW"
              ? `border-[0.2px] border-gray-600`
              : ""
          }`}
          onClick={() => onSelectPrediction("DRAW")}
        >
          <span
            className={`${
              selectedPrediction === "DRAW"
                ? activeButtonText
                : inactiveButtonText
            } text-center font-medium text-sm xs:text-xs`}
          >
            Draw
          </span>
        </button>

        {/* LOSE */}
        <button
          className={`${
            selectedPrediction === "LOSE" ? activeButtonBg : inactiveButtonBg
          } p-1 rounded-md flex-1 flex flex-col justify-center items-center ${
            selectedPrediction === "LOSE"
              ? `border-[0.2px] border-gray-600`
              : ""
          }`}
          onClick={() => onSelectPrediction("LOSE")}
        >
          <span
            className={`${
              selectedPrediction === "LOSE"
                ? activeButtonText
                : inactiveButtonText
            } text-center text-sm xs:text-xs font-medium`}
          >
            {fixture.item2?.name?.split(" ")[0] || "Team 2"}
          </span>
          <span
            className={`${
              selectedPrediction === "LOSE"
                ? activeButtonText
                : inactiveButtonText
            } text-center font-medium text-sm xs:text-xs`}
          >
            Win
          </span>
        </button>
      </div>
    </div>
  );
};

export default BetPredictionSelector;
