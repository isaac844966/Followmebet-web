import type React from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { TeamStanding } from "@/hooks/use-standing";

interface StandingsTabProps {
  standings: TeamStanding[];
  loading: boolean;
  error: string | null;
  leagueName: string;
  categoryId: string;
  isDarkMode: boolean;
  textColor: string;
  secondaryTextColor: string;
  team1Name?: string;
  team2Name?: string;
}

const StandingsTab: React.FC<StandingsTabProps> = ({
  standings,
  loading,
  error,
  leagueName,
  categoryId,
  isDarkMode,
  textColor,
  secondaryTextColor,
  team1Name,
  team2Name,
}) => {
  const cardBackground = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  // Render a team row in the standings table
  const renderTeamRow = (item: TeamStanding, index: number) => {
    // Determine rank color based on position
    const rankColor =
      index < 5
        ? "bg-green-600"
        : index < 7
        ? "bg-blue-500"
        : index < 17
        ? `${isDarkMode ? "text-white" : "text-black"}`
        : "bg-red-500";

    // Check if this team is one of the teams in the current match
    const isTeam1 =
      team1Name && item.name.toLowerCase().includes(team1Name.toLowerCase());
    const isTeam2 =
      team2Name && item.name.toLowerCase().includes(team2Name.toLowerCase());
    const isMatchTeam = isTeam1 || isTeam2;

    let rowBgColor = "";
    if (isTeam1) {
      rowBgColor = isDarkMode ? "bg-[#3498db]" : "bg-[#85C1E9]";
    } else if (isTeam2) {
      rowBgColor = isDarkMode ? "bg-[#e74c3c]" : "bg-[#F1948A]";
    }

    return (
      <div
        key={item.id || item.name}
        className={`flex items-center py-3 border-b-[0.3px] border-gray-600 ${rowBgColor}`}
      >
        <div className="w-10 flex justify-center">
          <div
            className={`${rankColor} w-6 h-6 rounded-full flex items-center justify-center`}
          >
            <span
              className={`font-bold ${
                isDarkMode
                  ? "text-white"
                  : index < 7
                  ? "text-white"
                  : index < 17
                  ? "text-black"
                  : "text-white"
              }`}
            >
              {item.rank}
            </span>
          </div>
        </div>

        <div className="flex items-center flex-1 ml-2">
          {item.logo ? (
            <div className="relative w-6 h-6 mr-2">
              <Image
                src={item.logo || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-6 h-6 mr-2" />
          )}
          <span
            className={`${textColor} ${
              isMatchTeam ? "font-bold" : "font-medium"
            } max-w-[10rem] text-sm`}
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {item.name}
          </span>
        </div>

        <div className="w-10 flex justify-center">
          <span className={secondaryTextColor}>{item.played}</span>
        </div>

        <div className="w-14 flex justify-center">
          <span className={secondaryTextColor}>
            {item.goalsDiff > 0 ? `+${item.goalsDiff}` : item.goalsDiff}
          </span>
        </div>

        <div className="w-10 flex justify-center">
          <span className={`${textColor} font-bold`}>{item.points}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 px-4 overflow-auto">
      {loading ? (
        <div className="flex-1 flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="flex-1 flex justify-center items-center py-20">
          <p className={textColor}>{error}</p>
        </div>
      ) : standings.length > 0 ? (
        <div className="flex-1">
          {/* League Header */}
          <div
            className={`${cardBackground} rounded-lg mt-4 p-3 flex items-center`}
          >
            {categoryId && (
              <div className="relative w-8 h-8 mr-3">
                <Image
                  src={`https://media.api-sports.io/football/leagues/${categoryId}.png`}
                  alt={leagueName}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <p className={`${textColor} text-lg font-bold`}>
              {leagueName || "League Standings"}
            </p>
          </div>

          {/* Table Header */}
          <div className="flex items-center py-3 border-b-[0.3px] border-gray-600">
            <div className="w-10 flex justify-center">
              <span className={secondaryTextColor}>#</span>
            </div>
            <div className="flex-1 ml-2">
              <span className={secondaryTextColor}>Team</span>
            </div>
            <div className="w-10 flex justify-center">
              <span className={secondaryTextColor}>P</span>
            </div>
            <div className="w-14 flex justify-center">
              <span className={secondaryTextColor}>DIFF</span>
            </div>
            <div className="w-10 flex justify-center">
              <span className={secondaryTextColor}>PTS</span>
            </div>
          </div>

          {/* Team Rows */}
          <div className="overflow-auto max-h-[calc(100vh-300px)]">
            {standings.map(renderTeamRow)}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center py-20">
          <p className={textColor}>
            {categoryId
              ? "No standings data available for this league"
              : "League information not available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default StandingsTab;
