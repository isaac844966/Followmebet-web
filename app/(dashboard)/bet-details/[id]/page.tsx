"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import { acceptBet, declineBet } from "@/lib/services/bet-historyService";
import { fetchUserProfile } from "@/lib/services/authService";
import { BetDetailsCard } from "@/components/bet-details/BetDetailsCard";
import { StakerCard } from "@/components/bet-details/StakerCard";
import { PredictionCard } from "@/components/bet-details/PredictionCard";
import { ConditionCard } from "@/components/bet-details/ConditionCard";
import { StakeCard } from "@/components/bet-details/StakeCard";
import { OpponentCard } from "@/components/bet-details/OpponentCard";
import { OpponentPredictionCard } from "@/components/bet-details/OpponentPredictionCard";
import { PredictionSelectionCard } from "@/components/bet-details/PredictionSelectionCard";
import { BetSummaryCard } from "@/components/bet-details/BetSummaryCard";
import StatusModalWrapper from "@/components/StatusModalWrapper";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/CustomModal";
import BackButton from "@/components/BackButton";
import CustomButton from "@/components/CustomButton";

// Types for better type safety
type PredictionType = "WIN" | "LOSE" | "DRAW" | null;
type StatusModalType = "success" | "error" | "warning" | "info";

interface BetOwner {
  id: string;
  firstname?: string;
  lastname?: string;
  nickname?: string;
  avatarUrl?: string;
}

interface BetFixture {
  time: string;
  item1?: { name: string; logoUrl?: string };
  item2?: { name: string; logoUrl?: string };
  htResult?: string;
  ftResult?: string;
}

interface Bet {
  id: string;
  owner?: BetOwner;
  challenger?: BetOwner | null;
  fixture: BetFixture;
  ownerPrediction: PredictionType;
  challengerPrediction: PredictionType;
  status: string;
  category: string;
  condition: "HT" | "FT" | string;
  totalAmount: number;
  potentialWin: number;
  fee: number;
  result?: PredictionType;
}

const BetDetailsPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useAuthStore();

  // Get parameters from URL
  const id = params.id as string;
  const itemDataParam = searchParams.get("itemData");
  const fromAllBet = searchParams.get("fromAllBet") === "true";
  const fromAcceptedBet = searchParams.get("fromAcceptedBet") === "true";
  const fromSettledBet = searchParams.get("fromSettledBet") === "true";
  const fromPublicBet = searchParams.get("fromPublicBet") === "true";
  const fromPrivateBet = searchParams.get("fromPrivateBet") === "true";
  const fromPrivateBetDelete =
    searchParams.get("fromPrivateBetDelete") === "true";
  const fromAllBet2 = searchParams.get("fromAllBet2") === "true";
  const fromCreateBet = searchParams.get("fromCreateBet") === "true";

  // Parse the bet data from the passed string
  const [bet, setBet] = useState<Bet | null>(null);

  useEffect(() => {
    if (itemDataParam) {
      try {
        const parsedBet = JSON.parse(decodeURIComponent(itemDataParam));
        setBet(parsedBet);
      } catch (error) {
        console.error("Failed to parse bet data:", error);
      }
    }
  }, [itemDataParam]);

  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(
    null
  );
  const [selectedApiPrediction, setSelectedApiPrediction] =
    useState<PredictionType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  // Status modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalType, setStatusModalType] =
    useState<StatusModalType>("success");
  const [statusModalTitle, setStatusModalTitle] = useState("");
  const [statusModalMessage, setStatusModalMessage] = useState("");

  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";

  const handleSelect = (
    prediction: string,
    apiValue: "WIN" | "LOSE" | "DRAW"
  ) => {
    setSelectedPrediction(prediction);
    setSelectedApiPrediction(apiValue);
  };

  // Navigation helper function
  const navigateToBets = (statusTab: string, visibilityTab?: string) => {
    if (statusTab === "accepted") {
      router.push("/my-bets?tab=accepted");
    } else if (statusTab === "settled") {
      router.push("/my-bets?tab=settled");
    } else if (statusTab === "pending") {
      router.push(`/my-bets?tab=pending&subTab=${visibilityTab || "public"}`);
    }
  };

  // Handle back navigation
  const handleNavigation = () => {
    if (fromAcceptedBet) {
      navigateToBets("accepted");
    } else if (fromSettledBet) {
      navigateToBets("settled");
    } else if (fromPublicBet) {
      navigateToBets("pending", "public");
    } else if (fromPrivateBet || fromPrivateBetDelete) {
      navigateToBets("pending", "private");
    } else if (fromAllBet || fromAllBet2) {
      router.push("/bet-market");
    } else {
      router.push("/dashboard");
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowStatusModal(false);
    if (statusModalType === "success") {
      handleNavigation();
    }
  };

  const handleDecline = async () => {
    if (!bet) return;

    try {
      setLoading(true);
      await declineBet(bet.id);
      await fetchUserProfile();

      setStatusModalType("success");
      setStatusModalTitle("Bet Declined");
      setStatusModalMessage("The bet has been successfully declined.");
      setShowStatusModal(true);
    } catch (err: any) {
      setError(err.message || "Failed to decline bet");
      setStatusModalType("error");
      setStatusModalTitle("Decline Failed");
      setStatusModalMessage(err.message || "Failed to decline bet");
      setShowStatusModal(true);
    } finally {
      setLoading(false);
      setShowDeclineModal(false);
    }
  };

  // Handle placing a bet
  const handlePlaceBet = async () => {
    if (!bet) return;

    if (!selectedApiPrediction) {
      setStatusModalType("warning");
      setStatusModalTitle("No Prediction Selected");
      setStatusModalMessage(
        "Please select a prediction before placing your bet."
      );
      setShowStatusModal(true);
      return;
    }

    try {
      setLoading(true);
      await acceptBet({
        betMarketId: bet.id,
        prediction: selectedApiPrediction,
      });
      await fetchUserProfile();

      setStatusModalType("success");
      setStatusModalTitle("Bet Placed Successfully");
      setStatusModalMessage("Your bet has been placed successfully!");
      setShowStatusModal(true);
    } catch (err: any) {
      setStatusModalType("error");
      setStatusModalTitle("Bet Failed");
      setStatusModalMessage(err.message || "Failed to place bet");
      setShowStatusModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (!bet) {
    return (
      <div
        className={`min-h-screen ${backgroundColor} flex items-center justify-center`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // User relationship to the bet
  const isOwner = user?.id === bet?.owner?.id;
  const isChallenger = user?.id === bet?.challenger?.id;
  const isPending = bet.status === "PENDING";
  const isCompleted = bet.status === "COMPLETED";

  // Determine button visibility
  const showSelectionOptions =
    fromAllBet || fromPrivateBet || fromAllBet2 || fromCreateBet;
  const showAcceptButton = showSelectionOptions;
  const showDeclineButton = fromPrivateBet;
  const showDeleteButton = fromPrivateBetDelete || fromPublicBet;

  // Determine which result to show based on condition
  const resultToShow =
    bet.condition === "HT"
      ? bet.fixture.htResult
      : bet.condition === "FT"
      ? bet.fixture.ftResult
      : null;

  // Determine owner's and challenger's teams
  const team1 = bet.fixture.item1 || { name: "Team 1" };
  const team2 = bet.fixture.item2 || { name: "Team 2" };
  const team1Name = team1.name;
  const team2Name = team2.name;

  const ownerTeamObj =
    bet.ownerPrediction === "WIN"
      ? team1
      : bet.ownerPrediction === "DRAW"
      ? bet.challengerPrediction === "WIN"
        ? team2 // challenger won the draw, so owner gets the other side
        : team1
      : /* ownerPrediction = LOSE */ team2;

  const ownerTeamName = ownerTeamObj?.name || "Unknown Team";

  const challengerTeamObj =
    bet.ownerPrediction === "WIN"
      ? team2
      : bet.ownerPrediction === "DRAW"
      ? bet.challengerPrediction === "WIN"
        ? team1
        : team2
      : bet.challengerPrediction === "WIN" ||
        bet.challengerPrediction === "DRAW"
      ? team1
      : team2;

  const challengerTeamName = challengerTeamObj?.name || "Unknown Team";

  // Calculate fees and winnings
  const commissionFee =
    bet.totalAmount - bet.potentialWin * (1 - bet.fee / 100);
  const isFromPublicOrPrivateDelete = fromPublicBet || fromPrivateBetDelete;

  const potentialWinnings = isFromPublicOrPrivateDelete
    ? ((bet.potentialWin / 2) * (1 - bet.fee / 100)).toFixed(2)
    : bet.result === "WIN" && bet.fixture.htResult !== "?-?"
    ? (bet.potentialWin * (1 - bet.fee / 100)).toFixed(2)
    : bet.result === "LOSE" && bet.fixture.htResult !== "?-?"
    ? "0.00"
    : bet.result === "DRAW" && bet.fixture.htResult !== "?-?"
    ? ((bet.potentialWin / 2) * (1 - bet.fee / 100)).toFixed(2)
    : (bet.potentialWin * (1 - bet.fee / 100)).toFixed(2);

  return (
    <div className={`min-h-screen ${backgroundColor}`}>
      {/* Header */}
      <div className=" py-3 sticky top-0 z-10 bg-inherit">
        <BackButton title="Bet Details" onPress={handleNavigation} />
        <BetDetailsCard bet={bet} resultToShow={resultToShow} />
      </div>

      {/* Match Details Card */}

      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        {/* Staker Card */}
        <StakerCard owner={bet.owner} />

        {/* Prediction Card */}
        <PredictionCard
          ownerPrediction={bet.ownerPrediction}
          ownerTeamName={ownerTeamName}
        />

        {/* Condition Card */}
        <ConditionCard condition={bet.condition} />

        {/* Stake Card */}
        <StakeCard totalAmount={bet.totalAmount} />

        {/* Opponent Card */}
        <OpponentCard
          challenger={bet.challenger}
          status={bet.status}
          isFromAllBet={fromAllBet}
          selectedPrediction={selectedPrediction}
          showSelectionOptions={showSelectionOptions}
        />

        {/* Show opponent prediction if completed */}
        {isCompleted && bet.challengerPrediction && (
          <OpponentPredictionCard
            challengerPrediction={bet.challengerPrediction}
            challengerTeamName={challengerTeamName}
          />
        )}

        {/* Selection options */}
        {showSelectionOptions && (
          <PredictionSelectionCard
            team1Name={team1Name}
            team2Name={team2Name}
            ownerPrediction={bet.ownerPrediction}
            selectedApiPrediction={selectedApiPrediction}
            handleSelect={handleSelect}
          />
        )}

        {/* Bet Summary */}
        <BetSummaryCard
          bet={bet}
          isCompleted={isCompleted}
          showAcceptButton={showAcceptButton}
          commissionFee={commissionFee}
          potentialWinnings={potentialWinnings}
          isFromSettledBet={fromSettledBet}
          isFromPrivateBet={fromPrivateBet}
          isFromPrivateBetDelete={fromPrivateBetDelete}
          isFromPublicBet={fromPublicBet}
        />

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          {/* Accept Button - only show for AllBet or PrivateBet when not owner */}
          {showAcceptButton && (
            
        
            <CustomButton
              className="w-full py-6 bg-[#FFA726] hover:bg-[#FF9800] text-black font-medium"
              disabled={!selectedApiPrediction || loading}
              onClick={handlePlaceBet}
              loading={loading}
              title={fromAllBet ? "Place Bet" : "Accept Bet"}
            />
          )}
          {/* Decline Button - only show for PrivateBet */}
          {showDeclineButton && (
            <CustomButton
              title="Decline Bet"
              className="w-full py-6 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => setShowDeclineModal(true)}
            />
          )}
          {/* Delete Button - only show for PublicBet when owner */}
          {showDeleteButton && (
            <CustomButton
              title="Delete"
              onClick={() => setShowDeclineModal(true)}
              className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-medium"
            />
          )}
        </div>
      </div>

      {/* Decline/Delete Confirmation Modal */}
      <CustomModal
        visible={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        title={showDeclineButton ? "Decline Bet" : "Delete Bet"}
        message={
          showDeclineButton
            ? "Are you sure you want to decline this bet? This action cannot be undone."
            : `Deleting will cost you ${bet.fee}% deduction from your total stake before refunding to your wallet. This action cannot be undone.`
        }
        primaryButtonText={showDeclineButton ? "Yes, Decline" : "Yes, Delete"}
        secondaryButtonText="Cancel"
        onPrimaryButtonPress={handleDecline}
        onSecondaryButtonPress={() => setShowDeclineModal(false)}
        primaryButtonColor="#FF3B30"
        primaryTextColor="#FFFFFF"
        hideCloseOnOverlayPress={loading}
      />

      {/* Status Modal */}
      <StatusModalWrapper
        visible={showStatusModal}
        onClose={handleModalClose}
        title={statusModalTitle}
        message={statusModalMessage}
        type={statusModalType}
        buttonText="OK"
      />
    </div>
  );
};

export default BetDetailsPage;
