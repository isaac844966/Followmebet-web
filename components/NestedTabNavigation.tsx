"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  subTabs?: TabItem[];
  showSubTabs?: boolean;
}

interface Props {
  tabs: TabItem[];
  activeTab: string;
  activeSubTab?: string;
  onTabChange: (tabKey: string, subTabKey?: string) => void;
  containerStyle?: string;
  tabStyle?: string;
  subTabStyle?: string;
  iconPosition?: "left" | "top";
}

const NestedTabNavigation: React.FC<Props> = ({
  tabs,
  activeTab,
  activeSubTab,
  onTabChange,
  containerStyle = "",
  tabStyle = "",
  subTabStyle = "",
  iconPosition = "left",
}) => {
  const { isDarkMode } = useTheme();

  const activeTabObj = tabs.find((t) => t.key === activeTab);

  const tabActiveBg = isDarkMode ? "#272785" : "#E8E8FF";
  const tabInactiveBg = isDarkMode ? "#1A1942" : "#F4F4F4";
  const subTabActiveBg = isDarkMode ? "#272785" : "#E8E8FF";
  const subTabInactiveBg = isDarkMode ? "#1A1942" : "#F0F0F0";
  const backgroundColor = isDarkMode ? "bg-[#1E1F68]" : "bg-[#F4F4F4]";
  const subBackground = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";

  return (
    <div className={`w-full ${containerStyle}`}>
      {/* Main Tabs */}
      <div className={`${subBackground} h-3 xs:h-2`}></div>

      <div className={`flex overflow-hidden ${tabStyle}`}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex-1 py-4 xs:py-3 ${isActive ? "font-medium" : ""}`}
              style={{
                backgroundColor: isActive ? tabActiveBg : tabInactiveBg,
              }}
            >
              <div
                className={`items-center ${
                  iconPosition === "left"
                    ? "flex flex-row justify-center"
                    : "flex flex-col justify-center"
                }`}
              >
                {tab.icon && (
                  <div className={iconPosition === "top" ? "mb-1" : "mr-2"}>
                    {tab.icon}
                  </div>
                )}
                <span
                  className={`${
                    isActive
                      ? isDarkMode
                        ? "text-white"
                        : "text-gray-800"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  } xs:text-sm`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <div className={`${subBackground} h-3 xs:h-2`}></div>
      {/* Sub-Tabs */}
      {activeTabObj?.subTabs && activeTabObj.showSubTabs && (
        <div className={`flex overflow-hidden ${subTabStyle}`}>
          {activeTabObj.subTabs.map((sub) => {
            const isActive = sub.key === activeSubTab;
            return (
              <button
                key={sub.key}
                onClick={() => onTabChange(activeTab, sub.key)}
                className="flex-1 py-4 xs:py-3"
                style={{
                  backgroundColor: isActive ? subTabActiveBg : subTabInactiveBg,
                }}
              >
                <div
                  className={`items-center ${
                    iconPosition === "left"
                      ? "flex flex-row justify-center"
                      : "flex flex-col justify-center"
                  }`}
                >
                  {sub.icon && (
                    <div className={iconPosition === "top" ? "mb-1" : "mr-2"}>
                      {sub.icon}
                    </div>
                  )}
                  <span
                    className={`font-medium ${
                      isActive
                        ? isDarkMode
                          ? "text-white"
                          : "text-gray-800"
                        : isDarkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    } xs:text-sm`}
                  >
                    {sub.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NestedTabNavigation;
