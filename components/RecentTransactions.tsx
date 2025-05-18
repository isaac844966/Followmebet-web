"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import TransactionItem from "./TrasactionItem";
import { getTransaction } from "@/lib/services/walletService";
import LoadingSpinner from "./LoadingSpinner";

const RecentTransactions = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const handleRedeposit = (id: string) => {
    router.push("/deposit");
  };

  const handleShowMore = () => {
    router.push("/transactionHistory");
  };

  useEffect(() => {
    setLoading(true);
    fetchTransactions(true);
    setLoading(false);
  }, []);

  const fetchTransactions = async (isInitialFetch = false) => {
    try {
      if (isInitialFetch) {
        setLoading(true);
      }

      const res = await getTransaction();
      const items = res.data.items.slice(0, 2) || [];

      const mapped = items.map((item: any) => {
        return {
          id: item.id,
          date: item.transactionDate,
          time: item.time,
          amount: item.amount,
          type: item.transactionType === "DEBIT" ? "Withdrawal" : "Deposit",
          status: item.status?.toLowerCase() || "unknown",
        };
      });

      setTransactions(mapped);
    } catch (err) {
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  return (
    <div className={`${isDarkMode ? "white" : "#1E1F68"} mt-4 flex-1`}>
      <p
        className={`text-sm font-medium mb-2 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Most Recent
      </p>

      <div className="flex-1">
        {initialLoading ? (
          <LoadingSpinner
            variant="circular"
            size="lg"
            color={isDarkMode ? "text-[#FBB03B]" : "text-[#1E1F68]"}
          />
        ) : transactions.length === 0 ? (
          <div className="flex-1 items-center justify-center py-10 text-center">
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
              No transactions found
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              id={transaction.id}
              date={transaction.date}
              time={transaction.time}
              amount={transaction.amount}
              type={transaction.type}
              status={transaction.status}
              onRedeposit={
                transaction.type === "Deposit"
                  ? () => handleRedeposit(transaction.id)
                  : undefined
              }
            />
          ))
        )}
        <button
          onClick={handleShowMore}
          className="py-6 rounded-lg mt-2 items-center w-full text-center"
          style={{ backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF" }}
        >
          <span
            className={`font-medium ${
              isDarkMode ? "text-white" : "text-primary-1400"
            }`}
          >
            Show more
          </span>
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;
