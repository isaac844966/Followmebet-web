"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import { useStatusModal } from "@/lib/contexts/useStatusModal";
import { editProfile } from "@/lib/services/profileService";
import { fetchUserProfile } from "@/lib/services/authService";
import BackButton from "@/components/BackButton";
import UserProfileForm from "@/components/UserProfileForm";
import StatusModal from "@/components/StatusModal";
import { handleApiError } from "@/lib/utils/handleApiError";

export default function EditProfile() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const user = useAuthStore((state) => state.user);
  const { modalState, showErrorModal, showSuccessModal, hideModal } =
    useStatusModal();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    country: "",
    state: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        nickname: user.nickname || "",
        email: user.email || "",
        country: user.country?.name || "Nigeria",
        state: user.state?.id || "",
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nickname.trim()) newErrors.nickname = "Nickname is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email";
    if (!formData.state) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = {
      email: formData.email.trim(),
      firstname: formData.firstName.trim(),
      lastname: formData.lastName.trim(),
      nickname: formData.nickname.trim(),
      countryId: "1c58d7f9-e93b-11eb-a1e0-060c4acaff96",
      stateId: formData.state,
    };

    setLoading(true);
    try {
      await editProfile(data);
      showSuccessModal("Profile updated successfully!", "Success");
      await fetchUserProfile();
    } catch (error) {
      handleApiError(
        error,
        showErrorModal,
        "Failed to update profile.",
        "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    hideModal();
    if (modalState.type === "success") router.back();
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-[#0B0B3F]" : "bg-white"
      } min-h-screen px-1`}
    >
      <BackButton title="Edit Profile details" />
      <UserProfileForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        errors={errors}
        editableNames={false}
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
