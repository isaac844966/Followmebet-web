"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import {
  passwordverifyOtp,
  requestPasswordReset,
} from "@/lib/services/authService";
import { handleApiError } from "@/lib/utils/handleApiError";
import BackButton from "@/components/BackButton";
import OtpInput from "@/components/OtpInput";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import toast from "react-hot-toast";
import StatusModal from "@/components/StatusModal";
import { useStatusModal } from "@/lib/contexts/useStatusModal";

const ForgetPasswordOTP = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loadingNumber, setLoadingNumber] = useState(true);
  const {
    modalState,
    showErrorModal,
    showSuccessModal,
    hideModal: hideStatusModal,
  } = useStatusModal();
  useEffect(() => {
    const getMobile = async () => {
      try {
        const mobile = localStorage.getItem("registeredMobile");
        if (mobile) {
          setPhoneNumber(mobile);
        }
      } catch (error) {
        console.error("Error fetching mobile number:", error);
        toast.error("Failed to load your mobile number.");
      } finally {
        setLoadingNumber(false);
      }
    };

    getMobile();
  }, []);

  const handleVerify = async () => {
    const newErrors: { password?: string } = {};

    if (!password || password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error("OTP must be exactly 6 digits.");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await passwordverifyOtp(otp, password);
      showSuccessModal(
        "Password Reset",
        "Your password has been reset. You can now log in with your new password."
      );

      // Clear local storage
      localStorage.removeItem("registeredMobile");
      localStorage.removeItem("passwordResetToken");

      // Redirect to login
      router.replace("/login");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      handleApiError(
        error,
        showErrorModal,
        "Failed to reset password",
        "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!resendDisabled) {
      setResendDisabled(true);
      setResendLoading(true);
      setCountdown(30);

      try {
        const mobile = localStorage.getItem("registeredMobile");
        await requestPasswordReset(`${mobile}`);
      } catch (error: any) {
        console.error("Resend OTP error:", error);
        handleApiError(error, showErrorModal, "Failed to resend OTP", "Error");
        setResendDisabled(false);
        setCountdown(0);
      } finally {
        setResendLoading(false);
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);

  const handleModalClose = () => {
    hideStatusModal();
    if (modalState.type === "success") {
     
      router.replace("/(auth)");
    }
  };
  return (
    <div className="flex-1 min-h-screen py-6">
      <BackButton title="Verification" />
      <div className="flex-1 px-4 mt-6 max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`${
              isDarkMode ? "text-white" : "text-black font-bold"
            } text-3xl font-bold mb-2`}
          >
            Enter OTP
          </h1>
          <p
            className={`${
              isDarkMode ? "text-gray-400" : "text-primary-600"
            } mb-1`}
          >
            Check your SMS message.
          </p>
          <p
            className={`${
              isDarkMode ? "text-gray-400" : "text-primary-600"
            } mb-4`}
          >
            We have sent you a 6 digit pin at {phoneNumber}.
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-4">
          <OtpInput length={6} value={otp} onChange={setOtp} autoFocus={true} />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <CustomInput
            label="New Password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value.trim().length >= 6) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            isPassword={true}
            error={errors.password}
          />
        </div>

        {/* Verify Button */}
        <CustomButton
          title="Verify"
          size="lg"
          loading={loading}
          onClick={handleVerify}
          disabled={otp.length !== 6 || loading}
          buttonStyle={{ marginBottom: 24 }}
          className="w-full"
        />

        {/* Resend Code */}
        <div className="items-center flex justify-center">
          <div className="flex items-center">
            <p
              className={`${isDarkMode ? "text-gray-400" : "text-primary-600"}`}
            >
              Didn&apos;t receive SMS?{" "}
            </p>
            <button
              onClick={handleResend}
              disabled={resendDisabled}
              className={`${
                resendDisabled ? "text-gray-500" : "text-primary-400"
              } font-medium ml-1`}
            >
              {resendDisabled ? `Resend Code (${countdown}s)` : "Resend Code"}
            </button>
          </div>
        </div>
      </div>
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

export default ForgetPasswordOTP;
