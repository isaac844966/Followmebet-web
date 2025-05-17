"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import { useBankStore } from "@/lib/store/bankStore";
import { useStatusModal } from "@/lib/contexts/useStatusModal";
import BackButton from "@/components/BackButton";
import CustomSelect from "@/components/CustomSelect";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import StatusModal from "@/components/StatusModal";
import { Loader2 } from "lucide-react";
import { addBankAccount, fetchBanks } from "@/lib/services/bank-service";
import { handleApiError } from "@/lib/utils/handleApiError";
import CustomButton from "@/components/CustomButton";

interface Bank {
  id: string;
  name: string;
}

interface BankOption {
  label: string;
  value: string;
}

export default function AddBank() {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const addBankAccount_Store = useBankStore((state) => state.addBankAccount);

  const [banks, setBanks] = useState<BankOption[]>([]);
  const [bankId, setBankId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ bankId: "", accountNumber: "" });
  const [apiError, setApiError] = useState<string | null>(null);

  const { modalState, showSuccessModal, showErrorModal, hideModal } =
    useStatusModal();

  const accountName = user
    ? `${user.firstname || ""} ${user.lastname || ""}`
    : "";

  useEffect(() => {
    const loadBanks = async () => {
      try {
        const response = await fetchBanks();

        if (response.data && response.data.items) {
          const bankOptions = response.data.items.map((bank: Bank) => ({
            label: bank.name,
            value: bank.id,
          }));

          setBanks(bankOptions);
        } else {
          setApiError("Failed to load banks: unexpected data format");
        }
      } catch (error) {
        handleApiError(
          error,
          showErrorModal,
          "Failed to fetch banks. Please check your internet connection and try again",
          "Error"
        );
      }
    };

    loadBanks();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { bankId: "", accountNumber: "" };

    if (!bankId) {
      newErrors.bankId = "Please select a bank";
      isValid = false;
    }

    if (!accountNumber) {
      newErrors.accountNumber = "Account number is required";
      isValid = false;
    } else if (accountNumber.length !== 10) {
      newErrors.accountNumber = "Account number must be 10 digits";
      isValid = false;
    } else if (!/^\d+$/.test(accountNumber)) {
      newErrors.accountNumber = "Account number must contain only digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleBankChange = (value: string) => {
    setBankId(value);
    if (errors.bankId) {
      setErrors((prev) => ({ ...prev, bankId: "" }));
    }
  };

  const handleAccountNumberChange = (value: string) => {
    setAccountNumber(value);
    if (errors.accountNumber) {
      setErrors((prev) => ({ ...prev, accountNumber: "" }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const selectedBank = banks.find((bank) => bank.value === bankId);
    const bankName = selectedBank?.label || "Unknown Bank";

    const existingBank = useBankStore
      .getState()
      .bankAccounts.find(
        (bank) =>
          bank.bankId === bankId &&
          bank.accountNumber.slice(-4) === accountNumber.slice(-4)
      );

    if (existingBank) {
      showErrorModal(
        "This bank and account number already exist.",
        "Bank already exists"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await addBankAccount({ bankId, accountNumber });
      const maskedAccountNumber = "XXXXXX" + accountNumber.slice(-4);
      const bankData = {
        id: response.data?.id || String(Date.now()),
        bankId,
        bankName,
        accountNumber: maskedAccountNumber,
        accountName,
      };

      addBankAccount_Store(bankData);
      showSuccessModal("Bank account added successfully!", "Success");
    } catch (error: any) {
      console.error("Add bank error:", error);
      handleApiError(error, showErrorModal, "Failed to add bank account");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    hideModal();
    if (modalState.type === "success") {
      router.back();
    }
  };

  return (
    <div className={`${backgroundColor} min-h-screen pt-6 px-2`}>
      <BackButton title="Add Bank Account" />

      <div className="flex-1  mt-6 pb-32">
        {apiError && <p className="text-red-500 mb-4">{apiError}</p>}

        <CustomSelect
          label="Select Bank"
          placeholder="Select a bank"
          options={banks}
          value={bankId}
          onChange={handleBankChange}
          error={errors.bankId}
        />

        <CustomInput
          label="Account Number"
          placeholder="Enter account number"
          value={accountNumber}
          onChangeText={handleAccountNumberChange}
          maxLength={10}
          error={errors.accountNumber}
        />

        <CustomInput
          label="Account Name"
          value={accountName}
          editable={false}
        />
      </div>

     
      <CustomButton
        title="Save"
        onClick={handleSave}
        disabled={loading}
        className="w-full "
        loading={loading}
      />

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
