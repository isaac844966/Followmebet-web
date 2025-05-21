"use client";

import type React from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import Link from "next/link";
import { Home, TrendingUp, PlusCircle, ListChecks, Wallet } from "lucide-react";

interface TabIconProps {
  focused: boolean;
  icon: React.ReactNode;
  title: string;
}

const TabIcon = ({ focused, icon, title }: TabIconProps) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-col items-center w-full">
      {icon}
      <span
        className={`${
          focused
            ? "text-primary-400 font-medium"
            : isDarkMode
            ? "text-gray-400 font-normal"
            : "text-primary-600 font-normal"
        } mt-1 text-xs xs:text-[10px] text-center`}
      >
        {title}
      </span>
    </div>
  );
};

interface TabsNavigationProps {
  currentPath: string;
}

const TabsNavigation = ({ currentPath }: TabsNavigationProps) => {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "#0B0B3F" : "#fff";

  const iconColor = (focused: boolean) =>
    focused ? "#FFA726" : isDarkMode ? "#FFFFFF" : "#000";

  const tabs = [
    {
      name: "Home",
      path: "/dashboard",
      icon: (focused: boolean) => (
        <Home size={22} color={iconColor(focused)} className="xs:w-6 xs:h-6" />
      ),
    },
    {
      name: "Bet Market",
      path: "/bet-market",
      icon: (focused: boolean) => (
        <TrendingUp
          size={22}
          color={iconColor(focused)}
          className="xs:w-6 xs:h-6"
        />
      ),
    },
    {
      name: "Create A Bet",
      path: "/fixtures",
      icon: (focused: boolean) => (
        <PlusCircle
          size={22}
          color={iconColor(focused)}
          className="xs:w-6 xs:h-6"
        />
      ),
    },
    {
      name: "My Bets",
      path: "/my-bets",
      icon: (focused: boolean) => (
        <ListChecks
          size={22}
          color={iconColor(focused)}
          className="xs:w-6 xs:h-6"
        />
      ),
    },
    {
      name: "Wallet",
      path: "/wallet",
      icon: (focused: boolean) => (
        <Wallet
          size={22}
          color={iconColor(focused)}
          className="xs:w-6 xs:h-6"
        />
      ),
    },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 border-t flex justify-between items-center px-2 xs:px-1 py-3 xs:py-2 z-10"
      style={{
        backgroundColor,
        borderTopColor: isDarkMode ? "#2A2463" : "#E5E7EB",
        minHeight: "70px",
      }}
    >
      {tabs.map((tab) => {
        const isActive =
          (tab.path === "/dashboard" && currentPath === "/dashboard") ||
          (tab.path !== "/dashboard" && currentPath.startsWith(tab.path));

        return (
          <Link
            key={tab.path}
            href={tab.path}
            className="flex-1 flex justify-center"
          >
            <TabIcon
              icon={tab.icon(isActive)}
              focused={isActive}
              title={tab.name}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default TabsNavigation;
