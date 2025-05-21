"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/services/authService";
import BackButton from "@/components/BackButton";
import UserProfileCard from "@/components/UserProfileCard";
import ActionItem from "@/components/ActionItem";
import {
  ImageIcon,
  UserCog,
  BanknoteIcon as Bank,
  Key,
  KeyRound,
  BarChart3,
  Palette,
  LogOut,
} from "lucide-react";

export default function SettingsPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const user = useAuthStore((state) => state.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
      router.refresh(); 
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };


  return (
    <div className={`${backgroundColor} min-h-screen`}>
      <BackButton title="Profile" />

      <div className="flex-1 px-4 pb-8 overflow-auto">
        <div className="mb-2 pt-2">
          {/* User Profile Card */}
          <UserProfileCard
            name={`${user?.firstname || ""} ${user?.lastname || ""}`}
            status="Legendary"
            avatarUrl={user?.avatarUrl || ""}
            showEditButton={false}
            showWelcomeText={false}
            bgColor={`${isDarkMode ? "bg-primary-1400" : "bg-primary-100"} p-8`}
          />
        </div>

        {/* Profile Actions */}
        <ActionItem
          title="Edit Profile Picture"
          icon={
            <ImageIcon
              size={20}
              className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
            />
          }
          onPress={() => router.push("/settings/edit-image")}
          containerStyle={{
            backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
            padding: "28px",
          }}
        />

        <ActionItem
          title="Edit Profile Details"
          icon={
            <UserCog
              size={20}
              className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
            />
          }
          onPress={() => router.push("/settings/edit-profile-details")}
          containerStyle={{
            backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
            padding: "28px",
          }}
        />

        <ActionItem
          title="My Banks"
          icon={
            <Bank
              size={20}
              className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
            />
          }
          onPress={() => router.push("/settings/my-bank")}
          containerStyle={{
            backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
            padding: "28px",
          }}
        />

        <ActionItem
          title="Change Password"
          icon={
            <Key
              size={20}
              className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
            />
          }
          onPress={() => router.push("/settings/change-password")}
          containerStyle={{
            backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
            padding: "28px",
          }}
        />

        {user?.isTransactionPinSet && (
          <ActionItem
            title="Change Pin"
            icon={
              <KeyRound
                size={20}
                className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
              />
            }
            onPress={() => router.push("/settings/pin-entry")}
            containerStyle={{
              backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
              padding: "28px",
            }}
          />
        )}

        <ActionItem
          title="View My Bet Statistics"
          icon={
            <BarChart3
              size={20}
              className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
            />
          }
          onPress={() => router.push("/settings/bet-stats")}
          containerStyle={{
            backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
            padding: "28px",
          }}
        />

        <ActionItem
          title="Theme"
          icon={
            <Palette
              size={20}
              className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
            />
          }
          onPress={() => router.push("/settings/theme-settings")}
          containerStyle={{
            backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
            padding: "28px",
          }}
        />

        <ActionItem
          title="Logout"
          icon={
            <LogOut
              size={20}
              className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
            />
          }
          onPress={handleLogout}
          containerStyle={{
            backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
            padding: "28px",
          }}
          loading={isLoggingOut}
        />
      </div>
    </div>
  );
}
