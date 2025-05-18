"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import { useStatusModal } from "@/lib/contexts/useStatusModal";
import { changePin, transactionPin } from "@/lib/services/pinService";
import { Withdrawal as WithdrawalService } from "@/lib/services/walletService";
import BackButton from "@/components/BackButton";
import PinInput from "@/components/PinInput";
import NumericKeypad from "@/components/NumericKeypad";
import StatusModal from "@/components/StatusModal";
import { Loader2 } from "lucide-react";
import { handleApiError } from "@/lib/utils/handleApiError";
import { addBankAccount } from "@/lib/services/bank-service";

type PinScreenType =
  | "ENTER_PIN"
  | "CONFIRM_PIN"
  | "CURRENT_PIN"
  | "NEW_PIN"
  | "CONFIRM_NEW_PIN"
  | "CREATE_NEW_PIN";

export default function PinEntry() {
  const user = useAuthStore((state) => state.user);
  const isPinSet = user?.isTransactionPinSet;
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromWithdrawal = searchParams.get("from") === "withdrawal";

  let withdrawalIntent: { amount: number; bank: any } | null = null;
  if (fromWithdrawal && searchParams.get("intent")) {
    try {
      withdrawalIntent = JSON.parse(searchParams.get("intent") as string);
    } catch (err) {
      console.error("Failed to parse withdrawal intent", err);
    }
  }

  let initialScreen: PinScreenType;
  if (fromWithdrawal) {
    initialScreen = isPinSet ? "ENTER_PIN" : "NEW_PIN";
  } else {
    initialScreen = isPinSet ? "CURRENT_PIN" : "NEW_PIN";
  }

  const [currentScreen, setCurrentScreen] =
    useState<PinScreenType>(initialScreen);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawalComplete, setWithdrawalComplete] = useState(false);

  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const maxPinLength = 4;

  const { modalState, showSuccessModal, showErrorModal, hideModal } =
    useStatusModal();

  const updateCurrentPin = (value: string) => {
    if (fromWithdrawal) {
      if (currentScreen === "ENTER_PIN" || currentScreen === "NEW_PIN") {
        setNewPin(value);
      } else {
        setConfirmPin(value);
      }
    } else {
      switch (currentScreen) {
        case "CURRENT_PIN":
          setCurrentPin(value);
          break;
        case "NEW_PIN":
        case "CONFIRM_NEW_PIN":
          setNewPin(value);
          break;
        case "CREATE_NEW_PIN":
        case "CONFIRM_PIN":
          setConfirmPin(value);
          break;
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (isProcessing) return;
    setError("");
    let currentValue = "";
    if (fromWithdrawal) {
      currentValue =
        currentScreen === "ENTER_PIN" || currentScreen === "NEW_PIN"
          ? newPin
          : confirmPin;
    } else {
      switch (currentScreen) {
        case "CURRENT_PIN":
          currentValue = currentPin;
          break;
        case "NEW_PIN":
        case "CONFIRM_NEW_PIN":
          currentValue = newPin;
          break;
        case "CREATE_NEW_PIN":
        case "CONFIRM_PIN":
          currentValue = confirmPin;
          break;
      }
    }
    if (key === "backspace") {
      updateCurrentPin(currentValue.slice(0, -1));
    } else if (currentValue.length < maxPinLength) {
      const newValue = currentValue + key;
      updateCurrentPin(newValue);
      if (newValue.length === maxPinLength) {
        setTimeout(() => handlePinComplete(newValue), 300);
      }
    }
  };

  const handlePinComplete = async (completedPin: string) => {
    if (isProcessing) return;

    if (fromWithdrawal) {
      if (isPinSet) {
        await processWithdrawal(completedPin);
      } else {
        if (currentScreen === "NEW_PIN") {
          setNewPin(completedPin);
          setConfirmPin("");
          setCurrentScreen("CONFIRM_PIN");
        } else if (currentScreen === "CONFIRM_PIN") {
          if (completedPin !== newPin) {
            setError("PINs do not match. Please try again.");
            setConfirmPin("");
          } else {
            setIsProcessing(true);
            try {
              await transactionPin({ pin: newPin });
              await processWithdrawal(newPin);
            } catch (error) {
              handleApiError(
                error,
                showErrorModal,
                "Failed to create PIN",
                "Error"
              );
            } finally {
              setIsProcessing(false);
            }
          }
        }
      }
    } else if (isPinSet) {
      switch (currentScreen) {
        case "CURRENT_PIN":
          setCurrentPin(completedPin);
          setNewPin("");
          setCurrentScreen("CONFIRM_NEW_PIN");
          break;
        case "CONFIRM_NEW_PIN":
          setNewPin(completedPin);
          setConfirmPin("");
          setCurrentScreen("CREATE_NEW_PIN");
          break;
        case "CREATE_NEW_PIN":
          if (completedPin !== newPin) {
            setError("New PINs do not match. Please try again.");
            setConfirmPin("");
          } else {
            setIsProcessing(true);
            try {
              await changePin({ oldPin: currentPin, newPin });
              showSuccessModal(
                "Transaction PIN updated successfully!",
                "Success"
              );
            } catch (error) {
              handleApiError(
                error,
                showErrorModal,
                "Failed to update PIN",
                "Error"
              );
              setCurrentPin("");
              setNewPin("");
              setConfirmPin("");
              setCurrentScreen("CURRENT_PIN");
            } finally {
              setIsProcessing(false);
            }
          }
          break;
      }
    } else {
      switch (currentScreen) {
        case "NEW_PIN":
          setNewPin(completedPin);
          setConfirmPin("");
          setCurrentScreen("CONFIRM_PIN");
          break;
        case "CONFIRM_PIN":
          if (completedPin !== newPin) {
            setError("PINs do not match. Please try again.");
            setConfirmPin("");
          } else {
            setIsProcessing(true);
            try {
              await transactionPin({ pin: newPin });
              showSuccessModal(
                "Transaction PIN created successfully!",
                "Success"
              );
            } catch (error) {
              handleApiError(
                error,
                showErrorModal,
                "Failed to create PIN",
                "Error"
              );
            } finally {
              setIsProcessing(false);
            }
          }
          break;
      }
    }
  };

  const processWithdrawal = async (pin: string) => {
    if (!withdrawalIntent) {
      showErrorModal("Missing withdrawal information", "Error");
      return;
    }
    setIsProcessing(true);
    try {
      let accountId: string;
      if (typeof withdrawalIntent.bank === "string") {
        accountId = withdrawalIntent.bank;
      } else {
        const res = await addBankAccount({
          bankId: withdrawalIntent.bank.bankId,
          accountNumber: withdrawalIntent.bank.accountNumber,
        });
        accountId = res.data.id;
      }
      await WithdrawalService({
        amount: withdrawalIntent.amount,
        accountId,
        pin,
      });
      const setUser = useAuthStore.getState().setUser;

      const updatedBalance = user?.balance! - withdrawalIntent.amount;

      setUser({
        ...user!,
        balance: updatedBalance,
      });

      // Mark withdrawal as complete so we know to show the modal
      setWithdrawalComplete(true);

      showSuccessModal(
        `The processing of your withdrawal request for ₦${withdrawalIntent.amount.toLocaleString()} is underway, leaving your balance at ₦${updatedBalance.toLocaleString()}.`,
        "Success"
      );
    } catch (error) {
      handleApiError(
        error,
        showErrorModal,
        "Failed to make withdrawal",
        "Error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalClose = () => {
    hideModal();
    if (modalState.type === "success") {
      if (fromWithdrawal && withdrawalComplete) {
        router.replace("/wallet");
      } else {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const handleBack = () => {
    if (isProcessing) return;
    if (fromWithdrawal) {
      if (currentScreen === "CONFIRM_PIN") {
        setCurrentScreen(isPinSet ? "ENTER_PIN" : "NEW_PIN");
        setConfirmPin("");
      } else {
        router.back();
      }
    } else if (isPinSet) {
      switch (currentScreen) {
        case "CREATE_NEW_PIN":
          setCurrentScreen("CONFIRM_NEW_PIN");
          setConfirmPin("");
          break;
        case "CONFIRM_NEW_PIN":
          setCurrentScreen("CURRENT_PIN");
          setNewPin("");
          break;
        case "CURRENT_PIN":
          router.back();
          break;
      }
    } else {
      switch (currentScreen) {
        case "CONFIRM_PIN":
          setCurrentScreen("NEW_PIN");
          setConfirmPin("");
          break;
        case "NEW_PIN":
          router.back();
          break;
      }
    }
  };

  const getScreenTitle = () => {
    if (fromWithdrawal) {
      if (isPinSet)
        return currentScreen === "ENTER_PIN"
          ? "Enter Transaction PIN"
          : "Confirm Transaction PIN";
      return currentScreen === "NEW_PIN"
        ? "Create Transaction PIN"
        : "Confirm Transaction PIN";
    } else if (isPinSet) {
      switch (currentScreen) {
        case "CURRENT_PIN":
          return "Enter Current Transaction PIN";
        case "CONFIRM_NEW_PIN":
          return "Enter New Transaction PIN";
        case "CREATE_NEW_PIN":
          return "Confirm New Transaction PIN";
      }
    } else {
      switch (currentScreen) {
        case "NEW_PIN":
          return "Create Transaction PIN";
        case "CONFIRM_PIN":
          return "Confirm Transaction PIN";
      }
    }
    return "";
  };

  const getCurrentPinValue = () => {
    if (fromWithdrawal) {
      return currentScreen === "ENTER_PIN" || currentScreen === "NEW_PIN"
        ? newPin
        : confirmPin;
    }
    if (isPinSet) {
      switch (currentScreen) {
        case "CURRENT_PIN":
          return currentPin;
        case "CONFIRM_NEW_PIN":
          return newPin;
        case "CREATE_NEW_PIN":
          return confirmPin;
      }
    } else {
      switch (currentScreen) {
        case "NEW_PIN":
          return newPin;
        case "CONFIRM_PIN":
          return confirmPin;
      }
    }
    return "";
  };

  const formattedWithdrawalAmount =
    withdrawalIntent && typeof withdrawalIntent.amount === "number"
      ? `₦${withdrawalIntent.amount.toLocaleString()}`
      : "";

  return (
    <div className={`${backgroundColor} min-h-screen`}>
      <div className="flex flex-col px-6 pt-2 h-full">
        <BackButton
          title=""
          iconColor={isDarkMode ? "white" : "black"}
          onPress={handleBack}
        />
        {fromWithdrawal && withdrawalIntent && (
          <div className="flex items-center justify-center mb-4">
            <p
              className={`${
                isDarkMode ? "text-white" : "text-black"
              } text-4xl font-bold`}
            >
              {formattedWithdrawalAmount}
            </p>
          </div>
        )}
        <div className="flex items-center justify-center mb-8 mt-8">
          <p
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-xl font-medium`}
          >
            {getScreenTitle()}
          </p>
        </div>
        <PinInput value={getCurrentPinValue() ?? ""} maxLength={maxPinLength} />
        {error ? (
          <p className="text-red-500 text-center mb-4">{error}</p>
        ) : null}
        <NumericKeypad onKeyPress={handleKeyPress} />
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}

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
}
