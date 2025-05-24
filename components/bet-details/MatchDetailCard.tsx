import type React from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";

type Team = {
  name?: string;
  logoUrl?: string;
};

type Fixture = {
  date?: string;
  time?: string;
  category?: string;
  item1?: Team;
  item2?: Team;
};

type MatchDetailsCardProps = {
  fixture: Fixture;
  isDarkMode: boolean;
};

const MatchDetailsCard: React.FC<MatchDetailsCardProps> = ({
  fixture,
  isDarkMode,
}) => {
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const primaryBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  const matchDate = fixture?.date
    ? format(parseISO(fixture?.date), "dd-MM-yyyy")
    : "";
  const matchTime = fixture?.time
    ? format(parseISO(fixture?.time), "HH:mm:ss")
    : "";

  return (
    <div className={`${primaryBg} p-4 xs:p-3 `}>
      <p
        className={`${textColor} text-md xs:text-sm mb-2 font-medium text-center`}
      >
        {fixture?.category || "League Match"}
      </p>
      <p className={`${secondaryTextColor} text-md xs:text-xs text-center`}>
        {matchDate}
      </p>

      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col items-center flex-1">
          <div className="relative w-[50px] h-[50px] xs:w-[40px] xs:h-[40px] mb-2 xs:mb-1">
            <Image
              src={
                fixture?.item1?.logoUrl || "/placeholder.svg?height=60&width=60"
              }
              alt={fixture?.item1?.name || "Team 1"}
              fill
              className="object-contain"
            />
          </div>
          <p
            className={`${textColor}  text-center font-medium max-w-[120px] xs:max-w-[90px] xs:text-xs line-clamp-2`}
          >
            {fixture?.item1?.name || "Team 1"}
          </p>
        </div>

        <div className="flex flex-col items-center mx-4 xs:mx-2">
          <p className={`${textColor} text-lg xs:text-base font-bold`}>Vs</p>
          <p className={`${secondaryTextColor} text-md xs:text-xs mt-1`}>
            {matchTime}
          </p>
        </div>

        <div className="flex flex-col items-center flex-1">
          <div className="relative w-[50px] h-[50px] xs:w-[40px] xs:h-[40px] mb-2 xs:mb-1">
            <Image
              src={
                fixture?.item2?.logoUrl || "/placeholder.svg?height=60&width=60"
              }
              alt={fixture?.item2?.name || "Team 2"}
              fill
              className="object-contain"
            />
          </div>
          <p
            className={`${textColor}  text-center font-medium max-w-[120px] xs:max-w-[90px] xs:text-xs line-clamp-2`}
          >
            {fixture?.item2?.name || "Team 2"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsCard;
