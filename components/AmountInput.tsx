"use client";

import type React from "react";
import { useRef } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { MinusCircle, PlusCircle } from "lucide-react";

interface AmountInputProps {
  amount: string;
  setAmount: (val: string) => void;
  minAmount?: number;
}

const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  setAmount,
  minAmount = 100,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode ? "bg-primary-1400" : "bg-primary-1200";
  const quickButtonBg = isDarkMode ? "bg-primary-100" : "bg-[#E8E8FF]";
  const inputTextColor = isDarkMode ? "text-white" : "text-black";

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const numValue =
      numericValue === "" ? 0 : Number.parseInt(numericValue, 10);
    if (numValue === 0) {
      return "";
    }
    return numValue.toLocaleString();
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatAmount(e.target.value));
  };

  const increaseAmount = (value: number) => {
    const currentAmount = Number.parseInt(amount.replace(/,/g, "") || "0", 10);
    const newAmount = currentAmount + value;
    setAmount(newAmount.toLocaleString());
  };

  const decreaseAmount = () => {
    const currentAmount = Number.parseInt(amount.replace(/,/g, "") || "0", 10);
    const newAmount = Math.max(minAmount, currentAmount - 100);
    setAmount(newAmount.toLocaleString());
  };

  const clearAmount = () => {
    setAmount("");
    inputRef.current?.focus();
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="mb-4 w-full">
        <div
          onClick={focusInput}
          className={`${bgColor} rounded-lg px-3 py-4 sm:px-4 sm:py-6 flex items-center justify-between cursor-text relative w-full`}
        >
          {/* Minus button inside the input on the left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              decreaseAmount();
            }}
            className="flex items-center justify-center mr-1 sm:mr-2"
            aria-label="Decrease amount"
            type="button"
          >
            <MinusCircle
              size={20}
              className="w-5 h-5 sm:w-6 sm:h-6"
              color={isDarkMode ? "white" : "black"}
            />
          </button>

          <div className="flex items-center flex-1 overflow-hidden">
            <span
              className={`${inputTextColor} text-base sm:text-lg font-bold mr-1 flex-shrink-0`}
            >
              ₦
            </span>
            <input
              ref={inputRef}
              value={amount}
              onChange={handleChangeAmount}
              type="text"
              inputMode="numeric"
              placeholder="0"
              className={`w-full bg-transparent ${inputTextColor} text-lg sm:text-xl font-bold focus:outline-none truncate`}
              style={{
                fontSize: "16px",
              }}
            />
          </div>

          <div className="flex items-center">
            <span className="text-gray-400 text-[10px] sm:text-xs mr-1 sm:mr-2 whitespace-nowrap">
              Min {minAmount}
            </span>
            {/* Plus button inside the input on the right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                increaseAmount(100);
              }}
              className="flex items-center justify-center "
              aria-label="Increase amount"
              type="button"
            >
              <PlusCircle
                size={20}
                className="w-5 h-5 sm:w-6 sm:h-6"
                color={isDarkMode ? "white" : "black"}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-6 sm:mb-8 w-full">
        <button
          onClick={clearAmount}
          className={`${quickButtonBg} py-2 px-2 sm:py-3 sm:px-6 rounded-lg`}
          type="button"
        >
          <span
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-xs sm:text-sm`}
          >
            Clear
          </span>
        </button>
        <button
          onClick={() => increaseAmount(100)}
          className={`${quickButtonBg} py-2 px-2 sm:py-3 sm:px-6 rounded-lg`}
          type="button"
        >
          <span
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-xs sm:text-sm`}
          >
            +100
          </span>
        </button>
        <button
          onClick={() => increaseAmount(500)}
          className={`${quickButtonBg} py-2 px-2 sm:py-3 sm:px-6 rounded-lg`}
          type="button"
        >
          <span
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-xs sm:text-sm`}
          >
            +500
          </span>
        </button>
        <button
          onClick={() => increaseAmount(1000)}
          className={`${quickButtonBg} py-2 px-2 sm:py-3 sm:px-6 rounded-lg`}
          type="button"
        >
          <span
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-xs sm:text-sm`}
          >
            +1000
          </span>
        </button>
      </div>
    </>
  );
};

export default AmountInput;
