"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";

// Interface for the props with expanded types
interface BetSummaryCardProps {
  bet: {
    totalAmount: number;
    fee: number;
    fixture: {
      htResult?: string;
      ftResult?: string;
    };
    result?: "WIN" | "LOSE" | "DRAW" | null;
    status: string;
  };
  isCompleted: boolean;
  showAcceptButton: boolean;
  commissionFee: number;
  potentialWinnings: string;
  isFromSettledBet?: boolean;
  isFromPrivateBet?: boolean;
  isFromPrivateBetDelete?: boolean;
  isFromAllBet?: boolean;
  isFromPublicBet?: boolean;
}

export const BetSummaryCard: React.FC<BetSummaryCardProps> = ({
  bet,
  isCompleted,
  showAcceptButton,
  commissionFee,
  potentialWinnings,
  isFromSettledBet = false,
  isFromPrivateBet = false,
  isFromPrivateBetDelete = false,
  isFromAllBet = false,
  isFromPublicBet = false,
}) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const primaryBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  const getAmountLabel = () => {
    const hasValidResult =
      bet.fixture.htResult &&
      bet.fixture.htResult !== "?-?" &&
      bet.fixture.htResult !== null &&
      bet.result;

    if (hasValidResult) {
      if (
        bet.result === "LOSE" ||
        bet.result === "WIN" ||
        bet.result === "DRAW"
      ) {
        return "Winnings";
      }
    }

    if (isFromSettledBet) {
      return "Winnings";
    } else if (isFromPrivateBetDelete || isFromPublicBet) {
      return "Total Refund";
    } else if (isFromAllBet || showAcceptButton || isCompleted) {
      return "Potential Winnings";
    }

    return "Potential Winnings";
  };

  const getAmountValueClass = () => {
    const hasValidResult =
      bet.fixture.htResult &&
      bet.fixture.htResult !== "?-?" &&
      bet.fixture.htResult !== null &&
      bet.result;

    // Only apply result-based styling if there's a valid result
    if (hasValidResult) {
      if (bet.result === "LOSE") {
        return "text-red-500 font-medium";
      } else if (bet.result === "WIN") {
        return "text-green-500 font-medium";
      } else if (bet.result === "DRAW") {
        return "text-yellow-500 font-medium";
      }
    }

    return `${textColor} font-medium`;
  };

  return (
    <div className={`${primaryBg} rounded-xl p-4 xs:p-3 mb-4`}>
      <div className="flex justify-between mb-2">
        <p className={`${secondaryTextColor} xs:text-sm`}>
          {isCompleted ? "Total Stake" : "Stake"}
        </p>
        <p className={`${textColor} font-medium xs:text-sm`}>
          ₦
          {showAcceptButton || isCompleted || isFromAllBet || isFromPrivateBet
            ? bet.totalAmount.toFixed(2)
            : (bet.totalAmount / 2).toFixed(2)}
        </p>
      </div>

      <div className="flex justify-between mb-2">
        <p className={`${secondaryTextColor} xs:text-sm`}>
          {showAcceptButton || isCompleted || isFromAllBet || isFromPrivateBet
            ? `Commission Fees (${bet.fee}%)`
            : `Cancellation Fee (${bet.fee}%)`}
        </p>
        <p className={`${textColor} font-medium xs:text-sm`}>
          ₦
          {showAcceptButton || isCompleted || isFromAllBet || isFromPrivateBet
            ? commissionFee.toFixed(2)
            : (commissionFee / 2).toFixed(2)}
        </p>
      </div>

      <div className="flex justify-between mb-2">
        <p className={`${secondaryTextColor} xs:text-sm`}>{getAmountLabel()}</p>
        <p className={`${getAmountValueClass()} xs:text-sm`}>
          ₦{potentialWinnings}
        </p>
      </div>
    </div>
  );
};
