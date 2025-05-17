import { TeamStanding } from "@/hooks/use-standing";
import Image from "next/image";

interface StandingsTabProps {
  standings: TeamStanding[];
  loading: boolean;
  error: string | null;
  leagueName: string;
  categoryId: string;
  primaryBg: string;
  textColor: string;
  secondaryTextColor: string;
  team1Name?: string;
  team2Name?: string;
  isDarkMode: boolean;
}

export default function StandingsTab({
  standings,
  loading,
  error,
  leagueName,
  categoryId,
  primaryBg,
  textColor,
  secondaryTextColor,
  team1Name,
  team2Name,
  isDarkMode,
}: StandingsTabProps) {
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

    const activeBackground1 = isDarkMode ? "bg-[#3498db]" : "bg-[#85C1E9]";
    const activeBackground2 = isDarkMode ? "bg-[#e74c3c]" : "bg-[#F1948A]";
    let rowBgColor = "";

    if (isTeam1) {
      rowBgColor = activeBackground1;
    } else if (isTeam2) {
      rowBgColor = activeBackground2;
    }

    return (
      <div
        key={item.id?.toString() || item.name}
        className={`flex items-center py-3 border-b border-gray-600 ${rowBgColor}`}
      >
        <div className="w-10 items-center flex justify-center">
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
            className={`${
              isMatchTeam ? "font-bold" : "font-medium"
            } ${textColor} text-sm max-w-[10rem] truncate`}
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
    <div className="flex-1 px-4">
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="flex-1 flex justify-center items-center">
          <p className={textColor}>{error}</p>
        </div>
      ) : standings.length > 0 ? (
        <div className="flex-1">
          {/* League Header */}
          <div className={`${primaryBg} rounded-lg p-2 flex items-center`}>
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
          <div className="flex items-center py-3 mt-2 border-b border-gray-600">
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
          <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
            {standings.map((item, index) => renderTeamRow(item, index))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <p className={textColor}>
            {categoryId
              ? "No standings data available for this league"
              : "League information not available"}
          </p>
        </div>
      )}
    </div>
  );
}
