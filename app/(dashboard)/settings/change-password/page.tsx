"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useStatusModal } from "@/lib/contexts/useStatusModal";
import { changePassword } from "@/lib/services/changePasswordService";
import BackButton from "@/components/BackButton";
import CustomInput from "@/components/CustomInput";
import StatusModal from "@/components/StatusModal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { handleApiError } from "@/lib/utils/handleApiError";

export default function ChangePassword() {
  const { isDarkMode } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const { modalState, showErrorModal, hideModal, showSuccessModal } =
    useStatusModal();

  const handleChangePassword = async () => {
    setErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
    let isValid = true;

    if (!currentPassword) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: "Current password is required",
      }));
      isValid = false;
    }

    if (!newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "New password is required",
      }));
      isValid = false;
    }

    if (!confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Please confirm your new password",
      }));
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "New password and confirmation do not match",
      }));
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    try {
      await changePassword({
        current_password: currentPassword,
        password: newPassword,
      });

      showSuccessModal("Password changed successfully!", "Success");
    } catch (error: any) {
      console.error("Error changing password:", error);
      handleApiError(
        error,
        showErrorModal,
        "Failed to change password. Please check your internet connection and try again",
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

  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";

  return (
    <div className={`${backgroundColor} min-h-screen`}>
      <BackButton title="Change Password" />
      <div className="flex-1 px-4 mt-6">
        <CustomInput
          placeholder="Enter your password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          isPassword
          label="Current Password"
          error={errors.currentPassword}
        />
        <CustomInput
          placeholder="Enter your password"
          value={newPassword}
          onChangeText={setNewPassword}
          isPassword
          label="New Password"
          error={errors.newPassword}
        />
        <CustomInput
          placeholder="Enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
          label="Confirm New Password"
          error={errors.confirmPassword}
        />
      </div>

      <StatusModal
        visible={modalState.visible}
        onClose={handleModalClose}
        title={modalState.title}
        message={modalState.message}
        buttonText={modalState.buttonText}
        type={modalState.type}
      />

      <div className="fixed bottom-8 left-4 right-4 mx-auto max-w-md">
        <Button
          className="w-full py-6 bg-[#FFA726] hover:bg-[#FF9800] text-black font-semibold"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Change Password
        </Button>
      </div>
    </div>
  );
}
