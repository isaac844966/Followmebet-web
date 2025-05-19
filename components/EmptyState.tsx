"use client";

import type React from "react";
import { Receipt, Star, CloudOff, Wallet, Building, Award } from "lucide-react";

interface EmptyStateProps {
  type:
    | "soccer"
    | "special"
    | "network"
    | "market"
    | "bank"
    | "bet"
    | "transaction";
  isDarkMode: boolean;
  textColor: string;
  message?: string;
  subMessage?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  isDarkMode,
  textColor,
  message,
  subMessage,
}) => {
  const iconColor = isDarkMode ? "#FFA726" : "#1E1F68";

  const getIcon = () => {
    switch (type) {
      case "soccer":
        return (
          <Award size={50} color={iconColor} className="xs:w-10 xs:h-10" />
        );
      case "special":
        return <Star size={50} color={iconColor} className="xs:w-10 xs:h-10" />;
      case "network":
        return (
          <CloudOff size={50} color={iconColor} className="xs:w-10 xs:h-10" />
        );
      case "transaction":
        return (
          <Receipt size={50} color={iconColor} className="xs:w-10 xs:h-10" />
        );
      case "bank":
        return (
          <Building size={50} color={iconColor} className="xs:w-10 xs:h-10" />
        );
      case "bet":
        return (
          <Award size={50} color={iconColor} className="xs:w-10 xs:h-10" />
        );
      case "market":
        return (
          <Wallet size={50} color={iconColor} className="xs:w-10 xs:h-10" />
        );
      default:
        return (
          <CloudOff size={50} color={iconColor} className="xs:w-10 xs:h-10" />
        );
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case "soccer":
        return "No fixtures available for this date";
      case "special":
        return "No special fixtures available";
      case "network":
        return "No internet connection";
      case "transaction":
        return "No transactions found";
      case "bank":
        return "No bank accounts found";
      case "bet":
        return "No bets found";
      case "market":
        return "No markets available";
      default:
        return "No data available";
    }
  };

  const getDefaultSubMessage = () => {
    switch (type) {
      case "soccer":
        return "Try selecting a different date";
      case "special":
        return "Check back later for special events";
      case "network":
        return "Please check your connection and try again";
      case "transaction":
        return "Your transaction history will appear here";
      case "bank":
        return "Add a bank account to withdraw funds";
      case "bet":
        return "Create a bet to get started";
      case "market":
        return "Check back later for available markets";
      default:
        return "Try again later";
    }
  };

  return (
    <div className="py-10 xs:py-6 flex flex-col items-center justify-center mt-20 xs:mt-12">
      {getIcon()}
      <p
        className={`${textColor} text-center text-lg xs:text-base mt-4 mb-2 font-medium`}
      >
        {message || getDefaultMessage()}
      </p>
      {(subMessage || getDefaultSubMessage()) && (
        <p
          className={`${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } text-center px-4 xs:text-sm`}
        >
          {subMessage || getDefaultSubMessage()}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
