"use client";

import { useState } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import StatCardDisplay from "@/components/StatsCardDisplay";
import CustomButton from "@/components/CustomButton";

export default function BetStats() {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  // Mock data - would come from API later
  const statsData = {
    totalOverallBet: 50,
    totalWin: 30,
    totalLoss: 15,
    totalDraw: 5,
    totalPublicBet: 40,
    totalPrivateBet: 10,
  };

  const handleSaveChanges = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
    }, 1500);
  };

  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";

  // Custom card background colors for light mode
  const lightModeColors = {
    overall: "#E8E8FF",
    win: "#E9FFE8",
    loss: "#FDEFFF",
    draw: "#FFFBE8",
    public: "#F4F4F4",
    private: "#F4F4F4",
  };

  return (
    <div className={`${backgroundColor} min-h-screen py-6`}>
      <BackButton title="Bet Stats" />

      <div className="flex flex-col px-4 mt-6 relative pb-24">
        {/* First row - Overall Bet and Win */}
        <div className="flex gap-2 mb-2">
          <StatCardDisplay
            title="Total Overall Bet"
            value={statsData.totalOverallBet}
            backgroundColor={
              isDarkMode ? "bg-primary-1400" : lightModeColors.overall
            }
          />
          <StatCardDisplay
            title="Total Win"
            value={statsData.totalWin}
            valueColor="#00C927"
            backgroundColor={
              isDarkMode ? "bg-primary-1400" : lightModeColors.win
            }
          />
        </div>

        {/* Second row - Loss and Draw */}
        <div className="flex gap-2 mb-2">
          <StatCardDisplay
            title="Total Loss"
            value={statsData.totalLoss}
            valueColor="#FC0900"
            backgroundColor={
              isDarkMode ? "bg-primary-1400" : lightModeColors.loss
            }
          />
          <StatCardDisplay
            title="Total Draw"
            value={statsData.totalDraw}
            valueColor="#FBB03B"
            backgroundColor={
              isDarkMode ? "bg-primary-1400" : lightModeColors.draw
            }
          />
        </div>

        {/* Third row - Public Bet */}
        <StatCardDisplay
          title="Total Public Bet"
          value={statsData.totalPublicBet}
          fullWidth
          backgroundColor={
            isDarkMode ? "bg-primary-1400" : lightModeColors.public
          }
        />

        {/* Fourth row - Private Bet */}
        <StatCardDisplay
          title="Total Private Bet"
          value={statsData.totalPrivateBet}
          fullWidth
          backgroundColor={
            isDarkMode ? "bg-primary-1400" : lightModeColors.private
          }
        />

        {/* Visibility Toggle */}
        <div className="flex items-center mt-4 mb-6">
          <Switch
            id="visibility"
            checked={isVisible}
            onCheckedChange={setIsVisible}
          />
          <label
            htmlFor="visibility"
            className={`${
              isDarkMode ? "text-white" : "text-primary-100"
            } ml-3 cursor-pointer`}
          >
            Make my stat visible to opponents
          </label>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-8 left-4 right-4 mx-auto max-w-md">
         
          <CustomButton
            title="Save Changes"
            loading={loading}
            disabled={loading}
            onClick={handleSaveChanges}
            className="w-full"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}
