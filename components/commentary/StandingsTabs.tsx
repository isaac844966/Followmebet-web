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
        className={`flex items-center py-3 xs:py-2 border-b border-gray-600 ${rowBgColor}`}
      >
        <div className="w-10 xs:w-8 items-center flex justify-center">
          <div
            className={`${rankColor} w-6 h-6 xs:w-5 xs:h-5 rounded-full flex items-center justify-center`}
          >
            <span
              className={`font-bold xs:text-xs ${
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

        <div className="flex items-center flex-1 ml-2 xs:ml-1">
          {item.logo ? (
            <div className="relative w-6 h-6 xs:w-5 xs:h-5 mr-2 xs:mr-1">
              <Image
                src={item.logo || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-6 h-6 xs:w-5 xs:h-5 mr-2 xs:mr-1" />
          )}
          <span
            className={`${
              isMatchTeam ? "font-bold" : "font-medium"
            } ${textColor} text-sm xs:text-xs max-w-[10rem] xs:max-w-[7rem] truncate`}
          >
            {item.name}
          </span>
        </div>

        <div className="w-10 xs:w-8 flex justify-center">
          <span className={`${secondaryTextColor} xs:text-xs`}>
            {item.played}
          </span>
        </div>

        <div className="w-14 xs:w-10 flex justify-center">
          <span className={`${secondaryTextColor} xs:text-xs`}>
            {item.goalsDiff > 0 ? `+${item.goalsDiff}` : item.goalsDiff}
          </span>
        </div>

        <div className="w-10 xs:w-8 flex justify-center">
          <span className={`${textColor} font-bold xs:text-xs`}>
            {item.points}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 px-4 xs:px-2">
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin h-8 w-8 xs:h-6 xs:w-6 border-4 xs:border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="flex-1 flex justify-center items-center">
          <p className={`${textColor} xs:text-sm`}>{error}</p>
        </div>
      ) : standings.length > 0 ? (
        <div className="flex-1">
          {/* League Header */}
          <div className={`${primaryBg} rounded-lg p-2 flex items-center`}>
            {categoryId && (
              <div className="relative w-8 h-8 xs:w-6 xs:h-6 mr-3 xs:mr-2">
                <Image
                  src={`https://media.api-sports.io/football/leagues/${categoryId}.png`}
                  alt={leagueName}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <p className={`${textColor} text-lg xs:text-base font-bold`}>
              {leagueName || "League Standings"}
            </p>
          </div>

          {/* Table Header */}
          <div className="flex items-center py-3 xs:py-2 mt-2 border-b border-gray-600">
            <div className="w-10 xs:w-8 flex justify-center">
              <span className={`${secondaryTextColor} xs:text-xs`}>#</span>
            </div>
            <div className="flex-1 ml-2 xs:ml-1">
              <span className={`${secondaryTextColor} xs:text-xs`}>Team</span>
            </div>
            <div className="w-10 xs:w-8 flex justify-center">
              <span className={`${secondaryTextColor} xs:text-xs`}>P</span>
            </div>
            <div className="w-14 xs:w-10 flex justify-center">
              <span className={`${secondaryTextColor} xs:text-xs`}>DIFF</span>
            </div>
            <div className="w-10 xs:w-8 flex justify-center">
              <span className={`${secondaryTextColor} xs:text-xs`}>PTS</span>
            </div>
          </div>

          {/* Team Rows */}
          <div className="overflow-y-auto max-h-[calc(100vh-300px)] xs:max-h-[calc(100vh-250px)]">
            {standings.map((item, index) => renderTeamRow(item, index))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <p className={`${textColor} xs:text-sm text-center px-4`}>
            {categoryId
              ? "No standings data available for this league"
              : "League information not available"}
          </p>
        </div>
      )}
    </div>
  );
}
