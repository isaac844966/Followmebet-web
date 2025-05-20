"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/lib/contexts/ThemeContext"
import { editProfile } from "@/lib/services/profileService"
import { handleApiError } from "@/lib/utils/handleApiError"
import { login } from "@/lib/services/authService"
import BackButton from "@/components/BackButton"
import UserProfileForm from "@/components/UserProfileForm"
import toast from "react-hot-toast"
import { useStatusModal } from "@/lib/contexts/useStatusModal"
import StatusModal from "@/components/StatusModal"

const AccountSetup = () => {
  const router = useRouter()
  const { isDarkMode } = useTheme()
 const {
   modalState,
   showErrorModal,
   showSuccessModal,
   hideModal: hideStatusModal,
 } = useStatusModal();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    country: "Nigeria",
    state: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)


  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.nickname.trim()) newErrors.nickname = "Nickname is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email"
    if (!formData.state) newErrors.state = "State is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const data = {
        email: formData.email.trim(),
        firstname: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        nickname: formData.nickname.trim(),
        countryId: "1c58d7f9-e93b-11eb-a1e0-060c4acaff96",
        stateId: formData.state,
      }

      await editProfile(data)
      toast.success("Account setup complete!")

      const storedMobile = localStorage.getItem("registeredMobile")
      const storedPassword = localStorage.getItem("userPassword")
      console.log(storedMobile, storedPassword)

      if (storedMobile && storedPassword) {
        try {
          await login({
            mobile: storedMobile,
            password: storedPassword,
          })

          localStorage.removeItem("userPassword")
          router.replace("/dashboard")
        } catch (error) {
          console.log(error)
           handleApiError(
             error,
             showErrorModal,
             "Login failed after account setup",
             "Login Error"
           );
        }
      }
    } catch (error) {
      handleApiError(error, showErrorModal, "Profile update failed", "Profile Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 min-h-screen pb-10">
      <BackButton title="Account Setup" />
      <UserProfileForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        errors={errors}
        showInfoBox
        editableNames
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
  );
}

export default AccountSetup
