"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";

// Define the type for the owner prop
interface BetOwner {
  id?: string;
  firstname?: string;
  lastname?: string;
  nickname?: string;
  avatarUrl?: string;
}

interface StakerCardProps {
  owner: BetOwner | undefined;
}

export const StakerCard: React.FC<StakerCardProps> = ({ owner }) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuthStore();
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const primaryBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  const isOwner = user?.id === owner?.id;

  return (
    <div className={`${primaryBg} rounded-xl p-4 xs:p-3 mb-2`}>
      <p
        className={`${secondaryTextColor} uppercase text-xs xs:text-[10px] mb-2 xs:mb-1`}
      >
        STAKER
      </p>
      <div className="flex items-center">
        <div className="relative w-10 h-10 xs:w-8 xs:h-8 rounded-full overflow-hidden bg-primary-400">
          <Image
            src={owner?.avatarUrl || "/placeholder.svg?height=40&width=40"}
            alt="Staker avatar"
            fill
            className="object-cover"
          />
        </div>
        <div className="ml-3 xs:ml-2">
          <p className={`${textColor} font-medium xs:text-sm`}>
            {isOwner ? "Me" : owner?.nickname || owner?.lastname || "Unknown"}
          </p>
          <div className="flex items-center">
            <div className="w-3 h-3 xs:w-2 xs:h-2 rounded-full bg-yellow-500 mr-1"></div>
            <p className={`${secondaryTextColor} text-xs xs:text-[10px]`}>
              LEGENDARY
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
