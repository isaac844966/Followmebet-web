"use client";

import type React from "react";

type BetType = "random" | "challenge";

type BetTypeSelectorProps = {
  selectedBetType: BetType;
  onSelectBetType: (type: BetType) => void;
  isDarkMode: boolean;
};

const BetTypeSelector: React.FC<BetTypeSelectorProps> = ({
  selectedBetType,
  onSelectBetType,
  isDarkMode,
}) => {
  const textColor = isDarkMode ? "text-white" : "text-black";
  const cardBackground = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";
  const activeButtonBg = isDarkMode ? "bg-[#2E3192]" : "bg-[#2E3192]";
  const inactiveButtonBg = isDarkMode ? "bg-[#27274d]" : "bg-[#E8E8FF]";
  const activeButtonText = "text-white";
  const inactiveButtonText = isDarkMode ? "text-white" : "text-black";

  return (
    <div className="mb-4">
      <p className={`${textColor} text-base xs:text-sm font-medium mb-2`}>
        Bet Type
      </p>

      <div
        className={`flex justify-between ${cardBackground} rounded-lg py-3 xs:py-2 px-2 xs:px-1 `}
      >
        {(["random", "challenge"] as BetType[]).map((type) => (
          <button
            key={type}
            className={`${
              selectedBetType === type ? activeButtonBg : inactiveButtonBg
            } py-3 xs:py-2 px-2 xs:px-1 rounded-md flex-1 ${
              type === "random" ? "mr-2 xs:mr-1" : "ml-2 xs:ml-1"
            } flex items-center justify-center ${
              selectedBetType === type ? "border-[0.2px] border-gray-600" : ""
            }`}
            onClick={() => onSelectBetType(type)}
          >
            <span
              className={`${
                selectedBetType === type ? activeButtonText : inactiveButtonText
              } text-center ml-2 xs:ml-1 text-sm xs:text-xs font-medium`}
            >
              {type === "random" ? "Open Challenge" : "Challenge a Friend"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BetTypeSelector;
