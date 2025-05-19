"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import { useStatusModal } from "@/lib/contexts/useStatusModal";
import {
  type BetCondition,
  type BetMarketFixture,
  type BetMarketUser,
  type BetPrediction,
  createBetMarket,
} from "@/lib/services/bet-service";
import BackButton from "@/components/BackButton";
import { handleApiError } from "@/lib/utils/handleApiError";
import { BetDetailsCard } from "@/components/bet-details/BetDetailsCard";
import { StakerCard } from "@/components/bet-details/StakerCard";
import { PredictionCard } from "@/components/bet-details/PredictionCard";
import { StakeCard } from "@/components/bet-details/StakeCard";
import { OpponentCard } from "@/components/bet-details/OpponentCard";
import StatusModal from "@/components/StatusModal";
import CustomButton from "@/components/CustomButton";

// Define the interface for search params
interface SummaryPageParams {
  prediction: BetPrediction;
  condition: BetCondition;
  amount: string;
  opponentPhone: string;
  opponentName: string;
  betType: "random" | "challenge";
  opponentId: string;
  opponentAvatar: string;
}

const SummaryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode } = useTheme();
  const { user } = useAuthStore();

  // Extract params from URL
  const params: SummaryPageParams = {
    prediction: searchParams.get("prediction") as BetPrediction,
    condition: searchParams.get("condition") as BetCondition,
    amount: searchParams.get("amount") || "",
    opponentPhone: searchParams.get("opponentPhone") || "",
    opponentName: searchParams.get("opponentName") || "",
    betType:
      (searchParams.get("betType") as "random" | "challenge") || "random",
    opponentId: searchParams.get("opponentId") || "",
    opponentAvatar: searchParams.get("opponentAvatar") || "",
  };

  const {
    prediction,
    condition,
    amount,
    opponentPhone,
    opponentName,
    betType,
    opponentId,
    opponentAvatar,
  } = params;

  const [fixture, setFixture] = useState<BetMarketFixture | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { modalState, showSuccessModal, showErrorModal, hideModal } =
    useStatusModal();

  // Extract styling variables for clarity and maintainability
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const cardBackgroundColor = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";
  const innerBackgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";

  // Load fixture data from localStorage on component mount
  useEffect(() => {
    const loadFixture = async () => {
      try {
        const storedFixture = localStorage.getItem("betFixtureData");
        if (storedFixture) {
          setFixture(JSON.parse(storedFixture));
        } else {
          setError("Fixture data not found");
        }
      } catch (err) {
        console.error("Error loading fixture data:", err);
        setError("Failed to load fixture data");
      }
    };

    loadFixture();
  }, []);

  const handlePlaceBet = async () => {
    if (!prediction || !condition || !amount || !fixture) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        fixtureId: fixture.id as string,
        prediction,
        condition,
        amount: Number(amount),
        mobile: opponentPhone,
        inviteeId: opponentId,
        inviteeName: opponentName,
      };

      const response = await createBetMarket(payload);
      console.log(response);

      // Extract the challenger's registration status from the response
      const isRegistered = response?.challenger?.isRegistered;

      // Determine team name based on prediction
      const ownerTeam = `${
        prediction === "LOSE" ? fixture?.item2?.name : fixture?.item1?.name
      } `;

      const predictionAmount = `${response?.totalAmount / 2} for ${
        response?.condition
      }`;

      // Create a matchName for use in the SMS invitation
      const matchName = `${fixture?.item1?.name} and ${
        fixture?.item2?.name
      } in the ${response?.category as string}`;

      const betOwner = response?.challenger?.nickname;

      // Clean up localStorage after successful bet placement
      localStorage.removeItem("betFixtureData");

      // Create a URLSearchParams object for the query parameters
      const queryParams = new URLSearchParams();
      queryParams.set(
        "isRegistered",
        isRegistered !== undefined ? String(isRegistered) : "true"
      );
      queryParams.set("opponentPhone", opponentPhone || "");
      queryParams.set("opponentName", betOwner || "");
      queryParams.set("matchName", matchName);
      queryParams.set("ownerTeam", ownerTeam);
      queryParams.set("prediction", response?.ownerPrediction);
      queryParams.set("predictionAmount", predictionAmount);

      // Navigate to success screen with params using App Router syntax
      router.push(`/success-page?${queryParams.toString()}`);
    } catch (err: any) {
      console.error("Error placing bet:", err);
      handleApiError(
        err,
        showErrorModal,
        "Failed to place bet. Please try again.",
        "Error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    hideModal();
  };

  // Error state
  if (error || !fixture) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${backgroundColor}`}
      >
        <p className={textColor}>
          {error || "Failed to load fixture details. Please try again."}
        </p>
      </div>
    );
  }

  // Determine which team the user is predicting will win
  const selectedTeamName =
    prediction === "WIN"
      ? fixture?.item1?.name
      : prediction === "LOSE"
      ? fixture?.item2?.name
      : "Draw";

  // Create a mock bet object for the components
  const mockBet = {
    id: "temp-id",
    owner: user as BetMarketUser, // Cast user to BetMarketUser
    fixture: fixture,
    ownerPrediction: prediction,
    challengerPrediction: null,
    status: "PENDING",
    category: fixture?.category || "Soccer",
    condition: condition,
    result: null,
  };

  const opponent =
    betType === "challenge"
      ? ({
          id: opponentId || "temp-id",
          firstname: opponentName?.split(" ")[0] || "",
          lastname: opponentName?.split(" ")[1] || "",
          nickname: opponentName || "",
          avatarUrl: opponentAvatar ? decodeURIComponent(opponentAvatar) : "",
        } as BetMarketUser)
      : null;

  return (
    <div className={` ${backgroundColor} pb-0`}>
      <div className="fixed top-10 left-0 right-0 z-20">

        {/* Match Details */}
        <BetDetailsCard bet={mockBet as any} />
      </div>

      <div className="flex-1 px-2 overflow-auto mt-[16rem] xs:mt-[14rem]">
        {/* Staker Info */}
        <StakerCard owner={user as BetMarketUser} />

        {/* Prediction */}
        <PredictionCard
          ownerPrediction={prediction}
          ownerTeamName={selectedTeamName}
        />

        {/* Condition */}
        <div className={`rounded-xl p-4 mb-2 ${cardBackgroundColor}`}>
          <p className={`${secondaryTextColor} uppercase text-xs mb-2`}>
            CONDITION
          </p>
          <p className={`${textColor} font-medium`}>
            {condition === "FT" ? "FT Result" : "HT Result"}
          </p>
        </div>

        {/* Stake */}
        <StakeCard totalAmount={Number(amount) * 2} />

        {/* Opponent */}
        {betType === "random" ? (
          <div className={`rounded-xl p-4 mb-2 ${cardBackgroundColor}`}>
            <p className={`${secondaryTextColor} uppercase text-xs mb-2`}>
              OPPONENT
            </p>
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${innerBackgroundColor}`}>
                <span className={`${textColor} font-bold`}>🏆</span>
              </div>
              <p className={`${textColor} font-medium ml-3`}>Random Opponent</p>
            </div>
          </div>
        ) : (
          <OpponentCard
            challenger={opponent}
            status="PENDING"
            isFromAllBet={false}
            selectedPrediction={null}
            showSelectionOptions={false}
          />
        )}

        {/* Place Bet Button */}

        <CustomButton
          title={submitting ? "Processing..." : "Place Bet"}
          onClick={handlePlaceBet}
          disabled={submitting}
          size="lg"
          className="w-full mt-6 mb-2"
        />
      </div>

      {/* Error Modal */}
      <StatusModal
        visible={modalState.visible}
        onClose={handleModalClose}
        title={modalState.title}
        message={modalState.message}
        buttonText={modalState.buttonText}
        type={modalState.type}
      />
    </div>
  );
};

export default SummaryPage;
