"use client";

import { useState } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import { RefreshCw } from "lucide-react";

const BalanceCard = () => {
  const { isDarkMode } = useTheme();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isLoading || isRefreshing) return;

    setIsRefreshing(true);

    try {
      // You can place real balance-fetching logic here
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div
      className={`p-8 rounded-lg mb-4 mt-6 ${
        isDarkMode ? "bg-primary-1400" : "bg-primary-1200"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-primary-1400"
            }`}
          >
            {isLoading || isRefreshing ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              `₦${
                user?.balance?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                }) || "0.00"
              }`
            )}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Wallet Balance
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className={`${isRefreshing ? "animate-spin" : ""}`}
        >
          <RefreshCw size={20} color={isDarkMode ? "white" : "#1E1F68"} />
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
