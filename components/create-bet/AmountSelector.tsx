"use client";

import type React from "react";

type AmountSelectorProps = {
  selectedAmount: number;
  onSelectAmount: (amount: number) => void;
  isDarkMode: boolean;
};

const AmountSelector: React.FC<AmountSelectorProps> = ({
  selectedAmount,
  onSelectAmount,
  isDarkMode,
}) => {
  const textColor = isDarkMode ? "text-white" : "text-black";
  const cardBackground = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";
  const activeButtonBg = isDarkMode ? "bg-[#2E3192]" : "bg-[#2E3192]";
  const inactiveButtonBg = isDarkMode ? "bg-[#27274d]" : "bg-[#E8E8FF]";
  const activeButtonText = "text-white";
  const inactiveButtonText = isDarkMode ? "text-white" : "text-black";

  const amountOptions: number[] = [1000, 5000, 10000, 50000];

  return (
    <div className="mb-10 xs:mb-6">
      <p className={`${textColor} text-base xs:text-sm font-medium mb-2`}>
        Select Amount
      </p>

      <div
        className={`grid grid-cols-4 gap-1 px-2 xs:px-1 py-3 xs:py-2 rounded-lg ${cardBackground}`}
      >
        {amountOptions.map((amount) => (
          <button
            key={amount}
            className={`py-3 xs:py-2 rounded-md ${
              selectedAmount === amount
                ? `${activeButtonBg} border-[0.3px] border-gray-600`
                : inactiveButtonBg
            }`}
            onClick={() => onSelectAmount(amount)}
          >
            <span
              className={`${
                selectedAmount === amount
                  ? activeButtonText
                  : inactiveButtonText
              } text-center text-sm xs:text-xs font-medium`}
            >
              ₦{amount.toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AmountSelector;
