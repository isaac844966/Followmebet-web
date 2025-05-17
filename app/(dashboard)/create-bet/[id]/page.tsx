"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import type {
  BetCondition,
  BetMarketFixture,
  BetPrediction,
} from "@/lib/services/bet-service";
import { getFixtureById } from "@/lib/services/bet-service";
import StatusModalWrapper from "@/components/StatusModalWrapper";
import TabNavigation from "@/components/create-bet/TabNavigation";
import PlaceBetTab from "@/components/create-bet/PlaceBetTab";
import OpenChallengesTab from "@/components/create-bet/OpenChallengesTab";
import StandingsTab from "@/components/create-bet/StandingsTab";
import { useStandings } from "@/hooks/use-standing";
import { useBetMarkets } from "@/hooks/use-bet-market";
import MatchDetailsCard from "@/components/bet-details/MatchDetailCard";
import BackButton from "@/components/BackButton";
import { useStatusModal } from "@/lib/contexts/useStatusModal";
import StatusModal from "@/components/StatusModal";

const MIN_BET_AMOUNT = 100;

export default function CreateBetPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  const fixtureDataParam = searchParams.get("fixtureData");
  const categoryId = searchParams.get("categoryId") || "";
  const returnTab = searchParams.get("activeTab") || "";
  const fromFixtureId = searchParams.get("fromFixtureId") || "false";

  const [fixture, setFixture] = useState<BetMarketFixture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bet selections
  const [selectedPrediction, setSelectedPrediction] =
    useState<BetPrediction | null>(null);
  const [selectedCondition, setSelectedCondition] =
    useState<BetCondition | null>(null);
  const [selectedBetType, setSelectedBetType] = useState<
    "random" | "challenge"
  >("random");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Get standings data using our custom hook - only fetch when needed
  const {
    standings,
    loading: standingsLoading,
    error: standingsError,
    leagueName,
    fetchStandings,
  } = useStandings(categoryId, false); // Don't fetch automatically

  // Get bet markets data using our custom hook
  const {
    bets,
    loading: betsLoading,
    error: betsError,
    fetchBets,
    refreshBets,
    hasMoreBets,
    refreshing: refreshingBets,
  } = useBetMarkets(id as string);
 const { modalState, showErrorModal, hideModal } = useStatusModal();



  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-500";

  const handleTabPress = (index: number) => {
    setActiveTab(index);

    // Only fetch standings data when the standings tab is selected
    if (index === 2 && !standings.length && !standingsLoading) {
      fetchStandings();
    }

    // Only fetch open challenges when that tab is selected
    if (index === 1 && bets.length === 0 && !betsLoading) {
      fetchBets();
    }

    // Scroll to the selected tab
    if (horizontalScrollRef.current) {
      const tabContainers =
        horizontalScrollRef.current.querySelectorAll(".tab-content");
      if (tabContainers[index]) {
        tabContainers[index].scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    // Check if we have fixture data passed in the URL
    if (fixtureDataParam) {
      try {
        const parsedFixture = JSON.parse(
          decodeURIComponent(fixtureDataParam)
        ) as BetMarketFixture;
        setFixture(parsedFixture);
        setLoading(false);
      } catch (err) {
        fetchFixtureFromAPI();
      }
    } else {
      fetchFixtureFromAPI();
    }
  }, [id, fixtureDataParam]);

  const fetchFixtureFromAPI = async () => {
    try {
      setLoading(true);
      const fixtureData = await getFixtureById(id as string);
      setFixture(fixtureData);
    } catch (err: any) {
      setError(err.message || "Failed to load fixture details");
    } finally {
      setLoading(false);
    }
  };

  const handlePredictionSelect = (prediction: BetPrediction) => {
    setSelectedPrediction(prediction);
  };

  const handleConditionSelect = (condition: BetCondition) => {
    setSelectedCondition(condition);
  };

  const handleBetTypeSelect = (type: "random" | "challenge") => {
    setSelectedBetType(type);
    // Reset selected amount when changing bet type
    setSelectedAmount(null);
    setCustomAmount("");
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);

    // Convert to number if valid
    if (value && !isNaN(Number(value))) {
      setSelectedAmount(Number(value));
    } else {
      setSelectedAmount(null);
    }
  };

  const validateForm = () => {
    if (!selectedPrediction) {
      showErrorModal("Please select a prediction");
      return false;
    }

    if (fixture?.eventType !== "Special" && !selectedCondition) {
      showErrorModal("Please choose a condition");
      return false;
    }

    if (!selectedAmount || selectedAmount <= 0) {
      showErrorModal("Please enter a valid amount");
      return false;
    }

    if (selectedAmount < MIN_BET_AMOUNT) {
      showErrorModal(`Minimum bet amount is ${MIN_BET_AMOUNT}`);
      return false;
    }

    return true;
  };

  const storeFixtureInLocalStorage = () => {
    if (fixture) {
      try {
        const fixtureString = JSON.stringify(fixture);
        localStorage.setItem("betFixtureData", fixtureString);
        return true;
      } catch (error) {
        console.error("Error storing fixture data:", error);
        return false;
      }
    }
    return false;
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    if (!fixture) {
      showErrorModal("Match details not available");
      return;
    }

    const stored = storeFixtureInLocalStorage();
    if (!stored) {
      showErrorModal("Failed to save match details");
      return;
    }

    if (selectedBetType === "random") {
      router.push(
        `/bet-summary?prediction=${selectedPrediction}&condition=${selectedCondition}&amount=${selectedAmount}&betType=random&activeTab=${returnTab}`
      );
    } else {
      router.push(
        `/select-opponents?prediction=${selectedPrediction}&condition=${selectedCondition}&amount=${selectedAmount}&activeTab=${returnTab}`
      );
    }
  };

  const handleNavigate = () => {
    if (fromFixtureId === "true") {
      router.push(`/create-bet?activeTab=${returnTab}`);
    } else {
      router.push("/create-bet");
    }
  };

  return (
    <div className={`min-h-screen ${backgroundColor} pt-20`}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <BackButton title="create bet" />
        <MatchDetailsCard fixture={fixture as any} isDarkMode={isDarkMode} />
        {fixture?.eventType !== "Special" && (
          <TabNavigation activeTab={activeTab} onTabChange={handleTabPress} />
        )}
      </div>

      {/* Main content with proper padding to account for fixed header */}
      <div className="pt-[180px]">
        {/* Tab Content */}
        <div ref={horizontalScrollRef} className="flex-1 overflow-hidden">
          <div className="flex h-full mt-6">
            {/* Tab 1: Place Bet */}
            <div
              className={`tab-content w-full flex-shrink-0 ${
                activeTab === 0 ? "block" : "hidden"
              }`}
            >
              <PlaceBetTab
                fixture={fixture as any}
                selectedPrediction={selectedPrediction}
                selectedCondition={selectedCondition}
                selectedBetType={selectedBetType}
                selectedAmount={selectedAmount}
                customAmount={customAmount}
                isDarkMode={isDarkMode}
                onSelectPrediction={handlePredictionSelect}
                onSelectCondition={handleConditionSelect}
                onSelectBetType={handleBetTypeSelect}
                onSelectAmount={handleAmountSelect}
                onChangeCustomAmount={handleCustomAmountChange}
                onNext={handleNext}
              />
            </div>

            {/* Tab 2: Open Challenge */}
            <div
              className={`tab-content w-full flex-shrink-0 ${
                activeTab === 1 ? "block" : "hidden"
              }`}
            >
              <OpenChallengesTab
                bets={bets}
                loading={betsLoading}
                error={betsError}
                refreshing={refreshingBets}
                hasMore={hasMoreBets}
                onRefresh={refreshBets}
                onLoadMore={fetchBets}
                isDarkMode={isDarkMode}
                textColor={textColor}
                secondaryTextColor={secondaryTextColor}
                router={router}
              />
            </div>

            {/* Tab 3: Standings */}
            <div
              className={`tab-content w-full flex-shrink-0 ${
                activeTab === 2 ? "block" : "hidden"
              }`}
            >
              <StandingsTab
                standings={standings}
                loading={standingsLoading}
                error={standingsError}
                leagueName={leagueName}
                categoryId={categoryId}
                isDarkMode={isDarkMode}
                textColor={textColor}
                secondaryTextColor={secondaryTextColor}
                team1Name={fixture?.item1.name}
                team2Name={fixture?.item2.name}
              />
            </div>
          </div>
        </div>

        {/* Status Modal */}
        
        <StatusModal
          visible={modalState.visible}
          onClose={hideModal}
          title={modalState.title}
          message={modalState.message}
          buttonText={modalState.buttonText}
          type={modalState.type}
        />
      </div>
    </div>
  );
}
