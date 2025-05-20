"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { DepositService } from "@/lib/services/walletService";
import BackButton from "@/components/BackButton";
import BalanceCard from "@/components/BalanceCard";
import AmountInput from "@/components/AmountInput";
import CustomButton from "@/components/CustomButton";

const Deposit = () => {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [amount, setAmount] = useState("100");

  const handleDepositPress = async () => {
    const numericAmount = Number.parseInt(amount.replace(/,/g, "") || "0");
    if (numericAmount < 100) {
      setAmount("100");
      return;
    }

    setIsLoading(true);
    try {
      const depositResponse = await DepositService({
        amount: numericAmount,
      });

      const authorizationUrl =
        depositResponse?.data?.checkout?.authorization_url;

      if (!authorizationUrl) {
        console.error("Authorization URL not available.");
        return;
      }

      router.push(
        `/payment-gateway?url=${encodeURIComponent(authorizationUrl)}`
      );
    } catch (error) {
      console.error("Deposit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex-1 min-h-screen ${backgroundColor}`}>
      <div className="pt-4 px-4 max-w-md mx-auto">
        <BackButton title="Deposit" onPress={() => router.push("/wallet")} />

        <div className="flex-1 pb-24">
          <BalanceCard />
          <p
            className={`${
              isDarkMode ? "text-white" : "text-primary-1400"
            } text-base mb-2 mt-4`}
          >
            Deposit Amount
          </p>

          <AmountInput amount={amount} setAmount={setAmount} minAmount={100} />

          <CustomButton
            title="Credit Wallet"
            size="lg"
            loading={isLoading}
            onClick={handleDepositPress}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Deposit;
