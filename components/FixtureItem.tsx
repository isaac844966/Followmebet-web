"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import type { FixtureItem as FixtureItemType } from "@/lib/services/fixtureService";
import type { LiveFixtureData } from "@/hooks/use-live-fixture-data";

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
  const router = useRouter();
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

  const handleViewCommentary = () => {
    if (!fixture.eventCode) return;

    router.push(
      `/commentary?eventCode=${
        fixture.eventCode
      }&team1Name=${encodeURIComponent(
        fixture.item1.name
      )}&team2Name=${encodeURIComponent(
        fixture.item2.name
      )}&team1Logo=${encodeURIComponent(
        fixture.item1.logoUrl || ""
      )}&team2Logo=${encodeURIComponent(
        fixture.item2.logoUrl || ""
      )}&category=${encodeURIComponent(
        fixture.category || ""
      )}&categoryId=${encodeURIComponent(categoryId)}`
    );
  };

  if (fixture.betStatus === "ON") {
    return (
      <div className={`${cardBackground} rounded-lg mb-1 overflow-hidden`}>
        <div className="p-3 xs:p-2 flex items-center justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 xs:gap-1">
              <div className="border-r border-r-[#62629e] pr-4 xs:pr-2">
                <p
                  className={`${textColor} text-md xs:text-sm w-10 xs:w-8 mb-1 text-center font-bold`}
                >
                  {matchDate}
                </p>
                <p className={`${secondaryTextColor} text-md xs:text-xs`}>
                  {matchTime}
                </p>
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
            } px-4 xs:px-2 py-4 xs:py-3 rounded-lg`}
            onClick={onCreateBet}
          >
            <span
              className={`${
                isDarkMode ? "text-white" : "text-black"
              } text-xs xs:text-[10px]`}
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
      <div
        className={`${cardBackground} rounded-lg mb-1 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}
        onClick={handleViewCommentary}
      >
        <div className="p-3 xs:p-2 flex items-center justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 xs:gap-1">
              <div className="border-r border-r-[#62629e] pr-4 xs:pr-2">
                <p className={`${secondaryTextColor} text-md xs:text-xs`}>
                  {matchTime}
                </p>
                {/* Match status */}
                {liveData && (
                  <p
                    className={`${
                      liveData.status === "FT" ||
                      liveData.status === "CANC" ||
                      liveData.status === "PST"
                        ? `${secondaryTextColor}`
                        : "text-[#FFA726]"
                    } text-md xs:text-xs text-center font-medium`}
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
                className={`text-md xs:text-sm font-bold mb-1 ${
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
                className={`text-md xs:text-sm font-bold ${
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
    <div className="mb-1 mr-2 xs:mr-1">
      <div className="flex items-center mb-2 xs:mb-1">
        <div className="relative w-5 h-5 xs:w-4 xs:h-4 mr-2 xs:mr-1">
          <Image
            src={team1.logoUrl || "/placeholder.svg?height=24&width=24"}
            alt={team1.name}
            fill
            className="object-contain"
          />
        </div>
        <p
          className={`${textColor} text-sm xs:text-xs max-w-[6rem]  truncate`}
        >
          {team1.name}
        </p>
      </div>
      <div className="flex items-center">
        <div className="relative w-5 h-5 xs:w-4 xs:h-4 mr-2 xs:mr-1">
          <Image
            src={team2.logoUrl || "/placeholder.svg?height=24&width=24"}
            alt={team2.name}
            fill
            className="object-contain"
          />
        </div>
        <p
          className={`${textColor} text-sm xs:text-xs max-w-[6rem] xs:max-w-[5rem] truncate`}
        >
          {team2.name}
        </p>
      </div>
    </div>
  );
}
