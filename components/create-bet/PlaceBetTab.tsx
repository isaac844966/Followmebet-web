"use client";

import type React from "react";
import { useEffect } from "react";
import type {
  BetCondition,
  BetMarketFixture,
  BetPrediction,
} from "@/lib/services/bet-service";
import BetConditionSelector from "./BetConditionSelector";
import BetTypeSelector from "./BetTypeSelector";
import ActionButton from "./ActionButton";
import AmountInput from "./AmountInput";
import AmountSelector from "./AmountSelector";
import BetPredictionSelector from "./BetPredictonSelector";

interface PlaceBetTabProps {
  fixture: BetMarketFixture | null;
  selectedPrediction: BetPrediction | null;
  selectedCondition: BetCondition | null;
  selectedBetType: "random" | "challenge";
  selectedAmount: number | null;
  customAmount: string;
  isDarkMode: boolean;
  onSelectPrediction: (prediction: BetPrediction) => void;
  onSelectCondition: (condition: BetCondition) => void;
  onSelectBetType: (type: "random" | "challenge") => void;
  onSelectAmount: (amount: number) => void;
  onChangeCustomAmount: (value: string) => void;
  onNext: () => void;
}

const MIN_BET_AMOUNT = 100;

const PlaceBetTab: React.FC<PlaceBetTabProps> = ({
  fixture,
  selectedPrediction,
  selectedCondition,
  selectedBetType,
  selectedAmount,
  customAmount,
  isDarkMode,
  onSelectPrediction,
  onSelectCondition,
  onSelectBetType,
  onSelectAmount,
  onChangeCustomAmount,
  onNext,
}) => {
  useEffect(() => {
    if (
      fixture &&
      fixture.eventType === "Special" &&
      (!selectedCondition || selectedCondition !== "FT")
    ) {
      onSelectCondition("FT");
    }
  }, [fixture, fixture?.eventType, selectedCondition, onSelectCondition]);

  if (!fixture) {
    return (
      <div className="flex justify-center items-center h-64 xs:h-48">
        <div
          className={`text-lg xs:text-base ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Loading match details...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 xs:px-3 mt-10 xs:mt-6">
        <BetPredictionSelector
          fixture={fixture}
          selectedPrediction={selectedPrediction as BetPrediction}
          onSelectPrediction={onSelectPrediction}
          isDarkMode={isDarkMode}
        />

        {fixture.eventType !== "Special" && (
          <BetConditionSelector
            selectedCondition={selectedCondition}
            onSelectCondition={onSelectCondition}
            isDarkMode={isDarkMode}
          />
        )}

        <BetTypeSelector
          selectedBetType={selectedBetType}
          onSelectBetType={onSelectBetType}
          isDarkMode={isDarkMode}
        />

        {selectedBetType === "random" ? (
          <AmountSelector
            selectedAmount={selectedAmount as number}
            onSelectAmount={onSelectAmount}
            isDarkMode={isDarkMode}
          />
        ) : (
          <AmountInput
            customAmount={customAmount}
            onChangeAmount={onChangeCustomAmount}
            isDarkMode={isDarkMode}
            minAmount={MIN_BET_AMOUNT}
          />
        )}

        <div className="py-4 xs:py-3">
          <ActionButton onPress={onNext} title="Next" isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default PlaceBetTab;
