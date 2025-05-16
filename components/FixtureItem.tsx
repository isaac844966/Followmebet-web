"use client";

import Image from "next/image";
import { format, parseISO } from "date-fns";
import type { FixtureItem as FixtureItemType } from "@/lib/services/fixtureService";
import { LiveFixtureData } from "@/hooks/use-live-fixture-data";

interface TeamInfo {
  name: string;
  logoUrl?: string;
}

interface TeamDisplayProps {
  team1: TeamInfo;
  team2: TeamInfo;
  textColor: string;
}

interface FixtureItemProps {
  fixture: FixtureItemType;
  categoryId: string;
  isDarkMode: boolean;
  textColor: string;
  secondaryTextColor: string;
  liveFixtureData: Record<string, LiveFixtureData>;
  onCreateBet: () => void;
}

export default function FixtureItem({
  fixture,
  categoryId,
  isDarkMode,
  textColor,
  secondaryTextColor,
  liveFixtureData,
  onCreateBet,
}: FixtureItemProps) {
  const matchTime = fixture.time ? format(parseISO(fixture.time), "HH:mm") : "";
  const matchDate = fixture.time ? format(parseISO(fixture.time), "d MMM") : "";
  const cardBackground = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  // Get live fixture data if available
  const getLiveFixtureData = (
    eventCode: string | number
  ): LiveFixtureData | null => {
    const eventCodeStr = String(eventCode);
    return liveFixtureData[eventCodeStr] || null;
  };

  const liveData = fixture.eventCode
    ? getLiveFixtureData(fixture.eventCode)
    : null;

  if (fixture.betStatus === "ON") {
    return (
      <div className={`${cardBackground} rounded-lg mb-1 overflow-hidden`}>
        <div className="p-3 flex items-center justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="border-r border-r-[#62629e] pr-4">
                <p
                  className={`${textColor} text-md w-10 mb-1 text-center font-bold`}
                >
                  {matchDate}
                </p>
                <p className={`${secondaryTextColor} text-md`}>{matchTime}</p>
              </div>
              <TeamDisplay
                team1={fixture.item1}
                team2={fixture.item2}
                textColor={textColor}
              />
            </div>
          </div>
          <button
            className={`${
              isDarkMode ? "bg-[#0B0B3F]" : "bg-[#E8E8FF]"
            } px-4 py-4 rounded-lg`}
            onClick={onCreateBet}
          >
            <span
              className={`${isDarkMode ? "text-white" : "text-black"} text-xs`}
            >
              Create New Bet
            </span>
          </button>
        </div>
      </div>
    );
  } else {
    // This is for fixtures with betStatus "OFF" showing live data
    return (
      <div className={`${cardBackground} rounded-lg mb-1 overflow-hidden`}>
        <div className="p-3 flex items-center justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="border-r border-r-[#62629e] pr-4">
                <p className={`${secondaryTextColor} text-md`}>{matchTime}</p>
                {/* Match status */}
                {liveData && (
                  <p
                    className={`${
                      liveData.status === "FT" ||
                      liveData.status === "CANC" ||
                      liveData.status === "PST"
                        ? `${secondaryTextColor}`
                        : "text-[#FFA726]"
                    } text-md text-center font-medium`}
                  >
                    {String(liveData.status || "NS")}
                  </p>
                )}
              </div>
              <TeamDisplay
                team1={fixture.item1}
                team2={fixture.item2}
                textColor={textColor}
              />
            </div>
          </div>

          {/* Live match data display */}
          {liveData && (
            <div className="items-center">
              {/* Team A score */}
              <p
                className={`text-md font-bold mb-1 ${
                  liveData.status === "FT" ||
                  liveData.status === "CANC" ||
                  liveData.status === "PST"
                    ? `${secondaryTextColor}`
                    : "text-[#FFA726]"
                }`}
              >
                {String(liveData.home_live_goals)}
              </p>

              {/* Team B score */}
              <p
                className={`text-md font-bold ${
                  liveData.status === "FT" ||
                  liveData.status === "CANC" ||
                  liveData.status === "PST"
                    ? `${secondaryTextColor}`
                    : "text-[#FFA726]"
                }`}
              >
                {String(liveData.away_live_goals)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// Helper component for team display
function TeamDisplay({ team1, team2, textColor }: TeamDisplayProps) {
  return (
    <div className="mb-1 mr-2">
      <div className="flex items-center mb-2">
        <div className="relative w-5 h-5 mr-2">
          <Image
            src={team1.logoUrl || "/placeholder.svg?height=24&width=24"}
            alt={team1.name}
            fill
            className="object-contain"
          />
        </div>
        <p className={`${textColor} text-sm max-w-[8.5rem] truncate`}>
          {team1.name}
        </p>
      </div>
      <div className="flex items-center">
        <div className="relative w-5 h-5 mr-2">
          <Image
            src={team2.logoUrl || "/placeholder.svg?height=24&width=24"}
            alt={team2.name}
            fill
            className="object-contain"
          />
        </div>
        <p className={`${textColor} text-sm max-w-[8.5rem] truncate`}>
          {team2.name}
        </p>
      </div>
    </div>
  );
}
