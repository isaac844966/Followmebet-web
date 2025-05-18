"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import BackButton from "@/components/BackButton";
import NestedTabNavigation, {
  type TabItem,
} from "@/components/NestedTabNavigation";

import TransactionFilter, {
  type FilterParams,
} from "@/components/TransactionFilter";
import { getTransaction } from "@/lib/services/walletService";
import EmptyState from "@/components/EmptyState";
import TransactionItem, {
  TransactionItemProps,
} from "@/components/TrasactionItem";
import LoadingSpinner from "@/components/LoadingSpinner";

type Tab = "Deposit" | "Withdrawal";
const LIMIT = 20;

const TransactionHistory = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const backgroundColor = isDarkMode ? "#0B0B3F" : "#FFFFFF";

  // Define tabs for the navigation
  const tabs: TabItem[] = [
    { key: "Deposit", label: "Deposit" },
    { key: "Withdrawal", label: "Withdrawal" },
  ];

  const [activeTab, setActiveTab] = useState<Tab>("Deposit");
  const [depositItems, setDepositItems] = useState<TransactionItemProps[]>([]);
  const [withdrawItems, setWithdrawItems] = useState<TransactionItemProps[]>(
    []
  );
  const [depositOffset, setDepositOffset] = useState(0);
  const [withdrawOffset, setWithdrawOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMoreDeposit, setHasMoreDeposit] = useState(true);
  const [hasMoreWithdraw, setHasMoreWithdraw] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<FilterParams>({});

  // track if first fetch happened (avoid double-fetch in StrictMode)
  const depositFetched = useRef(false);
  const withdrawFetched = useRef(false);
  // Reference for the scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Reference to track if we're currently loading data
  const isLoadingRef = useRef(false);

  const handleRedeposit = (id: string) => {
    router.push(`/deposit?transactionId=${id}`);
  };

  const mapTransactions = (raw: any[]): TransactionItemProps[] =>
    raw.map((item) => {
      const [date, time] = item.transactionDate
        ? item.transactionDate.split(" ")
        : ["", ""];
      return {
        id: item.id,
        date,
        time,
        amount: item.amount,
        type: item.transactionType === "DEBIT" ? "Withdrawal" : "Deposit",
        status: item.status?.toLowerCase() || "unknown",
        bankAccountNumber: item.bank?.accountNumber || null,
        onRedeposit:
          item.transactionType !== "DEBIT"
            ? () => handleRedeposit(item.id)
            : undefined,
      };
    });

  const fetchPage = useCallback(
    async (tab: Tab, reset = false) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setLoading(true);

      try {
        const offset = reset
          ? 0
          : tab === "Deposit"
          ? depositOffset
          : withdrawOffset;

        const params: any = {
          offset,
          limit: LIMIT,
          ...appliedFilters,
        };

        const res = await getTransaction(params);

        // Filter by transaction type
        const mapped = mapTransactions(res.data.items);
        const filtered = mapped.filter((tx) => tx.type === tab);

        if (tab === "Deposit") {
          if (reset) {
            setDepositItems(filtered);
            setDepositOffset(LIMIT);
          } else {
            setDepositItems((prev) => {
              const unique = filtered.filter(
                (tx) => !prev.some((p) => p.id === tx.id)
              );
              return [...prev, ...unique];
            });
            setDepositOffset((prev) => prev + LIMIT);
          }
          setHasMoreDeposit(res.data.items.length >= LIMIT);
        } else {
          if (reset) {
            setWithdrawItems(filtered);
            setWithdrawOffset(LIMIT);
          } else {
            setWithdrawItems((prev) => {
              const unique = filtered.filter(
                (tx) => !prev.some((p) => p.id === tx.id)
              );
              return [...prev, ...unique];
            });
            setWithdrawOffset((prev) => prev + LIMIT);
          }
          setHasMoreWithdraw(res.data.items.length >= LIMIT);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [depositOffset, withdrawOffset, appliedFilters]
  );

  // Handle filter application
  const handleFiltersApplied = (filters: FilterParams) => {
    setAppliedFilters(filters);
    depositFetched.current = false;
    withdrawFetched.current = false;

    // Add a small delay to ensure state is updated
    setTimeout(() => {
      fetchPage(activeTab, true);
    }, 100);
  };

  // Handle tab change
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };

  // On mount or tab switch – load first page once per tab
  useEffect(() => {
    if (activeTab === "Deposit" && !depositFetched.current) {
      fetchPage("Deposit");
      depositFetched.current = true;
    }
    if (activeTab === "Withdrawal" && !withdrawFetched.current) {
      fetchPage("Withdrawal");
      withdrawFetched.current = true;
    }
  }, [activeTab, fetchPage]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || isLoadingRef.current) return;

      const { scrollTop, clientHeight, scrollHeight } =
        scrollContainerRef.current;
      const hasReachedBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px before bottom

      if (hasReachedBottom) {
        if (activeTab === "Deposit" && hasMoreDeposit) {
          fetchPage("Deposit");
        } else if (activeTab === "Withdrawal" && hasMoreWithdraw) {
          fetchPage("Withdrawal");
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [activeTab, fetchPage, hasMoreDeposit, hasMoreWithdraw]);

  const currentItems = activeTab === "Deposit" ? depositItems : withdrawItems;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor }}>
      {/* Fixed header section */}
      <div
        className="fixed top-0 left-0 right-0 z-10"
        style={{ backgroundColor }}
      >
        <BackButton
          title="Transaction History"
          onPress={() => router.push("/wallet")}
          rightIcon={
            <TransactionFilter onFiltersApplied={handleFiltersApplied} />
          }
        />

        {/* Fixed tabs */}
        <NestedTabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Scrollable content area with padding for the fixed header */}
      <div
        ref={scrollContainerRef}
        className="flex-1 px-2 overflow-y-auto mt-20"
        style={{ paddingTop: "110px" }} // Adjust based on the actual header height
      >
        {loading && currentItems.length === 0 ? (
          <div className="mt-36">
            <LoadingSpinner
              variant="circular"
              size="lg"
              color={isDarkMode ? "text-[#FBB03B]" : "text-[#1E1F68]"}
            />
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <EmptyState
              type="transaction"
              isDarkMode={isDarkMode}
              textColor={isDarkMode ? "text-gray-300" : "text-gray-500"}
              message={`No ${activeTab.toLowerCase()} transactions found`}
              subMessage="Your transaction history will appear here"
            />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {currentItems.map((item) => (
                <TransactionItem key={item.id} {...item} />
              ))}
            </div>

            {/* Loading indicator at the bottom for infinite scroll */}
            {loading && (
              <LoadingSpinner
                variant="circular"
                size="md"
                color={isDarkMode ? "text-[#FBB03B]" : "text-[#1E1F68]"}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
