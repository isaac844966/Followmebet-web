"use client";

import type React from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import type { BetMarketItem } from "@/lib/services/bet-service";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface OpenChallengesTabProps {
  bets: BetMarketItem[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  isDarkMode: boolean;
  textColor: string;
  secondaryTextColor: string;
  router: AppRouterInstance;
}

const OpenChallengesTab: React.FC<OpenChallengesTabProps> = ({
  bets,
  loading,
  error,
  refreshing,
  hasMore,
  onRefresh,
  onLoadMore,
  isDarkMode,
  textColor,
  secondaryTextColor,
  router,
}) => {
  // Render a bet item
  const renderBetItem = (item: BetMarketItem) => {
    const predictionColor =
      item.ownerPrediction === "WIN"
        ? "text-green-500"
        : item.ownerPrediction === "LOSE"
        ? "text-green-500"
        : "text-yellow-500";

    return (
      <button
        key={`bet-item-${item.id}`}
        className="flex items-center justify-between py-3 border-b border-gray-700 w-full text-left"
        onClick={() =>
          router.push(`/bet-details/${item.id}?fromCreateBet=true`)
        }
      >
        <div className="flex items-center">
          <div className="relative w-7 h-7 mr-3">
            <Image
              src={item.owner.avatarUrl || "/placeholder.svg"}
              alt={item.owner.nickname}
              fill
              className={`${
                isDarkMode ? "border-white" : "border-[#FBB03B]"
              } border rounded-full object-cover`}
            />
          </div>
          <div>
            <p className={`${textColor} font-medium text-sm`}>
              {item.owner.nickname} predict
            </p>
            <div className="flex items-center">
              <p
                className={`${textColor} text-sm max-w-[120px]`}
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {item.ownerPrediction === "WIN"
                  ? item.fixture.item1.name
                  : item.ownerPrediction === "LOSE"
                  ? item.fixture.item2.name
                  : item.fixture.item1.name}{" "}
                <span className={predictionColor}>
                  {item.ownerPrediction === "LOSE"
                    ? "WIN"
                    : item.ownerPrediction}
                </span>
              </p>
            </div>
          </div>
        </div>
        <p className={`${textColor} font-bold text-sm`}>
          ₦{(item.totalAmount / 2).toLocaleString()}
        </p>
      </button>
    );
  };

  // Render empty state for bets
  const renderEmptyBets = () => {
    if (loading) return null;

    return (
      <div className="py-40 flex items-center justify-center">
        <p className={textColor}>
          No open challenge available for this fixture
        </p>
      </div>
    );
  };

  return (
    <div className="flex-1 px-4 overflow-auto">
      {loading ? (
        <div className="flex-1 flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="flex-1 flex justify-center items-center py-20">
          <p className={textColor}>{error}</p>
        </div>
      ) : (
        <div className="flex-1">
          <p className={`${secondaryTextColor} my-4`}>Play against others</p>

          <div className="space-y-1">
            {bets.length > 0 ? (
              <>
                {bets.map(renderBetItem)}
                {hasMore && (
                  <button
                    onClick={onLoadMore}
                    className="w-full py-3 text-center text-primary"
                  >
                    {refreshing ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin mx-auto" />
                    ) : (
                      "Load More"
                    )}
                  </button>
                )}
              </>
            ) : (
              renderEmptyBets()
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenChallengesTab;
