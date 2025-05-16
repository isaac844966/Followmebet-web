"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/lib/contexts/ThemeContext"
import { useAuthStore } from "@/lib/store/authStore"
import { resendOtp, verifyOtp } from "@/lib/services/authService"
import { handleApiError } from "@/lib/utils/handleApiError"
import BackButton from "@/components/BackButton"
import OtpInput from "@/components/OtpInput"
import CustomButton from "@/components/CustomButton"
// import toast from "react-hot-toast"       
import { useStatusModal } from "@/lib/contexts/useStatusModal"
import StatusModal from "@/components/StatusModal"

const OtpVerification = () => {
  const { isDarkMode } = useTheme()
  const router = useRouter()

  const isLoading = useAuthStore((state) => state.isLoading)
  const setIsLoading = useAuthStore((state) => state.setLoading)
 const {
   modalState,
   showErrorModal,
   showSuccessModal,
   hideModal: hideStatusModal,
 } = useStatusModal();
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [loadingNumber, setLoadingNumber] = useState(true)

  useEffect(() => {
    const getStoredData = async () => {
      try {
        const mobile = localStorage.getItem("registeredMobile")
        const storedPassword = localStorage.getItem("userPassword")

        if (mobile) {
          setPhoneNumber(mobile)
        }

        if (storedPassword) {
          setPassword(storedPassword)
        }
      } catch (error) {
       showErrorModal("Error", "Failed to load your account information.");
      } finally {
        setLoadingNumber(false)
      }
    }

    getStoredData()
  }, [])

  const handleVerify = async () => {
    if (otp.length === 6) {
      setIsLoading(true)
      try {
        if (!phoneNumber || !password) {
          throw new Error("Missing login credentials")
        }

        const res = await verifyOtp(otp, {
          mobile: phoneNumber,
          password: password,
        })

        if (res) {
          router.replace("/account-setup")
        } else {
         showErrorModal("Invalid OTP", "The code you entered is incorrect.");
        }
      } catch (error: any) {
        handleApiError(error, showErrorModal, "Failed to verify OTP", "Error");
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleResend = async () => {
    if (!resendDisabled) {
      setResendDisabled(true)
      setResendLoading(true)
      setCountdown(30)

      try {
        await resendOtp()
        showSuccessModal("OTP Sent", `Code sent to ${phoneNumber}`);
      } catch (error: any) {
        console.error("Resend OTP error:", error)
        handleApiError(error, showErrorModal, "Failed to resend OTP", "Error")
        setResendDisabled(false)
        setCountdown(0)
      } finally {
        setResendLoading(false)
      }
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | any
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false)
    }
    return () => clearTimeout(timer)
  }, [countdown, resendDisabled])

  return (
    <div className="flex-1 min-h-screen py-6">
      <BackButton title="Enter OTP" />
      <div className="flex-1 px-4 mt-6 max-w-md mx-auto">
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
            } mb-8`}
          >
            We have sent you 6 digit pin at {phoneNumber}
          </p>
        </div>

        <div className="mb-8">
          <OtpInput length={6} value={otp} onChange={setOtp} autoFocus={true} />
        </div>

        <CustomButton
          title="Verify"
          size="lg"
          loading={isLoading}
          onClick={handleVerify}
          disabled={otp.length !== 6}
          buttonStyle={{ marginBottom: 24 }}
          className="w-full"
        />

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
        onClose={() => hideStatusModal()}
        title={modalState.title}
        message={modalState.message}
        buttonText={modalState.buttonText}
        type={modalState.type}
      />
    </div>
  );
}

export default OtpVerification
