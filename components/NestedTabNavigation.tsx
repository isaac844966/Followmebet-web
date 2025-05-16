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

  return (
    <div className={`w-full ${containerStyle}`}>
      {/* Main Tabs */}
      <div className={`flex overflow-hidden ${tabStyle}`}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex-1 py-4 ${isActive ? "font-medium" : ""}`}
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
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub-Tabs */}
      {activeTabObj?.subTabs && activeTabObj.showSubTabs && (
        <div className={`flex overflow-hidden mt-2 ${subTabStyle}`}>
          {activeTabObj.subTabs.map((sub) => {
            const isActive = sub.key === activeSubTab;
            return (
              <button
                key={sub.key}
                onClick={() => onTabChange(activeTab, sub.key)}
                className="flex-1 py-4"
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
                    }`}
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
