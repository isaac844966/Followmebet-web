"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useStatusModal } from "@/lib/contexts/useStatusModal";
import { useBankStore } from "@/lib/store/bankStore";
import BackButton from "@/components/BackButton";
import EmptyState from "@/components/EmptyState";
import BankCard from "@/components/BankCard";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/CustomModal";
import StatusModal from "@/components/StatusModal";
import { Loader2, Plus } from "lucide-react";
import { deleteBankAccount, getBankAccounts } from "@/lib/services/bank-service";
import { handleApiError } from "@/lib/utils/handleApiError";

interface BankAccount {
  id: string;
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountName?: string;
}

export default function Banks() {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const {
    modalState,
    showErrorModal,
    showSuccessModal,
    hideModal: hideStatusModal,
  } = useStatusModal();

  const {
    bankAccounts,
    setBankAccounts,
    deleteBankAccount: removeFromStore,
  } = useBankStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bankToDelete, setBankToDelete] = useState<BankAccount | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Monitor network connection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    fetchBankAccounts();
  }, [isOnline]);

  const fetchBankAccounts = async () => {
    // Don't try to fetch if offline
    if (!isOnline) {
      setLoading(false);
      setIsRefreshing(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getBankAccounts();

      if (response.data && response.data.items) {
        const processedAccounts = response.data.items.map((account: any) => {
          return {
            id: account.id || String(Date.now() + Math.random()),
            bankId: account.bankId || account.bank?.id || "",
            bankName:
              account.bankName ||
              account.bank?.name ||
              (account.bank && typeof account.bank === "string"
                ? account.bank
                : "Unknown Bank"),
            accountNumber: account.accountNumber || "",
            accountName: account.accountName || "",
          };
        });

        setBankAccounts(processedAccounts);
      } else {
        setError("Failed to load bank accounts: unexpected data format");
      }
    } catch (error) {
      handleApiError(
        error,
        showErrorModal,
        "Failed to fetch bank accounts. Please check your internet connection and try again",
        "Error"
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDeleteBank = (bank: BankAccount) => {
    // Only show modal if we have internet
    if (isOnline) {
      setBankToDelete(bank);
      setModalVisible(true);
    } else {
      showErrorModal(
        "No internet connection. Please check your connection and try again.",
        "Network Error"
      );
    }
  };

  const confirmDeleteBank = async () => {
    if (!bankToDelete) return;

    // Check for internet connection before proceeding
    if (!isOnline) {
      setModalVisible(false);
      showErrorModal(
        "No internet connection. Please check your connection and try again.",
        "Network Error"
      );
      return;
    }

    setDeletingId(bankToDelete.id);
    setModalVisible(false);

    try {
      await deleteBankAccount(bankToDelete.id);
      removeFromStore(bankToDelete.id);
      showSuccessModal("Bank account deleted successfully", "Success");
    } catch (error) {
      console.error("Error deleting bank account:", error);
      handleApiError(
        error,
        showErrorModal,
        "Failed to delete bank account. Please try again later.",
        "Error"
      );
    } finally {
      setDeletingId(null);
      setBankToDelete(null);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBankAccounts();
  };

  return (
    <div className={`${backgroundColor} min-h-screen px-4`}>
      <BackButton title="Banks" />

      <div className="flex-1 px-4 mt-6 pb-24">
        {loading && !isRefreshing ? (
          <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : !isOnline && bankAccounts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <EmptyState
              type="network"
              isDarkMode={isDarkMode}
              textColor={isDarkMode ? "text-gray-300" : "text-gray-600"}
              message={"You're offline"}
              subMessage={"Connect to the internet to view your bank accounts"}
            />
          </div>
        ) : bankAccounts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <EmptyState
              type="bank"
              isDarkMode={isDarkMode}
              textColor={isDarkMode ? "text-gray-300" : "text-gray-600"}
              message="No bank accounts found"
              subMessage="Add a bank account to get started"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {isRefreshing && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}

            {bankAccounts.map((item) => (
              <BankCard
                key={item.id}
                bank={item}
                onDelete={() => handleDeleteBank(item)}
                isDeleting={deletingId === item.id}
              />
            ))}

            <button
              className="w-full py-4 text-blue-500 font-medium"
              onClick={handleRefresh}
              disabled={!isOnline || isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Pull to refresh"}
            </button>
          </div>
        )}

        {/* Add Bank Button */}
        <div className="fixed bottom-8 left-4 right-4 mx-auto max-w-md">
          <Button
            className="w-full py-6 bg-[#FFA726] hover:bg-[#FF9800] text-black font-semibold"
            onClick={() => router.push("/settings/add-bank")}
            disabled={loading || !isOnline}
          >
            <Plus size={20} className="mr-2" />
            Add New Bank
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal - Only show if we have internet */}
      {isOnline && (
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Delete Bank Account"
          message={
            bankToDelete
              ? `Are you sure you want to delete your ${
                  bankToDelete.bankName
                } account ending with ${bankToDelete.accountNumber.slice(
                  -4
                )}? This action cannot be undone.`
              : "Are you sure you want to delete this bank account?"
          }
          primaryButtonText="Yes, Delete"
          secondaryButtonText="Cancel"
          onPrimaryButtonPress={confirmDeleteBank}
          onSecondaryButtonPress={() => setModalVisible(false)}
          primaryButtonColor="#FC0900"
          primaryTextColor="#FFFFFF"
        />
      )}

      {/* Status Modal */}
      <StatusModal
        visible={modalState.visible}
        onClose={() => hideStatusModal()}
        title={modalState.title}
        message={modalState.message}
        buttonText={modalState.buttonText}
        type={modalState.type}
      />
    </div>
  );
}
