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
      <div className="mb-4">
        <div
          onClick={focusInput}
          className={`${bgColor} rounded-lg px-4 py-6  flex items-center justify-between cursor-text relative`}
        >
          {/* Minus button inside the input on the left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              decreaseAmount();
            }}
            className="flex items-center justify-center mr-2 xs:mr-1"
          >
            <MinusCircle
              size={24}
              className="xs:w-5 xs:h-5"
              color={isDarkMode ? "white" : "black"}
            />
          </button>

          <div className="flex items-center flex-1">
            <span
              className={`${inputTextColor} text-lg xs:text-base font-bold mr-1`}
              style={{
                fontSize: 22,
                lineHeight: "24px",
              }}
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
              className={`flex-1 bg-transparent ${inputTextColor} text-xl xs:text-lg font-bold focus:outline-none`}
              style={{
                fontSize: 20,
                lineHeight: "24px",
              }}
            />
          </div>

          <div className="flex items-center">
            <span className="text-gray-400 text-xs xs:text-[10px] mr-2 xs:mr-1">
              Min {minAmount}
            </span>
            {/* Plus button inside the input on the right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                increaseAmount(100);
              }}
              className="flex items-center justify-center"
            >
              <PlusCircle
                size={24}
                className="xs:w-5 xs:h-5"
                color={isDarkMode ? "white" : "black"}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 xs:gap-1 mb-8 xs:mb-6">
        <button
          onClick={clearAmount}
          className={`${quickButtonBg} py-3 xs:py-2 px-6 xs:px-3 rounded-lg`}
        >
          <span
            className={`${isDarkMode ? "text-white" : "text-black"} xs:text-sm`}
          >
            Clear
          </span>
        </button>
        <button
          onClick={() => increaseAmount(100)}
          className={`${quickButtonBg} py-3 xs:py-2 px-6 xs:px-3 rounded-lg`}
        >
          <span
            className={`${isDarkMode ? "text-white" : "text-black"} xs:text-sm`}
          >
            +100
          </span>
        </button>
        <button
          onClick={() => increaseAmount(500)}
          className={`${quickButtonBg} py-3 xs:py-2 px-6 xs:px-3 rounded-lg`}
        >
          <span
            className={`${isDarkMode ? "text-white" : "text-black"} xs:text-sm`}
          >
            +500
          </span>
        </button>
        <button
          onClick={() => increaseAmount(1000)}
          className={`${quickButtonBg} py-3 xs:py-2 px-6 xs:px-3 rounded-lg`}
        >
          <span
            className={`${isDarkMode ? "text-white" : "text-black"} xs:text-sm`}
          >
            +1000
          </span>
        </button>
      </div>
    </>
  );
};

export default AmountInput;
