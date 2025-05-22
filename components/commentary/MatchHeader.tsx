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
  category: string;
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
  category
}: MatchHeaderProps) {
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-500";

  return (
    <div className={` py-6 ${primaryBg}`}>
      <h2 className="text-md xs:text-sm mb-2 font-medium text-center">
        {category}
      </h2>
      <div className="flex justify-between items-center w-full px-10 xs:px-6 gap-4 xs:gap-2">
        <div className="flex flex-col items-center flex-1">
          <div className="relative w-12 h-12  mb-2 xs:mb-1">
            <Image
              src={team1Logo || "/placeholder.svg?height=50&width=50"}
              alt={team1}
              fill
              className="object-contain"
            />
          </div>
          <p
            className={`${textColor}  text-center font-medium max-w-[120px] xs:max-w-[90px] xs:text-xs truncate`}
          >
            {team1}
          </p>
        </div>

        <div className="flex flex-col items-center mx-4 xs:mx-2">
          <p className={`${textColor} text-2xl xs:text-xl font-bold`}>
            {homeScore} - {awayScore}
          </p>
          {matchStatus === "HT" ? (
            <p className="text-[#FFA726] text-lg xs:text-base mt-1 xs:mt-0.5">
              HT
            </p>
          ) : matchStatus === "FT" ? (
            <p
              className={`${secondaryTextColor} text-lg xs:text-base mt-1 xs:mt-0.5`}
            >
              FT
            </p>
          ) : matchStatus === "PST" ? (
            <p
              className={`${secondaryTextColor} text-lg xs:text-base mt-1 xs:mt-0.5`}
            >
              PST
            </p>
          ) : matchStatus === "CANC" ? (
            <p
              className={`${secondaryTextColor} text-lg xs:text-base mt-1 xs:mt-0.5`}
            >
              CANC
            </p>
          ) : matchMinute ? (
            <p className="text-[#FFA726] text-lg xs:text-base mt-1 xs:mt-0.5">
              {matchMinute}'
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-center flex-1">
          <div className="relative w-12 h-12  mb-2 xs:mb-1">
            <Image
              src={team2Logo || "/placeholder.svg?height=50&width=50"}
              alt={team2}
              fill
              className="object-contain"
            />
          </div>
          <p
            className={`${textColor} text-center font-medium xs:text-sm max-w-[120px] `}
          >
            {team2}
          </p>
        </div>
      </div>
    </div>
  );
}
