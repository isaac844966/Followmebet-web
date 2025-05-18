"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import { useStatusModal } from "@/lib/contexts/useStatusModal";

import { handleApiError } from "@/lib/utils/handleApiError";
import BackButton from "@/components/BackButton";
import BalanceCard from "@/components/BalanceCard";
import AmountInput from "@/components/AmountInput";
import CustomSelect from "@/components/CustomSelect";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import StatusModal from "@/components/StatusModal";
import { addBankAccount, fetchBanks, getBankAccounts } from "@/lib/services/bank-service";

const Withdraw = () => {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const { modalState, showSuccessModal, showErrorModal, hideModal } =
    useStatusModal();

  // States for Withdraw (existing bank accounts)
  const [amount, setAmount] = useState("100");
  const [banks, setBanks] = useState<any[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState("");

  // States for Add New Bank (when no saved bank exists)
  const [availableBanks, setAvailableBanks] = useState<any[]>([]);
  const [tempBankId, setTempBankId] = useState("");
  const [tempAccountNumber, setTempAccountNumber] = useState("");
  const [addBankLoading, setAddBankLoading] = useState(false);

  const accountName = user
    ? `${user.firstname || ""} ${user.lastname || ""}`.trim()
    : "";

  // Modal close handler
  const handleModalClose = () => {
    hideModal();
  };

  // Fetch user's saved bank accounts
  useEffect(() => {
    const fetchUserBanks = async () => {
      setBanksLoading(true);
      try {
        const response = await getBankAccounts();
        setBanks(response.data.items);
      } catch (error) {
        console.error("Failed to fetch user bank accounts:", error);
      } finally {
        setBanksLoading(false);
      }
    };
    fetchUserBanks();
  }, []);

  // If banks exist and none is selected, choose the first saved bank
  useEffect(() => {
    if (banks.length > 0 && !selectedBankId) {
      setSelectedBankId(banks[0].id);
    }
  }, [banks, selectedBankId]);

  // Fetch available banks for new bank addition
  useEffect(() => {
    const loadAvailableBanks = async () => {
      try {
        const response = await fetchBanks();
        setAvailableBanks(response.data.items);
      } catch (error) {
        console.error("Failed to load available banks:", error);
      }
    };
    loadAvailableBanks();
  }, []);

  // Handlers for Bank Selection and New Bank Form
  const existingBankOptions = banks.map((bankItem) => ({
    label: `${bankItem.bank.name} - ${bankItem.accountNumber}`,
    value: bankItem.id,
  }));

  const handleSelectBank = (val: string) => {
    setSelectedBankId(val);
  };

  const newBankSelectOptions = availableBanks.map((bank) => ({
    label: bank.name,
    value: bank.id,
  }));

  // Synchronous New Bank Form Validation
  const validateNewBankForm = (): {
    isValid: boolean;
    errors: { bankId: string; accountNumber: string };
  } => {
    let isValid = true;
    const errors = { bankId: "", accountNumber: "" };

    if (!tempBankId) {
      errors.bankId = "Please select a bank";
      isValid = false;
    }
    if (!tempAccountNumber) {
      errors.accountNumber = "Account number is required";
      isValid = false;
    } else if (tempAccountNumber.length !== 10) {
      errors.accountNumber = "Account number must be 10 digits";
      isValid = false;
    } else if (!/^\d+$/.test(tempAccountNumber)) {
      errors.accountNumber = "Account number must contain only digits";
      isValid = false;
    }

    return { isValid, errors };
  };

  // Handle Withdraw Press
  const handleWithdrawPress = async () => {
    const numericAmount = Number.parseInt(amount.replace(/,/g, "") || "0");
    if (numericAmount < 100) {
      setAmount("100");
      showErrorModal("Minimum withdrawal amount is 100", "Invalid Amount");
      return;
    }

    // If using an existing bank, proceed directly.
    if (banks.length > 0) {
      if (!selectedBankId) {
        showErrorModal("Please select a bank account", "Bank Required");
        return;
      }

      // Redirect to the PIN entry screen with withdrawal intent.
      router.push(
        `/settings/pin-entry?from=withdrawal&intent=${JSON.stringify({
          amount: numericAmount,
          bank: selectedBankId,
        })}`
      );
      return;
    }

    // For new bank accounts, validate the form.
    const { isValid, errors } = validateNewBankForm();
    if (!isValid) {
      if (errors.bankId) {
        showErrorModal(errors.bankId, "Bank Selection Error");
        return;
      }
      if (errors.accountNumber) {
        showErrorModal(errors.accountNumber, "Account Number Error");
        return;
      }
      return;
    }

    // Always save the bank account before proceeding.
    setAddBankLoading(true);
    try {
      const addBankResponse = await addBankAccount({
        bankId: tempBankId,
        accountNumber: tempAccountNumber,
      });

      // Bank was added successfully, proceed to PIN entry screen.
      router.push(
        `/settings/pin-entry?from=withdrawal&intent=${JSON.stringify({
          amount: numericAmount,
          bank: addBankResponse.data.id,
        })}`
      );
    } catch (error) {
      // Handle the error by showing an error modal.
      handleApiError(
        error,
        showErrorModal,
        "Failed to add bank account for withdrawal",
        "Error"
      );
    } finally {
      setAddBankLoading(false);
    }
  };

  return (
    <div className={`flex-1 min-h-screen ${backgroundColor}`}>
      <div className="pt-4 px-4 max-w-md mx-auto">
        <BackButton title="Withdrawal" onPress={() => router.push("/wallet")} />

        <div className="flex-1 pb-24">
          <BalanceCard />

          <p
            className={`${
              isDarkMode ? "text-white" : "text-primary-1400"
            } text-base mb-2 mt-4`}
          >
            Withdraw Amount
          </p>

          <AmountInput amount={amount} setAmount={setAmount} minAmount={100} />

          {/* Bank Selection Section */}
          {banksLoading ? (
            <div className="flex justify-center mt-4 mb-6">
              <div className="w-6 h-6 border-2 border-t-transparent border-primary-400 rounded-full animate-spin"></div>
            </div>
          ) : banks.length > 0 ? (
            <CustomSelect
              label="Select Bank"
              placeholder="Select a bank"
              options={existingBankOptions}
              value={selectedBankId}
              onChange={handleSelectBank}
            />
          ) : (
            <>
              <CustomSelect
                label="Select Bank"
                placeholder="Select a bank"
                options={newBankSelectOptions}
                value={tempBankId}
                onChange={(value) => setTempBankId(value)}
              />
              <CustomInput
                label="Account Number"
                placeholder="Enter account number"
                value={tempAccountNumber}
                onChangeText={(value) => setTempAccountNumber(value)}
                maxLength={10}
              />
              <CustomInput
                label="Account Name"
                value={accountName}
                editable={false}
              />
              <p
                className={`${
                  isDarkMode ? "text-white/70" : "text-gray-500"
                } text-sm mt-2 mb-4`}
              >
                Bank account will be saved for future withdrawals
              </p>
            </>
          )}

          {/* Withdraw Button */}
          <CustomButton
            title={`Withdraw ${amount ? amount : "0"}`}
            size="lg"
            loading={addBankLoading}
            onClick={handleWithdrawPress}
            className="w-full"
          />
        </div>
      </div>

      {/* Status Modal */}
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

export default Withdraw;
