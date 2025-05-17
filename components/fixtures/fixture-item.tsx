"use client";
import { format, parseISO } from "date-fns";
import type { FixtureItem as FixtureItemType } from "@/lib/services/fixtureService";
import { Button } from "@/components/ui/button";
import { LiveFixtureData } from "@/hooks/use-live-fixture-data";
import TeamDisplay from "./team-display";
import type { JSX } from "react/jsx-runtime";


interface TeamInfo {
  name: string;
  logoUrl?: string;
}

interface TeamDisplayProps {
  team1: TeamInfo;
  team2: TeamInfo;
  textColor: string;
}

interface SoccerFixtureItemProps {
  fixture: FixtureItemType;
  categoryId: string;
  isDarkMode: boolean;
  textColor: string;
  secondaryTextColor: string;
  liveFixtureData: Record<string, LiveFixtureData>;
  router: any;
}

const SoccerFixtureItem = ({
  fixture,
  categoryId,
  isDarkMode,
  textColor,
  secondaryTextColor,
  liveFixtureData,
  router,
}: SoccerFixtureItemProps): JSX.Element => {
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

  const handleCreateBet = (): void => {
    // Pass the entire fixture and category data as URL-encoded JSON
    const fixtureData = encodeURIComponent(JSON.stringify(fixture));
    router.push(
      `/create-bet/${fixture.id}?categoryId=${categoryId}&fixtureData=${fixtureData}`
    );
  };

  const handleViewCommentary = (): void => {
    if (!fixture.eventCode) return;

    router.push(
      `/commentry?eventCode=${fixture.eventCode}&team1Name=${encodeURIComponent(
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
          <Button
            className={`${
              isDarkMode ? "bg-[#0B0B3F]" : "bg-[#E8E8FF]"
            } px-4 py-4 rounded-lg hover:bg-opacity-90`}
            onClick={handleCreateBet}
          >
            <span
              className={`${isDarkMode ? "text-white" : "text-black"} text-xs`}
            >
              Create New Bet
            </span>
          </Button>
        </div>
      </div>
    );
  } else {
    // This is for soccer fixtures with betStatus "OFF" showing live data
    return (
      <div
        className={`${cardBackground} rounded-lg mb-1 overflow-hidden cursor-pointer`}
        onClick={handleViewCommentary}
      >
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
};

export default SoccerFixtureItem;
