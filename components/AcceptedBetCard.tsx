"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/lib/contexts/ThemeContext";
import type { BetItem, User } from "@/lib/types/transactionHistory";
import { formattedDate } from "@/lib/utils";

interface AcceptedBetCardProps {
  bet: BetItem;
  currentUserId: string;
}

const AcceptedBetCard: React.FC<AcceptedBetCardProps> = ({
  bet,
  currentUserId,
}) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode
    ? "text-white font-bold"
    : "text-black font-bold";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const cardBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";
  const dividerColor = isDarkMode ? "border-[#62629e]" : "border-gray-300";
  const vsBackgroundColor = isDarkMode ? "bg-[#2a295a]" : "bg-gray-200";
  const isOwner = bet.owner.id === currentUserId;
  const isChallenger = bet.challenger && bet.challenger.id === currentUserId;
  const router = useRouter();

  const isOwnerPredictionWin = bet.ownerPrediction === "WIN";
  const isOwnerPredictionLose = bet.ownerPrediction === "LOSE";
  const isOwnerPredictionDraw = bet.ownerPrediction === "DRAW";
  const isChallengerPredictionWin = bet.challengerPrediction === "WIN";
  const isChallengerPredictionDraw = bet.challengerPrediction === "DRAW";

  const leftTeam = isOwnerPredictionWin
    ? bet.fixture.item1
    : isOwnerPredictionLose
    ? isChallengerPredictionWin || isChallengerPredictionDraw
      ? bet.fixture.item2
      : bet.fixture.item1
    : isOwnerPredictionDraw
    ? isChallengerPredictionWin
      ? bet.fixture.item2
      : bet.fixture.item1
    : bet.fixture.item1;

  const rightTeam = isOwnerPredictionWin
    ? bet.fixture.item2
    : isOwnerPredictionLose
    ? isChallengerPredictionWin || isChallengerPredictionDraw
      ? bet.fixture.item1
      : bet.fixture.item2
    : isOwnerPredictionDraw
    ? isChallengerPredictionWin
      ? bet.fixture.item1
      : bet.fixture.item2
    : bet.fixture.item2;

  const getLeagueName = () => {
    const parts = bet.category.split(":");
    return parts.length > 1
      ? `${parts[0].trim()} - ${parts[1].trim()}`
      : bet.category;
  };

  const getPredictionText = (prediction: string | null, condition: string) => {
    if (!prediction) return "";

    switch (prediction) {
      case "WIN":
        return `To Win/${condition} result`;
      case "LOSE":
        return `To Win/${condition} result`;
      case "DRAW":
        return `To Draw/${condition} result`;
      default:
        return `To ${prediction}/${condition} result`;
    }
  };

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

  const getUserDisplayName = (user: User | null) => {
    if (!user) return "";
    return user.nickname || `${user.firstname} ${user.lastname}`;
  };

  return (
    <div
      className="mb-2 cursor-pointer -mt-16"
      onClick={() =>
        router.push(
          `/bet-details/${
            bet.id
          }?fromAcceptedBet=true&itemData=${encodeURIComponent(
            JSON.stringify(bet)
          )}`
        )
      }
    >
      {/* Date at top */}
      <p className={`text-xs ${secondaryTextColor} mb-2 font-bold`}>
        {formattedDate(bet.time)}
      </p>

      {/* Card */}
      <div
        className={`${cardBg} rounded-lg border-[0.2px] border-[#62629e] p-3`}
      >
        {/* League and Match Time */}
        <div className="flex justify-between items-center mb-3 border-b pb-2 border-[#62629e] border-b-[0.4px]">
          <p
            className={`${secondaryTextColor} text-xs font-bold w-40 line-clamp-2`}
          >
            {getLeagueName()}
          </p>
          <p className={`${secondaryTextColor} text-xs font-bold`}>
            {formattedDate(bet.fixture.time)}
          </p>
        </div>

        {/* Users */}
        <div className="flex justify-between items-center mb-1">
          {/* Left User (Owner) */}
          <div className="flex items-center">
            <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
              <Image
                src={bet.owner.avatarUrl || "/placeholder.svg"}
                alt="Owner avatar"
                fill
                className="object-cover"
              />
            </div>
            <p
              className={`${textColor}  w-26  text-sm  font-semibold truncate`}
            >
              {isOwner ? "Me" : getUserDisplayName(bet.owner)}
            </p>
          </div>

          {/* Right User (Challenger) */}
          <div className="flex items-center">
            <p
              className={`${textColor} mr-2   text-right w-26 text-sm  font-semibold truncate`}
            >
              {isChallenger ? "Me" : getUserDisplayName(bet.challenger)}
            </p>
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={bet.challenger?.avatarUrl || ""}
                alt="Challenger avatar"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Teams section with vertical line */}
        <div className="relative">
          <div className="flex justify-between items-center">
            {/* Team 1 (Left) */}
            <div className="flex-1 flex items-center">
              <div className="relative w-6 h-6 mr-2">
                <Image
                  src={leftTeam.logoUrl || "/placeholder.svg"}
                  alt="Left team logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p
                className={`${textColor}  w-26 xs:w-20 text-sm xs:text-xs font-semibold truncate`}
              >
                {leftTeam.name}
              </p>
            </div>

            {/* VS */}
            <div className="relative mx-2 w-8 items-center">
              <div
                className="absolute w-[0.3px] bg-[#62629e]"
                style={{
                  height: "126px",
                  top: "-40px",
                  left: "50%",
                  marginLeft: "-0.5px",
                  border: "0.2px",
                  borderStyle: "dotted",
                }}
              />
              <div
                className={`${vsBackgroundColor} rounded-full px-2 py-1 z-10 my-2`}
              >
                <p
                  className={`${secondaryTextColor} text-xs font-medium text-center`}
                >
                  Vs
                </p>
              </div>
            </div>

            {/* Team 2 (Right) */}
            <div className="flex-1 flex items-center justify-end">
              <p
                className={`${textColor} text-sm font-semibold flex-1 text-right truncate`}
              >
                {rightTeam.name}
              </p>
              <div className="relative w-6 h-6 ml-2">
                <Image
                  src={rightTeam.logoUrl || "/placeholder.svg"}
                  alt="Right team logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Horizontal divider */}
          <div className={`h-[0.5px] ${dividerColor} w-full`} />
        </div>

        {/* Predictions */}
        <div className="flex justify-between items-center mb-1">
          {/* Owner Prediction */}
          <div className="flex-col items-start">
            <p
              className={`${getPredictionColor(
                bet.ownerPrediction
              )} font-semibold mb-1 text-sm`}
            >
              {getPredictionText(bet.ownerPrediction, bet.condition)}
            </p>
            <p className={`${textColor} font-semibold text-sm`}>
              ₦{(bet.totalAmount / 2).toFixed(2)}
            </p>
          </div>

          {/* Challenger Prediction */}
          <div className="flex-col items-end text-right">
            <p
              className={`${getPredictionColor(
                bet.challengerPrediction
              )} font-semibold mb-1 text-sm`}
            >
              {getPredictionText(bet.challengerPrediction, bet.condition)}
            </p>
            <p className={`${textColor} font-semibold text-sm`}>
              ₦{(bet.totalAmount / 2).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Potential Win */}
        <div
          className={`flex-col justify-center items-center border-t-[0.5px] ${dividerColor} pt-2 text-center`}
        >
          <p
            className={`${secondaryTextColor} text-sm  text-[10px] uppercase mb-1 tracking-wider`}
          >
            POTENTIAL WIN
          </p>
          <p className={`${textColor} font-bold text-sm`}>
            ₦{(bet.potentialWin * (1 - bet.fee / 100)).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcceptedBetCard;
