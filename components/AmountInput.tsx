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
      <div className="flex mb-4">
        <button
          onClick={decreaseAmount}
          className={`${bgColor} w-20 h-20 rounded-lg flex items-center justify-center`}
        >
          <MinusCircle size={24} color={isDarkMode ? "white" : "black"} />
        </button>

        <div
          onClick={focusInput}
          className={`${bgColor} flex-1 mx-2 rounded-lg px-4 py-4 flex items-center justify-between cursor-text`}
        >
          <div className="flex items-center flex-1">
            <span
              className={`${inputTextColor} text-lg font-bold mr-1`}
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
              className={`flex-1 bg-transparent ${inputTextColor} text-xl font-bold focus:outline-none`}
              style={{
                fontSize: 20,
                lineHeight: "24px",
              }}
            />
          </div>
          <span className="text-gray-400 text-xs ml-2">Min {minAmount}</span>
        </div>

        <button
          onClick={() => increaseAmount(100)}
          className={`${bgColor} w-20 h-20 rounded-lg flex items-center justify-center`}
        >
          <PlusCircle size={24} color={isDarkMode ? "white" : "black"} />
        </button>
      </div>

      <div className="flex justify-between mb-8">
        <button
          onClick={clearAmount}
          className={`${quickButtonBg} py-3 px-6 rounded-lg`}
        >
          <span className={isDarkMode ? "text-white" : "text-black"}>
            Clear
          </span>
        </button>
        <button
          onClick={() => increaseAmount(100)}
          className={`${quickButtonBg} py-3 px-6 rounded-lg`}
        >
          <span className={isDarkMode ? "text-white" : "text-black"}>+100</span>
        </button>
        <button
          onClick={() => increaseAmount(500)}
          className={`${quickButtonBg} py-3 px-6 rounded-lg`}
        >
          <span className={isDarkMode ? "text-white" : "text-black"}>+500</span>
        </button>
        <button
          onClick={() => increaseAmount(1000)}
          className={`${quickButtonBg} py-3 px-6 rounded-lg`}
        >
          <span className={isDarkMode ? "text-white" : "text-black"}>
            +1000
          </span>
        </button>
      </div>
    </>
  );
};

export default AmountInput;
