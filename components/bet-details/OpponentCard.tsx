"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";

interface OpponentCardProps {
  challenger?: {
    id: string;
    firstname?: string;
    lastname?: string;
    nickname?: string;
    avatarUrl?: string;
  } | null;
  status: string;
  isFromAllBet: boolean;
  selectedPrediction: string | null;
  showSelectionOptions: boolean;
}

export const OpponentCard: React.FC<OpponentCardProps> = ({
  challenger,
  status,
  isFromAllBet,
  selectedPrediction,
  showSelectionOptions,
}) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuthStore();
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const primaryBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";

  const isChallenger = user?.id === challenger?.id;

  const getStatusColor = (status: string): string => {
    if (!status) return "";

    switch (status) {
      case "PENDING":
        return "text-[#F2B100]";
      case "COMPLETED":
        return "text-green-500";
      default:
        return textColor;
    }
  };

  return (
    <div className={`${primaryBg} rounded-xl p-4 xs:p-3 mb-2`}>
      <p
        className={`${secondaryTextColor} uppercase text-xs xs:text-[10px] mb-2 xs:mb-1`}
      >
        OPPONENT
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {challenger?.avatarUrl ? (
            <div
              className="relative w-10 h-10 xs:w-8 xs:h-8 rounded-full overflow-hidden"
              style={{ backgroundColor: "#F2B100" }}
            >
              <Image
                src={challenger.avatarUrl || "/placeholder.svg"}
                alt="Challenger avatar"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className={`${backgroundColor} p-2 xs:p-1.5 rounded-full`}>
              {isFromAllBet ? (
                <div
                  className="relative w-10 h-10 xs:w-8 xs:h-8 rounded-full overflow-hidden"
                  style={{ backgroundColor: "#F2B100" }}
                >
                  <Image
                    src={
                      user?.avatarUrl || "/placeholder.svg?height=40&width=40"
                    }
                    alt="User avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <p className={`${textColor} font-bold text-xl xs:text-lg`}>
                  🏆
                </p>
              )}
            </div>
          )}
          <div className="ml-3 xs:ml-2">
            {challenger?.firstname ? (
              <p className={`${textColor} font-medium xs:text-sm`}>
                {isChallenger
                  ? "Me"
                  : challenger?.nickname ||
                    `${challenger?.firstname} ${challenger?.lastname}`}
              </p>
            ) : (
              <p className={`${textColor} font-bold xs:text-sm`}>
                {isFromAllBet ? `${user?.firstname}` : "Bet Market"}
              </p>
            )}
            {challenger?.firstname && (
              <div className="flex items-center">
                <div className="w-3 h-3 xs:w-2 xs:h-2 rounded-full bg-yellow-500 mr-1"></div>
                <p className={`${secondaryTextColor} text-xs xs:text-[10px]`}>
                  LEGENDARY
                </p>
              </div>
            )}
          </div>
        </div>

        {showSelectionOptions ? (
          <p className={`${textColor} font-medium xs:text-sm`}>
            {selectedPrediction}
          </p>
        ) : (
          <div>
            <p className={`${textColor} font-bold xs:text-sm`}>Status:</p>
            <p className={`${getStatusColor(status)} font-bold xs:text-sm`}>
              {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
