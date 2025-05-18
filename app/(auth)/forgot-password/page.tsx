"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/lib/contexts/ThemeContext"
import { requestPasswordReset } from "@/lib/services/authService"
import { handleApiError } from "@/lib/utils/handleApiError"
import BackButton from "@/components/BackButton"
import PhoneInput from "@/components/PhoneInput"
import CustomButton from "@/components/CustomButton"
import Link from "next/link"
import toast from "react-hot-toast"
import { useStatusModal } from "@/lib/contexts/useStatusModal"
import StatusModal from "@/components/StatusModal"

const ForgetPassword = () => {
  const router = useRouter()
  const { isDarkMode } = useTheme()
 const {
   modalState,
   showErrorModal,
   showSuccessModal,
   hideModal: hideStatusModal,
 } = useStatusModal();
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ phoneNumber?: string }>({})

  const validateForm = () => {
    let isValid = true
    const newErrors: { phoneNumber?: string } = {}

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required"
      isValid = false
    } else {
      const phoneRegex = /^(\+?[0-9]{10,15})$/
      if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ""))) {
        newErrors.phoneNumber = "Please enter a valid phone number"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSendReset = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      let formattedPhoneNumber = phoneNumber
      if (!formattedPhoneNumber.startsWith("+")) {
        formattedPhoneNumber = "+234" + formattedPhoneNumber.replace(/^0+/, "")
      }

      await requestPasswordReset(formattedPhoneNumber)

      router.push("/forgot-password-otp")
    } catch (error) {
        handleApiError(
          error,
          showErrorModal,
          "Failed to send reset link",
          "Error"
        );
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 min-h-screen py-6">
      <BackButton title="Forgot password" />

      <div className="flex-1 px-4 mt-6 max-w-md mx-auto">
        <div className="mb-8">
          <h1
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-3xl font-bold mb-2`}
          >
            Forgot your password
          </h1>
          <p
            className={`${
              isDarkMode ? "text-gray-400" : "text-primary-600"
            } mb-8`}
          >
            Please enter your Followmebet account registered phone number below
            to receive your password reset instructions.
          </p>
        </div>

        <PhoneInput
          placeholder="Mobile Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          error={errors.phoneNumber}
          maxLength={10}
        />
        <div className="mt-6">
          <CustomButton
            title="Send"
            size="lg"
            loading={loading}
            onClick={handleSendReset}
            buttonStyle={{ marginTop: 8, marginBottom: 24 }}
            className="w-full"
          />
        </div>
        <div className="items-center flex justify-center">
          <Link
            href="/login"
            className="text-primary-400 font-medium border-b-2 border-dark-accent-100"
          >
            Back to sign in
          </Link>
        </div>
      </div>
      <StatusModal
        visible={modalState.visible}
        onClose={hideStatusModal}
        title={modalState.title}
        message={modalState.message}
        buttonText={modalState.buttonText}
        type={modalState.type}
      />
    </div>
  );
}

export default ForgetPassword
