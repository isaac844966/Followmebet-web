"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/lib/contexts/ThemeContext";
import type { BetItem, User } from "@/lib/types/transactionHistory";
import { formattedDate } from "@/lib/utils";

interface SettledBetCardProps {
  bet: BetItem;
  currentUserId: string;
}

const SettledBetCard: React.FC<SettledBetCardProps> = ({
  bet,
  currentUserId,
}) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const cardBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";
  const vsBackgroundColor = isDarkMode ? "bg-[#2a295a]" : "bg-gray-200";
  const router = useRouter();

  const getPredictionColor = (prediction: string | null) => {
    if (!prediction) return "";
    switch (prediction) {
      case "WIN":
      case "LOSE":
        return "text-green-500";
      case "DRAW":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  const getResultColor = (prediction: string | null) => {
    if (!prediction) return "";
    switch (prediction) {
      case "WIN":
        return "text-green-500";
      case "LOSE":
        return "text-red-500";
      case "DRAW":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  const getPredictionText = (pred: string | null) => {
    if (!pred) return "";
    const base =
      pred === "WIN" ? "To Win" : pred === "DRAW" ? "To Draw" : "To Win";
    const suffix = bet.condition === "HT" ? "/HT result" : "/FT result";
    return base + suffix;
  };

  const ownerPredictedCorrectly = bet.ownerPrediction === bet.result;
  const challengerPredictedCorrectly = bet.challengerPrediction === bet.result;

  // Determine left/right user by who predicted correctly
  let leftUser: User, rightUser: User;
  if (ownerPredictedCorrectly) {
    leftUser = bet.owner;
    rightUser = bet.challenger!;
  } else if (challengerPredictedCorrectly) {
    leftUser = bet.challenger!;
    rightUser = bet.owner;
  } else {
    leftUser = bet.owner;
    rightUser = bet.challenger!;
  }

  // Helper to gray out sides
  const isGraySide = (side: "left" | "right") => {
    const user = side === "left" ? leftUser : rightUser;
    if (bet.result === "DRAW") return true;
    const isMe = user?.id === currentUserId;
    if (bet.result === "WIN") return !isMe;
    if (bet.result === "LOSE") return isMe;
    return false;
  };

  const getSideOpacity = (side: "left" | "right") =>
    isGraySide(side) ? "opacity-20" : "";
  const getSideTextColor = (side: "left" | "right") =>
    isGraySide(side) ? "text-[#A0A3AC] font-bold" : textColor;
  const getAmountTextStyle = (side: "left" | "right") =>
    isGraySide(side)
      ? `${getSideTextColor(side)}`
      : `${getSideTextColor(side)} font-bold`;

  // Team selection logic
  const { item1, item2 } = bet.fixture;

  // Owner's team
  const ownerTeam =
    bet.ownerPrediction === "WIN"
      ? item1
      : bet.ownerPrediction === "DRAW"
      ? bet.challengerPrediction === "WIN"
        ? item2 // challenger won the draw, so owner gets the other side
        : item1
      : /* ownerPrediction = LOSE */ item2;

  // Challenger's team
  const challengerTeam =
    bet.ownerPrediction === "WIN"
      ? item2
      : bet.ownerPrediction === "DRAW"
      ? bet.challengerPrediction === "WIN"
        ? item1
        : item2
      : bet.challengerPrediction === "WIN" ||
        bet.challengerPrediction === "DRAW"
      ? item1
      : item2;

  const leftTeam = leftUser?.id === bet?.owner?.id ? ownerTeam : challengerTeam;
  const rightTeam =
    rightUser.id === bet?.owner?.id ? ownerTeam : challengerTeam;

  const getLeagueName = () => {
    const parts = bet.category.split(":");
    return parts.length > 1
      ? `${parts[0].trim()} - ${parts[1].trim()}`
      : bet.category;
  };

  const rawScore =
    bet.condition === "HT" ? bet.fixture.htResult : bet.fixture.ftResult;
  const [leftScore, rightScore] = rawScore?.split(" - ") ?? ["", ""];

  return (
    <div
      className="mb-4 w-full cursor-pointer -mt-16 xs:-mt-10"
      onClick={() =>
        router.push(
          `/bet-details/${
            bet.id
          }?fromSettledBet=true&itemData=${encodeURIComponent(
            JSON.stringify(bet)
          )}`
        )
      }
    >
      <p className={`${secondaryTextColor} mb-2 text-sm xs:text-xs`}>
        {formattedDate(bet.time)}
      </p>
      <div
        className={`${cardBg} rounded-lg border-[0.2px] border-[#62629e] p-3 xs:p-2`}
      >
        {/* League & Time */}
        <div className="flex justify-between items-center mb-3 border-b-[0.4px] pb-2 border-[#62629e]">
          <p
            className={`${secondaryTextColor} text-xs xs:text-[10px] font-bold w-40 xs:w-32 line-clamp-2`}
          >
            {getLeagueName()}
          </p>
          <p
            className={`${secondaryTextColor} text-xs xs:text-[10px] font-bold`}
          >
            {formattedDate(bet.fixture.time)}
          </p>
        </div>

        {/* Users */}
        <div className="flex justify-between items-center mb-3 xs:mb-2">
          <div className="flex items-center">
            <div
              className={`relative w-6 h-6 xs:w-5 xs:h-5 rounded-full overflow-hidden mr-2 xs:mr-1 ${getSideOpacity(
                "left"
              )}`}
            >
              <Image
                src={leftUser.avatarUrl || "/placeholder.svg"}
                alt="Left user avatar"
                fill
                className="object-cover"
              />
            </div>
            <p
              className={`${getSideTextColor("left")} font-semibold xs:text-sm`}
            >
              {leftUser?.id === currentUserId
                ? "Me"
                : leftUser.nickname ||
                  `${leftUser.firstname} ${leftUser.lastname}`}
            </p>
          </div>
          <div className="flex items-center">
            <p
              className={`${getSideTextColor(
                "right"
              )} mr-2 xs:mr-1 font-semibold xs:text-sm`}
            >
              {rightUser?.id === currentUserId
                ? "Me"
                : rightUser.nickname ||
                  `${rightUser.firstname} ${rightUser.lastname}`}
            </p>
            <div
              className={`relative w-6 h-6 xs:w-5 xs:h-5 rounded-full overflow-hidden ${getSideOpacity(
                "right"
              )}`}
            >
              <Image
                src={rightUser.avatarUrl || "/placeholder.svg"}
                alt="Right user avatar"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Teams */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex-1 flex items-center">
            <div
              className={`relative w-6 h-6 xs:w-5 xs:h-5 mr-2 xs:mr-1 ${getSideOpacity(
                "left"
              )}`}
            >
              <Image
                src={leftTeam.logoUrl || "/placeholder.svg"}
                alt="Left team logo"
                fill
                className="object-contain"
              />
            </div>
            <p
              className={`${getSideTextColor(
                "left"
              )} text-sm xs:text-xs flex-1 font-semibold truncate`}
            >
              {leftTeam.name}
            </p>
          </div>
          <div className="relative mx-2 xs:mx-1 w-8 xs:w-6 items-center">
            <div
              className="absolute w-[0.1px] bg-gray-900"
              style={{
                height: "145px",
                top: "-45px",
                left: "50%",
                marginLeft: "-0.5px",
                border: "0.2px",
                borderStyle: "dotted",
              }}
            />
            <div
              className={`${vsBackgroundColor} rounded-full px-2 xs:px-1.5 py-1 xs:py-0.5 z-10 my-2 xs:my-1`}
            >
              <p
                className={`${secondaryTextColor} text-xs xs:text-[10px] font-medium text-center`}
              >
                Vs
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <p
              className={`${getSideTextColor(
                "right"
              )} text-sm xs:text-xs flex-1 text-right font-semibold truncate`}
            >
              {rightTeam.name}
            </p>
            <div
              className={`relative w-6 h-6 xs:w-5 xs:h-5 ml-2 xs:ml-1 ${getSideOpacity(
                "right"
              )}`}
            >
              <Image
                src={rightTeam.logoUrl || "/placeholder.svg"}
                alt="Right team logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Predictions */}
        <div className="flex justify-between items-center mb-1">
          <p
            className={`${
              isGraySide("left")
                ? "text-[#A0A3AC]"
                : getPredictionColor(
                    leftUser?.id === bet.owner?.id
                      ? bet.ownerPrediction
                      : bet.challengerPrediction
                  )
            } text-md xs:text-sm font-semibold`}
          >
            {getPredictionText(
              leftUser?.id === bet.owner?.id
                ? bet.ownerPrediction
                : bet.challengerPrediction
            )}
          </p>
          <p
            className={`${
              isGraySide("right")
                ? "text-[#A0A3AC]"
                : getPredictionColor(
                    rightUser?.id === bet.owner?.id
                      ? bet.ownerPrediction
                      : bet.challengerPrediction
                  )
            } text-md xs:text-sm font-semibold`}
          >
            {getPredictionText(
              rightUser?.id === bet.owner?.id
                ? bet.ownerPrediction
                : bet.challengerPrediction
            )}
          </p>
        </div>

        {/* Amounts */}
        <div className="flex justify-between items-center">
          <p className={`${getAmountTextStyle("left")} xs:text-sm`}>
            ₦{(bet.totalAmount / 2).toFixed(2)}
          </p>
          <p className={`${getAmountTextStyle("right")} xs:text-sm`}>
            ₦{(bet.totalAmount / 2).toFixed(2)}
          </p>
        </div>

        {/* Outcome & Score */}
        <div className="mt-2 flex items-center border-t-[0.4px] pt-2 border-[#62629e]">
          <div className="flex-1">
            <p
              className={`text-md xs:text-sm font-bold uppercase ${getResultColor(
                bet.result
              )}`}
            >
              {bet.result}
            </p>
            <p className={`${textColor} font-semibold text-md xs:text-sm mt-1`}>
              ₦
              {bet.result === "WIN"
                ? (bet.potentialWin * (1 - bet.fee / 100)).toFixed(2)
                : bet.result === "LOSE"
                ? (bet.potentialWin / bet.potentialWin - 1).toFixed(2)
                : ((bet.potentialWin / 2) * (1 - bet.fee / 100)).toFixed(2)}
            </p>
          </div>
          <p
            className={`flex-1 text-center text-md xs:text-sm font-semibold ${textColor}`}
          >
            {bet.condition}
          </p>
          <div className="flex-1 items-end"> 
            <div className="flex items-center justify-end">
              <p
                className={`${textColor} text-right w-26 xs:w-20 text-sm xs:text-xs font-semibold truncate`}
              >
                {bet.fixture.item1.name}
              </p>
              <p className={`${textColor} ml-1 xs:text-xs`}>{leftScore}</p>
            </div>
            <div className="flex items-center justify-end mt-1">
              <p
                className={`${textColor} text-right w-26 xs:w-20 text-sm xs:text-xs font-semibold truncate`}
              >
                {bet.fixture.item2.name}
              </p>
              <p className={`${textColor} ml-1 xs:text-xs`}>{rightScore}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettledBetCard;
