"use client";

import Image from "next/image";
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

const TeamDisplay = ({
  team1,
  team2,
  textColor,
}: TeamDisplayProps): JSX.Element => (
  <div className="mb-1 mr-2">
    <div className="flex items-center mb-2">
      <div className="relative w-5 h-5 mr-2">
        <Image
          src={team1.logoUrl || "/placeholder.svg?height=24&width=24"}
          alt={`${team1.name} logo`}
          fill
          className="object-contain"
          sizes="20px"
        />
      </div>
      <p className={`${textColor} text-sm w-[8.5rem] truncate`}>{team1.name}</p>
    </div>
    <div className="flex items-center">
      <div className="relative w-5 h-5 mr-2">
        <Image
          src={team2.logoUrl || "/placeholder.svg?height=24&width=24"}
          alt={`${team2.name} logo`}
          fill
          className="object-contain"
          sizes="20px"
        />
      </div>
      <p className={`${textColor} text-sm w-[8.5rem] truncate`}>{team2.name}</p>
    </div>
  </div>
);

export default TeamDisplay;
