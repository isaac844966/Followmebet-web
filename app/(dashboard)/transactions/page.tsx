"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { format } from "date-fns";
import BackButton from "@/components/BackButton";
import EmptyState from "@/components/EmptyState";
import TransactionFilterModal from "@/components/TransactionFilterModal";
import { ChevronDown, ChevronRight, Filter } from "lucide-react";
import {
  getWalletsTransactions,
  TransactionType,
} from "@/lib/services/walletTansactions";

interface Transaction {
  id: string;
  amount: string;
  transactionType: string;
  balance: string;
  type: string;
  transDate: string;
  description: string;
  reference?: string;
}

interface TransactionListParams {
  offset?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  type?: string;
}

const TransactionsPage = () => {
  const { isDarkMode } = useTheme();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState<{
    fromDate: Date | null;
    toDate: Date | null;
  }>({
    fromDate: null,
    toDate: null,
  });

  // Ref for the sentinel element (used for intersection observer)
  const observerRef = useRef<HTMLDivElement | null>(null);
  // Ref to track if a fetch is in progress
  const isFetchingRef = useRef(false);

  const backgroundColor = isDarkMode ? "#0B0B3F" : "#F5F5F5";
  const cardBgColor = isDarkMode ? "#1E1F68" : "#FFFFFF";
  const textColor = isDarkMode ? "#FFFFFF" : "#000000";
  const secondaryTextColor = isDarkMode ? "#A0A3BD" : "#6E7191";
  const borderColor = isDarkMode ? "#2D2F8E" : "#EEEEEE";
  const positiveColor = "#4CAF50";
  const negativeColor = "#FF4D4F";

  const formatAmount = (amount: string) => {
    const numAmount = Number.parseFloat(amount);
    const formattedAmount = numAmount >= 0 ? `+${amount}` : amount;
    const color = numAmount >= 0 ? positiveColor : negativeColor;
    return { formattedAmount, color };
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd-MM-yy HH:mm:ss");
    } catch (error) {
      return dateString;
    }
  };

  const fetchTransactions = useCallback(
    async (params: TransactionListParams = {}) => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      try {
        const { offset = 0, limit = 20, fromDate, toDate, type } = params;

        const response = await getWalletsTransactions({
          offset,
          limit,
          fromDate,
          toDate,
          type: type as TransactionType,
        });

        if (response.data && response.data.items) {
          const newTransactions = response.data.items;

          if (offset === 0) {
            setTransactions(newTransactions);
          } else {
            setTransactions((prev) => [...prev, ...newTransactions]);
          }

          setHasMore(newTransactions.length === limit);
          setOffset(offset + newTransactions.length);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    []
  );

  // Handle intersection observer for infinite scroll
  useEffect(() => {
    const currentObserverRef = observerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          hasMore &&
          !loadingMore &&
          !loading &&
          !refreshing
        ) {
          setLoadingMore(true);
          fetchTransactions({
            offset,
            fromDate: filters.fromDate
              ? format(filters.fromDate, "yyyy-MM-dd")
              : undefined,
            toDate: filters.toDate
              ? format(filters.toDate, "yyyy-MM-dd")
              : undefined,
          });
        }
      },
      { threshold: 0.1 }
    );

    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [
    hasMore,
    offset,
    filters,
    fetchTransactions,
    loadingMore,
    loading,
    refreshing,
  ]);

  // Initial load
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setOffset(0);
    fetchTransactions({
      fromDate: filters.fromDate
        ? format(filters.fromDate, "yyyy-MM-dd")
        : undefined,
      toDate: filters.toDate ? format(filters.toDate, "yyyy-MM-dd") : undefined,
    });
  };

  // Toggle transaction details
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Apply filters
  const applyFilters = (fromDate: Date | null, toDate: Date | null) => {
    setFilters({ fromDate, toDate });
    setOffset(0);
    setLoading(true);
    setShowFilterModal(false);

    fetchTransactions({
      offset: 0,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
    });
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ fromDate: null, toDate: null });
    setOffset(0);
    setLoading(true);
    setShowFilterModal(false);

    fetchTransactions({ offset: 0 });
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor }}>
      <div className="flex items-center justify-between p-4 ">
        <BackButton
          title="Transactions"
          rightIcon={
            <Filter
              size={20}
              color={isDarkMode ? "#FFFFFF" : "#1E1F68"}
              onClick={() => setShowFilterModal(true)}
            />
          }
        />
      
      </div>

      {/* Transactions List */}
      <div className="flex-1 p-4">
        {loading && !refreshing ? (
          <div className="flex-1 flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-t-transparent border-primary-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex mb-4 px-2">
              <div className="flex-1">
                <span
                  className="font-medium"
                  style={{ color: secondaryTextColor }}
                >
                  Date
                </span>
              </div>
              <div className="flex-1">
                <span
                  className="font-medium"
                  style={{ color: secondaryTextColor }}
                >
                  Type
                </span>
              </div>
              <div className="flex-1 text-right">
                <span
                  className="font-medium"
                  style={{ color: secondaryTextColor }}
                >
                  Amount
                </span>
              </div>
              <div className="flex-1 text-right">
                <span
                  className="font-medium"
                  style={{ color: secondaryTextColor }}
                >
                  Wallet Bal
                </span>
              </div>
            </div>

            {/* Transaction Items */}
            {transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const { formattedAmount, color } = formatAmount(item.amount);

                  return (
                    <div
                      key={item.id}
                      className="mb-2 rounded-lg overflow-hidden"
                      style={{
                        backgroundColor: cardBgColor,
                        borderColor,
                        borderWidth: 1,
                      }}
                    >
                      <button
                        className="flex items-center p-4 w-full text-left"
                        onClick={() => toggleExpand(item.id)}
                      >
                        {/* Expand/Collapse Icon */}
                        <div className="mr-2">
                          {isExpanded ? (
                            <ChevronDown size={24} color={textColor} />
                          ) : (
                            <ChevronRight size={24} color={textColor} />
                          )}
                        </div>

                        {/* Date */}
                        <div className="flex-1 ">
                          <span
                            className="font-medium text-sm"
                            style={{ color: textColor }}
                          >
                            {formatDate(item.transDate)}
                          </span>
                        </div>

                        {/* Type */}
                        <div className="flex-1 ">
                          <span
                            className="font-medium text-sm"
                            style={{ color: textColor }}
                          >
                            {item.type}
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="flex-1 text-right">
                          <span className="font-medium" style={{ color }}>
                            {formattedAmount}
                          </span>
                        </div>

                        {/* Balance */}
                        <div className="flex-1 text-right">
                          <span
                            className="font-medium"
                            style={{ color: textColor }}
                          >
                            {item.balance}
                          </span>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div
                          className="p-4"
                          style={{
                            borderTopWidth: 1,
                            borderTopColor: borderColor,
                          }}
                        >
                          <div className="flex mb-2">
                            <span
                              className="w-1/3 font-medium"
                              style={{ color: secondaryTextColor }}
                            >
                              Date:
                            </span>
                            <span
                              className="w-2/3 font-normal"
                              style={{ color: textColor }}
                            >
                              {formatDate(item.transDate)}
                            </span>
                          </div>

                          <div className="flex mb-2">
                            <span
                              className="w-1/3 font-medium"
                              style={{ color: secondaryTextColor }}
                            >
                              Type:
                            </span>
                            <span
                              className="w-2/3 font-normal"
                              style={{ color: textColor }}
                            >
                              {item.type}
                            </span>
                          </div>

                          <div className="flex mb-2">
                            <span
                              className="w-1/3 font-medium"
                              style={{ color: secondaryTextColor }}
                            >
                              Description:
                            </span>
                            <span
                              className="w-2/3 font-normal"
                              style={{ color: textColor }}
                            >
                              {item.description}
                            </span>
                          </div>

                          {item.reference && (
                            <div className="flex">
                              <span
                                className="w-1/3 font-medium"
                                style={{ color: secondaryTextColor }}
                              >
                                Reference:
                              </span>
                              <span
                                className="w-2/3 font-normal"
                                style={{ color: textColor }}
                              >
                                {item.reference}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Infinite Scroll Sentinel Element */}
                {hasMore && (
                  <div
                    ref={observerRef}
                    className="py-4 flex justify-center items-center h-16"
                  >
                    {loadingMore && (
                      <div className="w-6 h-6 border-2 border-t-transparent border-primary-400 rounded-full animate-spin"></div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex justify-center items-center h-64">
                <EmptyState
                  type="transaction"
                  isDarkMode={isDarkMode}
                  textColor={isDarkMode ? "text-gray-300" : "text-gray-500"}
                  message="No transactions found"
                  subMessage="Your transaction history will appear here"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Modal */}
      <TransactionFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={applyFilters}
        onClear={clearFilters}
        initialFromDate={filters.fromDate}
        initialToDate={filters.toDate}
      />
    </div>
  );
};

export default TransactionsPage;
 