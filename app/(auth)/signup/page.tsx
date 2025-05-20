"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/lib/contexts/ThemeContext"
import { register } from "@/lib/services/authService"
import { handleApiError } from "@/lib/utils/handleApiError"
import BackButton from "@/components/BackButton"
import PhoneInput from "@/components/PhoneInput"
import CustomInput from "@/components/CustomInput"
import CustomButton from "@/components/CustomButton"
import Link from "next/link"
// import toast from "react-hot-toast"
import { useStatusModal } from "@/lib/contexts/useStatusModal"
import StatusModal from "@/components/StatusModal"

const SignUp = () => {
  const { isDarkMode } = useTheme()
  const router = useRouter()
   const {
     modalState,
     showErrorModal,
     showSuccessModal,
     hideModal: hideStatusModal,
   } = useStatusModal();

  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    phoneNumber?: string
    password?: string
    confirmPassword?: string
  }>({})

  const validateForm = () => {
    let isValid = true
    const newErrors: {
      phoneNumber?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required"
      isValid = false
    } else {
      // Remove whitespace and validate phone number format
      const phoneRegex = /^(\+?[0-9]{10,15})$/
      if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ""))) {
        newErrors.phoneNumber = "Please enter a valid phone number"
        isValid = false
      }
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSignUp = async () => {
    if (!validateForm()) return
    setLoading(true)

    try {
      let formattedPhoneNumber = phoneNumber
      if (!formattedPhoneNumber.startsWith("+")) {
        formattedPhoneNumber = "+234" + formattedPhoneNumber.replace(/^0+/, "")
      }

      const registerData = {
        mobile: formattedPhoneNumber,
        password,
      }

      await register(registerData)

      localStorage.setItem("registeredMobile", formattedPhoneNumber)
      localStorage.setItem("userPassword", password)

      router.replace("/otp")
    } catch (error: any) {
      handleApiError(error, showErrorModal , "Registration failed", "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 min-h-screen  ">
      <BackButton title="Sign up" />
      <div className="flex-1 px-4 mt-10 xs:mt-6 max-w-md mx-auto">
        <h1
          className={`${
            isDarkMode ? "text-white" : "text-black"
          } text-3xl sm:text-2xl xs:text-xl font-bold mb-2`}
        >
          Create your account
        </h1>

        <div className="flex mb-12 sm:mb-10 xs:mb-6">
          <p
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-md xs:text-sm`}
          >
            Already have an account?{" "}
          </p>
          <Link
            href="/login"
            className="text-dark-accent-100 font-medium ml-1 text-md xs:text-sm"
          >
            Login
          </Link>
        </div>

        <PhoneInput
          placeholder="Mobile Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          error={errors.phoneNumber}
          maxLength={10}
        />

        <CustomInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isPassword={true}
          error={errors.password}
        />

        <CustomInput
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isPassword={true}
          error={errors.confirmPassword}
        />

        <CustomButton
          title="Sign Up"
          size="lg"
          loading={loading}
          onClick={handleSignUp}
          buttonStyle={{ marginBottom: 24, marginTop: 40 }}
          className="w-full"
        />
        <StatusModal
          visible={modalState.visible}
          onClose={() => hideStatusModal()}
          title={modalState.title}
          message={modalState.message}
          buttonText={modalState.buttonText}
          type={modalState.type}
        />
      </div>
    </div>
  );
}

export default SignUp
