"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/lib/contexts/ThemeContext";
import type { BetItem } from "@/lib/types/transactionHistory";
import { declineBet } from "@/lib/services/bet-historyService";
import { fetchUserProfile } from "@/lib/services/authService";
import { formattedDate } from "@/lib/utils";
import CustomModal from "@/components/CustomModal";

interface PrivateBetCardProps {
  bet: BetItem;
  currentUserId: string;
  onDelete?: (id: string) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const PrivateBetCard: React.FC<PrivateBetCardProps> = ({
  bet,
  currentUserId,
  onDecline,
}) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const [isDeclineModalVisible, setIsDeclineModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isOwner = bet.owner.id === currentUserId;
  const isChallenger = bet.challenger && bet.challenger.id === currentUserId;
  const cardBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  const getPredictionText = () => {
    switch (bet.ownerPrediction) {
      case "WIN":
        return "Win/FT result";
      case "LOSE":
        return "Win/FT result";
      case "DRAW":
        return "Draw/FT result";
      default:
        return `${bet.ownerPrediction}/${bet.condition} result`;
    }
  };

  const roundedBorder = isChallenger
    ? "rounded-tr-lg rounded-bl-lg rounded-br-lg"
    : "rounded-tl-lg rounded-bl-lg rounded-br-lg";

  const getLeagueName = () => {
    const parts = bet.category.split(":");
    return parts.length > 1
      ? `${parts[0].trim()} - ${parts[1].trim()}`
      : bet.category;
  };

  const showTopLeftUserInfo = !(
    isOwner &&
    bet.status === "PENDING" &&
    !bet.challenger
  );
  const showMeOnRight = !isChallenger;

  const handleDeclinePress = () => {
    setIsDeclineModalVisible(true);
  };

  const handleConfirmDecline = async () => {
    setIsLoading(true);
    try {
      await declineBet(bet.id);
      setIsDeclineModalVisible(false);
      if (onDecline) {
        onDecline(bet.id);
      }
      await fetchUserProfile();
    } catch (error) {
      console.error("Failed to decline bet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      {/* Decline Confirmation Modal */}
      <CustomModal
        visible={isDeclineModalVisible}
        onClose={() => setIsDeclineModalVisible(false)}
        title="Decline Bet"
        message="Are you sure you want to decline this bet? This action cannot be undone."
        primaryButtonText={isLoading ? "Declining..." : "Yes, Decline"}
        secondaryButtonText="Cancel"
        onPrimaryButtonPress={handleConfirmDecline}
        onSecondaryButtonPress={() => setIsDeclineModalVisible(false)}
        primaryButtonColor="#FF3B30"
        primaryTextColor="#FFFFFF"
        hideCloseOnOverlayPress={isLoading}
      />

      {/* Header Row */}
      <div className="flex justify-between items-center mb-2">
        {showTopLeftUserInfo && isChallenger ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
                <Image
                  src={bet.owner.avatarUrl || "/placeholder.svg"}
                  alt="Owner avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <p className={textColor}>
                {bet.owner.nickname ||
                  `${bet.owner.firstname} ${bet.owner.lastname}`}
              </p>
            </div>
            <p className={`text-xs text-right ${secondaryTextColor}`}>
              {formattedDate(bet.time)}
            </p>
          </div>
        ) : (
          <div></div>
        )}

        {showMeOnRight && (
          <div className="flex justify-between items-center w-full">
            <p className={`text-xs ${secondaryTextColor}`}>
              {formattedDate(bet.time)}
            </p>
            <div className="flex items-center">
              <p className={`${textColor} mr-2`}>Me</p>
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={
                    isOwner
                      ? bet.owner.avatarUrl
                      : bet.challenger?.avatarUrl || ""
                  }
                  alt="User avatar"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card */}
      <div
        className={`${cardBg} ${roundedBorder} border-[0.2px] border-[#62629e] p-3 shadow-sm w-[98%]`}
      >
        {/* League and Match Time */}
        <div className="flex justify-between items-center mb-2">
          <p className={`${secondaryTextColor} text-xs w-40 line-clamp-2`}>
            {getLeagueName()}
          </p>
          <p className={`${secondaryTextColor} text-xs`}>
            {formattedDate(bet.fixture.time)}
          </p>
        </div>

        {/* Teams */}
        <div className="flex justify-between items-center mb-3 px-1 border-[#62629e] border-b-[0.2px] pb-2">
          <div className="flex-1 flex items-center">
            <div className="relative w-6 h-6 mr-2">
              <Image
                src={bet.fixture.item1.logoUrl || "/placeholder.svg"}
                alt="Team 1 logo"
                fill
                className="object-contain"
              />
            </div>
            <p className={`${textColor} text-sm flex-1 truncate`}>
              {bet.fixture.item1.name}
            </p>
          </div>

          <p className={`${secondaryTextColor} mx-2 text-xs`}>Vs</p>

          <div className="flex-1 flex items-center justify-end">
            <p className={`${textColor} text-sm flex-1 text-right truncate`}>
              {bet.fixture.item2.name}
            </p>
            <div className="relative w-6 h-6 ml-2">
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
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col items-start">
            <p className={`${textColor} mb-1`}>
              {bet.ownerPrediction === "LOSE"
                ? bet.fixture.item2.name
                : bet.fixture.item1.name}
            </p>
            <p className="text-green-500">{getPredictionText()}</p>
          </div>

          <div className="flex items-center">
            {bet.challenger ? (
              <>
                <div className="relative w-5 h-5 rounded-full overflow-hidden mr-1">
                  <Image
                    src={bet.challenger.avatarUrl || "/placeholder.svg"}
                    alt="Challenger avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className={` xs:text-sm ${textColor}`}>
                  {bet.challenger.nickname ||
                    `${bet.challenger.firstname} ${bet.challenger.lastname}`}
                </p>
              </>
            ) : (
              <>
                <span className={`${textColor} mr-1`}>🏆</span>
                <p className={` xs:text-sm ${textColor}`}>BetMarket</p>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <p className={`${textColor} font-bold`}>
            ₦{(bet.totalAmount / 2).toLocaleString()}
          </p>

          {isChallenger ? (
            <div className="flex gap-2">
              <button
                className="bg-[#FBB03B] px-6 py-3 xs:px-4 xs:py-2  rounded text-white"
                onClick={handleDeclinePress}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Decline"}
              </button>
              <button
                className="bg-[#1E1F68] px-6 py-3 xs:px-4 xs:py-2  rounded text-white"
                onClick={() =>
                  router.push(
                    `/bet-details/${
                      bet.id
                    }?fromPrivateBet=true&itemData=${encodeURIComponent(
                      JSON.stringify(bet)
                    )}`
                  )
                }
                disabled={isLoading}
              >
                Accept
              </button>
            </div>
          ) : isOwner && bet.status === "PENDING" ? (
            <button
              className="bg-[#FC0900] px-6 py-3 xs:px-4 xs:py-2 rounded text-white"
              onClick={() =>
                router.push(
                  `/bet-details/${
                    bet.id
                  }?fromPrivateBetDelete=true&itemData=${encodeURIComponent(
                    JSON.stringify(bet)
                  )}`
                )
              }
            >
              Delete
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateBetCard;
