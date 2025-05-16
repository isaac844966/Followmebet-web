"use client";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { WalletIcon } from "lucide-react";
import WalletHeader from "@/components/WalletHeader";
import BalanceCard from "@/components/BalanceCard";
import ActionItem from "@/components/ActionItem";
import RecentTransactions from "@/components/RecentTransactions";

const Wallet = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const backgroundColor = isDarkMode ? "#1E1F68" : "#ffffff";
  const iconColor = isDarkMode ? "#FBB03B" : "#1E1F68";

  const handleDeposit = () => {
    router.push("/deposit");
  };

  const handleWithdraw = () => {
    router.push("/withdrawal");
  };

  return (
    <div className="flex-1 min-h-screen" style={{ backgroundColor }}>
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <WalletHeader
          title="wallet"
          icon={<WalletIcon size={24} color={iconColor} />}
        />
      </div>

      {/* Add padding to account for fixed header height */}
      <div className="pt-32">
        <div
          className={`${
            isDarkMode ? "bg-primary-1300" : "bg-white"
          } px-4 pt-2 pb-20`}
        >
          <BalanceCard />

          <ActionItem
            title="Deposit"
            onPress={handleDeposit}
            containerStyle={{
              backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
              padding: 22,
              marginBottom: 5,
            }}
          />

          <ActionItem
            title="Withdraw"
            onPress={handleWithdraw}
            containerStyle={{
              backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
              padding: 22,
            }}
          />

          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Wallet;
