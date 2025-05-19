"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import Image from "next/image";

interface BetFixture {
  time: string;
  item1?: { name: string; logoUrl?: string };
  item2?: { name: string; logoUrl?: string };
  htResult?: string;
  ftResult?: string;
}

interface BetOwner {
  id: string;
  firstname?: string;
  lastname?: string;
  nickname?: string;
  avatarUrl?: string;
}

interface Bet {
  id: string;
  owner?: BetOwner;
  challenger?: BetOwner | null;
  fixture: BetFixture;
  ownerPrediction: "WIN" | "LOSE" | "DRAW" | null;
  challengerPrediction: "WIN" | "LOSE" | "DRAW" | null;
  status: string;
  category: string;
  condition: "HT" | "FT" | string;
  totalAmount: number;
  potentialWin: number;
  fee: number;
  result?: "WIN" | "LOSE" | "DRAW" | null;
}

interface BetDetailsCardProps {
  bet: Bet;
  resultToShow?: string | null;
}

export const BetDetailsCard: React.FC<BetDetailsCardProps> = ({
  bet,
  resultToShow,
}) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const primaryBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  // Format date
  const matchDate = new Date(bet.fixture.time);
  const formattedDate = matchDate.toLocaleDateString();
  const formattedTime = matchDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Get prediction color
  const getPredictionColor = (
    prediction: string | null | undefined
  ): string => {
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

  // Get team names for easier reference
  const team1 = bet.fixture.item1 || { name: "Team 1" };
  const team2 = bet.fixture.item2 || { name: "Team 2" };
  const team1Name = team1.name;
  const team2Name = team2.name;

  // Parse scores if available
  const [leftScore, rightScore] = resultToShow?.split(" - ") ?? ["", ""];

  return (
    <div className={`${primaryBg} px-4 xs:px-3 py-6 xs:py-4 mb-4`}>
      <p
        className={`${secondaryTextColor} text-center mb-1 xs:mb-0.5 font-bold text-sm xs:text-xs`}
      >
        {bet.category}
      </p>
      <p
        className={`${secondaryTextColor} text-center text-xs xs:text-[10px] mb-3 xs:mb-2 font-bold`}
      >
        {formattedDate}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center flex-1">
          <div className="relative w-14 h-14 xs:w-10 xs:h-10 mb-2 xs:mb-1">
            <Image
              src={team1.logoUrl || "/placeholder.svg?height=40&width=40"}
              alt={team1Name}
              fill
              className="object-contain"
            />
          </div>
          <p
            className={`${textColor} text-center font-medium max-w-[120px] xs:max-w-[90px] xs:text-xs`}
            style={{ wordBreak: "break-word" }}
          >
            {team1Name}
          </p>
          {resultToShow && resultToShow !== "?-?" && (
            <p
              className={`${textColor} text-center font-medium mt-2 xs:mt-1 xs:text-sm`}
            >
              {leftScore}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center mx-4 xs:mx-2">
          <p className={`${textColor} text-lg xs:text-base font-bold`}>Vs</p>
          <p className={`${secondaryTextColor} text-xs xs:text-[10px] mt-1`}>
            {formattedTime}
          </p>
          {bet.fixture.htResult !== "?-?" && bet.result ? (
            <p
              className={`${getPredictionColor(
                bet.result
              )} text-center font-medium mt-2 xs:mt-1 xs:text-sm`}
            >
              You {bet.result}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-center flex-1">
          <div className="relative w-14 h-14 xs:w-10 xs:h-10 mb-2 xs:mb-1">
            <Image
              src={team2.logoUrl || "/placeholder.svg?height=40&width=40"}
              alt={team2Name}
              fill
              className="object-contain"
            />
          </div>
          <p
            className={`${textColor} text-center font-medium max-w-[120px] xs:max-w-[90px] xs:text-xs`}
            style={{ wordBreak: "break-word" }}
          >
            {team2Name}
          </p>
          {resultToShow && resultToShow !== "?-?" && (
            <p
              className={`${textColor} text-center font-medium mt-2 xs:mt-1 xs:text-sm`}
            >
              {rightScore}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
