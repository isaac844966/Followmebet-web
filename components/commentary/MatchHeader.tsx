import Image from "next/image";

interface MatchHeaderProps {
  team1: string;
  team2: string;
  team1Logo: string;
  team2Logo: string;
  homeScore: string;
  awayScore: string;
  matchStatus: string;
  matchMinute: string;
  primaryBg: string;
  textColor: string;
  isDarkMode: boolean;
}

export default function MatchHeader({
  team1,
  team2,
  team1Logo,
  team2Logo,
  homeScore,
  awayScore,
  matchStatus,
  matchMinute,
  primaryBg,
  textColor,
  isDarkMode,
}: MatchHeaderProps) {
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-500";

  return (
    <div className={`flex items-center justify-center py-6 mt-2 ${primaryBg}`}>
      <div className="flex justify-between items-center w-full px-10 gap-4">
        <div className="flex flex-col items-center flex-1">
          <div className="relative w-12 h-12 mb-2">
            <Image
              src={team1Logo || "/placeholder.svg?height=50&width=50"}
              alt={team1}
              fill
              className="object-contain"
            />
          </div>
          <p className={`${textColor} text-center font-medium`}>{team1}</p>
        </div>

        <div className="flex flex-col items-center mx-4">
          <p className={`${textColor} text-2xl font-bold`}>
            {homeScore} - {awayScore}
          </p>
          {matchStatus === "HT" ? (
            <p className="text-[#FFA726] text-lg mt-1">HT</p>
          ) : matchStatus === "FT" ? (
            <p className={`${secondaryTextColor} text-lg mt-1`}>FT</p>
          ) : matchStatus === "PST" ? (
            <p className={`${secondaryTextColor} text-lg mt-1`}>PST</p>
          ) : matchStatus === "CANC" ? (
            <p className={`${secondaryTextColor} text-lg mt-1`}>CANC</p>
          ) : matchMinute ? (
            <p className="text-[#FFA726] text-lg mt-1">{matchMinute}'</p>
          ) : null}
        </div>

        <div className="flex flex-col items-center flex-1">
          <div className="relative w-12 h-12 mb-2">
            <Image
              src={team2Logo || "/placeholder.svg?height=50&width=50"}
              alt={team2}
              fill
              className="object-contain"
            />
          </div>
          <p className={`${textColor} text-center font-medium`}>{team2}</p>
        </div>
      </div>
    </div>
  );
}
