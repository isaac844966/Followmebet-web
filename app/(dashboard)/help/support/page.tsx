"use client";

import type React from "react";

import { useState } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useStatusModal } from "@/lib/contexts/useStatusModal";
import BackButton from "@/components/BackButton";
import { Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const supportReasons = [
  { label: "My bank card not working", value: "bank_card" },
  { label: "Deposit issue", value: "deposit" },
  { label: "Withdrawal issue", value: "withdrawal" },
  { label: "Account access", value: "account_access" },
  { label: "Betting issue", value: "betting" },
  { label: "Other", value: "other" },
];

const SupportPage = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { showSuccessModal, showErrorModal } = useStatusModal();

  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasonDropdownOpen, setReasonDropdownOpen] = useState(false);

  const backgroundColor = isDarkMode ? "#0B0B3F" : "#fff";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason) {
      showErrorModal(
        "Please select a reason for contacting support",
        "Missing Information"
      );
      return;
    }

    if (!message.trim()) {
      showErrorModal("Please enter a message", "Missing Information");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showSuccessModal(
        "Your message has been sent successfully. We'll get back to you within 48 hours.",
        "Message Sent"
      );

      // Reset form
      setReason("");
      setMessage("");

      // Navigate back after a short delay
      setTimeout(() => {
        router.push("/help");
      }, 2000);
    } catch (error) {
      showErrorModal(
        "There was a problem sending your message. Please try again.",
        "Error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedReasonLabel =
    supportReasons.find((item) => item.value === reason)?.label ||
    "Select a reason";

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor }}>
      <div className="px-4 pt-4">
        <BackButton title="Support" />
      </div>

      <div className="flex-1 px-4 py-6">
        <p className={`${isDarkMode ? "text-white" : "text-gray-700"} mb-2`}>
          If you would like to contact us for any reason then please fill out
          the form below.
        </p>
        <p className={`${isDarkMode ? "text-white/70" : "text-gray-500"} mb-6`}>
          We try to answer all messages within 48 hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className={`block mb-2 font-medium ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Reason
            </label>
            <div className="relative">
              <button
                type="button"
                className={`w-full text-left px-4 py-5 rounded-lg flex justify-between items-center ${
                  isDarkMode
                    ? "bg-primary-1400 text-white"
                    : "bg-primary-1200 text-gray-700"
                }`}
                onClick={() => setReasonDropdownOpen(!reasonDropdownOpen)}
                disabled={isSubmitting}
              >
                <span>{selectedReasonLabel}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    reasonDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {reasonDropdownOpen && (
                <div
                  className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg ${
                    isDarkMode ? "bg-primary-1300" : "bg-white"
                  }`}
                >
                  {supportReasons.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`block w-full text-left px-4 py-3 ${
                        isDarkMode
                          ? "text-white hover:bg-primary-1200"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${item.value === reason ? "bg-primary-400/20" : ""}`}
                      onClick={() => {
                        setReason(item.value);
                        setReasonDropdownOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              className={`block mb-2 font-medium ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Message
            </label>
            <textarea
              className={`w-full px-4 py-4 rounded-lg resize-none h-40 ${
                isDarkMode
                  ? "bg-primary-1400 text-white"
                  : "bg-primary-1200 text-gray-700"
              }`}
              placeholder="Type here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-lg flex items-center justify-center font-medium text-white ${
              isSubmitting ? "bg-primary-400/70" : "bg-primary-400"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <span>Send Message</span>
                <Mail className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportPage;
