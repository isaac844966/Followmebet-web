"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react"; // Changed from Feather to MessageSquare
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useStatusModal } from "@/lib/contexts/useStatusModal";
import SuccessIcon from "@/components/SuccessIcon";
import StatusModal from "@/components/StatusModal";
import CustomButton from "@/components/CustomButton";

const SuccessPage = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const searchParams = useSearchParams();
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";

  // Using optional chaining with nullish coalescing for more robust param handling
  const isRegistered = searchParams?.get("isRegistered") ?? "true";
  const opponentPhone = searchParams?.get("opponentPhone") ?? "";
  const opponentName = searchParams?.get("opponentName") ?? "";
  const matchName = searchParams?.get("matchName") ?? "";
  const ownerTeam = searchParams?.get("ownerTeam") ?? "";
  const prediction = searchParams?.get("prediction") ?? "";
  const predictionAmount = searchParams?.get("predictionAmount") ?? "";

  const { modalState, showInfoModal, hideModal } = useStatusModal();
  const frombetdetails = searchParams.get("frombetdetails");
  const isFromBetDetails = frombetdetails === "true";

  useEffect(() => {
    // Only show invite prompt if friend isn't registered and we have their phone number
    if (isRegistered === "false" && opponentPhone) {
      // Add a small delay to prevent potential race conditions
      const timer = setTimeout(() => {
        showInfoModal(
          `${opponentName} hasn't installed the app. Please send them an invitation with the details of the bet!`,
          "Send Message",
          "Send Challenge Invite"
        );
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isRegistered, opponentPhone, opponentName, showInfoModal]);

  const navigateToMyBets = () => {
    router.push("/fixtures");
  };

  const sendMessage = () => {
    // Hide modal first to prevent potential re-rendering issues
    hideModal();

    // Small delay to ensure modal is closed before proceeding
    setTimeout(() => {
      const message = `Hey ${opponentName} I'm inviting you to join me in a bet for the upcoming match between ${matchName}. I'm backing ${ownerTeam} ${prediction} and I have staked ${predictionAmount} result. To accept the challenge, kindly register, download and install the app from https://followmebet.com.ng. Let the game begin!`;

      // For web, we'll use mailto: or sms: protocol
      const encodedMessage = encodeURIComponent(message);
      const url = `sms:${opponentPhone}?body=${encodedMessage}`;

      // Open in a new tab
      window.open(url, "_blank");
    }, 100);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-4 ${backgroundColor}`}
    >
      <div></div>

      <div className="flex flex-col items-center px-4">
        <SuccessIcon size={80} color="#FFA726" />
        <h1 className={`${textColor} text-center text-2xl font-bold mt-6`}>
          {isFromBetDetails
            ? "Challenge Accepted Succussfully"
            : "Challenge Decleared SuccessFully"}
        </h1>
        <p className={`${textColor} text-center mt-4 opacity-80`}>
          {isRegistered === "false"
            ? "Your friend will need to download the app to accept your challenge."
            : isFromBetDetails
            ? "You've successfully accepeted the challenge!"
            : "Your challenge has been sent successfully!"}
        </p>
      </div>

      <CustomButton
        className="w-full mb-4"
        title="Go to Fixtures"
        onClick={navigateToMyBets}
        size="lg"
      />

      {modalState.visible && (
        <StatusModal
          visible={modalState.visible}
          onClose={hideModal}
          title={modalState.title}
          message={modalState.message}
          buttonText={modalState.buttonText}
          type={modalState.type}
          onButtonPress={sendMessage}
          customIcon={<MessageSquare size={50} className="text-[#FFA726]" />}
        />
      )}
    </div>
  );
};

export default SuccessPage;
