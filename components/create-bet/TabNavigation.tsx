"use client";

import { useTheme } from "@/lib/contexts/ThemeContext";
import type React from "react";

interface TabNavigationProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";

  return (
    <div className={`flex pt-2 border-b border-gray-300 ${backgroundColor}`}>
      {["Place bet", "Open challenges", "Standings"].map((tab, index) => (
        <button
          key={index}
          onClick={() => onTabChange(index)}
          className="flex-1 focus:outline-none"
        >
          <div className="py-4 xs:py-3 text-center">
            <span
              className={`${
                activeTab === index
                  ? "text-yellow-500 font-bold"
                  : "text-gray-500"
              } xs:text-sm`}
            >
              {tab}
            </span>
          </div>
          <div
            className={`h-0.5 ${
              activeTab === index ? "bg-yellow-500" : "bg-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
