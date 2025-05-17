"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useStatusModal } from "@/lib/contexts/useStatusModal";
import { getFaqs } from "@/lib/services/faqs";
import BackButton from "@/components/BackButton";
import FaqList from "@/components/FaqList";
import StatusModal from "@/components/StatusModal";
import { Loader2 } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FaqsPage = () => {
  const { isDarkMode } = useTheme();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { modalState, showErrorModal, hideModal } = useStatusModal();

  const backgroundColor = isDarkMode ? "#0B0B3F" : "#F5F5F5";

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await getFaqs();

      if (response.data && response.data.items) {
        setFaqs(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      showErrorModal(
        "Unable to load FAQs. Please try again later.",
        "Error",
        "OK"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor }}>
      <div className="px-4 pt-4">
        <BackButton title="FAQs" />
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader2
            className={`h-8 w-8 animate-spin ${
              isDarkMode ? "text-white" : "text-[#1E1F68]"
            }`}
          />
        </div>
      ) : faqs.length === 0 ? (
        <div className="flex-1 flex justify-center items-center px-4">
          <div className="text-center">
            <p
              className={`${
                isDarkMode ? "text-white" : "text-gray-700"
              } text-lg font-medium`}
            >
              No FAQs available at the moment.
            </p>
            <button
              className="mt-4 bg-primary-400 px-6 py-3 rounded-lg text-white font-medium"
              onClick={fetchFaqs}
            >
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 px-4 pt-4">
          <FaqList faqs={faqs} />
        </div>
      )}

      <StatusModal
        visible={modalState.visible}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        buttonText={modalState.buttonText}
      />
    </div>
  );
};

export default FaqsPage;
