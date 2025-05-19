"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import type { BetItem } from "@/lib/types/transactionHistory";
import { formattedDate } from "@/lib/utils";
import Image from "next/image";

interface BetCardProps {
  bet: BetItem;
  onDelete?: (id: string) => void;
  currentUserId?: string;
}

const PublicBetCard: React.FC<BetCardProps> = ({ bet }) => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const cardBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-700";

  // Format prediction
  const getPredictionText = () => {
    if (bet.ownerPrediction === "WIN") {
      return "Win/FT result";
    } else if (bet.ownerPrediction === "LOSE") {
      return "Win/FT result";
    } else if (bet.ownerPrediction === "DRAW") {
      return "Draw/FT result";
    }
    return `${bet.ownerPrediction}/${bet.condition} result`;
  };

  // Get category (league) name
  const getLeagueName = () => {
    const parts = bet.category.split(":");
    if (parts.length > 1) {
      return `${parts[0].trim()} - ${parts[1].trim()}`;
    }
    return bet.category;
  };

  return (
    <div className="mb-4 xs:mb-3">
      {/* Date and User at top */}
      <div className="flex justify-between items-center mb-2 xs:mb-1">
        <p className={`text-xs xs:text-[10px] ${secondaryTextColor}`}>
          {formattedDate(bet.time)}
        </p>
        <div className="flex items-center">
          <p className={`${textColor} mr-2 xs:mr-1 xs:text-xs`}>Me</p>
          <div className="relative w-6 h-6 xs:w-5 xs:h-5 rounded-full overflow-hidden">
            <Image
              src={bet.owner.avatarUrl || "/placeholder.svg"}
              alt="User avatar"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        className={`${cardBg} border-[0.2px] border-[#62629e] p-3 xs:p-2 shadow-sm w-[98%] rounded-tl-lg rounded-bl-lg rounded-br-lg`}
      >
        {/* League and Match Time Row */}
        <div className="flex justify-between items-center mb-2 xs:mb-1">
          <p
            className={`${secondaryTextColor} text-xs xs:text-[10px] w-40 xs:w-32 line-clamp-2`}
          >
            {getLeagueName()}
          </p>
          <p className={`${secondaryTextColor} text-xs xs:text-[10px]`}>
            {formattedDate(bet.fixture.time)}
          </p>
        </div>

        {/* Teams */}
        <div className="flex justify-between items-center mb-3 xs:mb-2 px-1 border-[#62629e] border-b-[0.2px] pb-2 xs:pb-1.5">
          <div className="flex-1 flex items-center">
            <div className="relative w-6 h-6 xs:w-4 xs:h-4 mr-2 xs:mr-1">
              <Image
                src={bet.fixture.item1.logoUrl || "/placeholder.svg"}
                alt="Team 1 logo"
                fill
                className="object-contain"
              />
            </div>
            <p
              className={`${textColor} text-sm xs:text-[10px] flex-1 truncate`}
            >
              {bet.fixture.item1.name}
            </p>
          </div>

          <p
            className={`${secondaryTextColor} mx-2 xs:mx-1 text-xs xs:text-[10px]`}
          >
            Vs
          </p>

          <div className="flex-1 flex items-center justify-end">
            <p
              className={`${textColor} text-sm xs:text-[10px] flex-1 text-right truncate`}
            >
              {bet.fixture.item2.name}
            </p>
            <div className="relative w-6 h-6 xs:w-4 xs:h-4 ml-2 xs:ml-1">
              <Image
                src={bet.fixture.item2.logoUrl || "/placeholder.svg"}
                alt="Team 2 logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Prediction */}
        <div className="flex justify-between items-center mb-3 xs:mb-2">
          <div className="flex flex-col items-start">
            <p className={`${textColor} mb-1 xs:mb-0.5 xs:text-[10px]`}>
              {bet.fixture.item1.name}
            </p>
            <p className="text-green-500 xs:text-[10px]">
              {getPredictionText()}
            </p>
          </div>

          <div className="flex items-center">
            <span className={`${textColor} mr-1 xs:text-xs`}>🏆</span>
            <p className={`${textColor} xs:text-[10px]`}>BetMarket</p>
          </div>
        </div>

        {/* Amount and Delete Button */}
        <div className="flex justify-between items-center">
          <p className={`${textColor} font-bold xs:text-xs`}>
            ₦{(bet.totalAmount / 2).toLocaleString()}
          </p>
          <button
            className="bg-[#FC0900] px-6 xs:px-3 py-3 xs:py-1.5 rounded text-white xs:text-[10px]"
            onClick={() =>
              router.push(
                `/bet-details/${
                  bet.id
                }?fromPublicBet=true&itemData=${encodeURIComponent(
                  JSON.stringify(bet)
                )}`
              )
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicBetCard;
