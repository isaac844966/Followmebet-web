"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import { useStatusModal } from "@/lib/contexts/useStatusModal";
import { uploadAvatar } from "@/lib/services/profileService";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import StatusModal from "@/components/StatusModal";
import { Loader2, Upload } from "lucide-react";
import { handleApiError } from "@/lib/utils/handleApiError";

export default function EditProfilePicture() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { modalState, showErrorModal, showSuccessModal, hideModal } =
    useStatusModal();

  const avatarUrl = user?.avatarUrl || "";

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showErrorModal("File size should be less than 5MB", "Error");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      showErrorModal("Please select an image file", "Error");
      return;
    }

    setNewImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setNewImagePreview(imageUrl);
  };

  const handleSave = async () => {
    if (!newImageFile || !user) return;

    setLoading(true);
    try {
      // Convert file to base64
      const base64 = await fileToBase64(newImageFile);

      await uploadAvatar(base64.split(",")[1]); // Remove data:image/jpeg;base64, part

      setUser({
        ...user,
        avatarUrl: newImagePreview || avatarUrl,
      });

      setNewImageFile(null);
      setNewImagePreview(null);
      showSuccessModal("Profile picture updated successfully!", "Success");
    } catch (error: any) {
      handleApiError(
        error,
        showErrorModal,
        "Failed to upload profile picture. Please check your internet connection and try again",
        "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleModalClose = () => {
    hideModal();
    if (modalState.type === "success") {
      router.back();
    }
  };

  return (
    <div className={`${backgroundColor} min-h-screen`}>
      <div className="px-4">
        <BackButton title="Edit Profile picture" />

        <div className="flex flex-col items-center mt-6">
          <div
            className={`w-52 h-52 mt-10 rounded-full mb-8 relative overflow-hidden ${
              isDarkMode ? "bg-primary-400" : "bg-primary-1900"
            }`}
            style={{ border: "2px solid #FFFFFF" }}
          >
            <Image
              src={
                newImagePreview ||
                avatarUrl ||
                "/placeholder.svg?height=208&width=208"
              }
              alt="Profile"
              fill
              sizes="208px"
              className="object-cover"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="w-full mt-12">
            <Button
              className="w-full py-6 bg-[#FFA726] hover:bg-[#FF9800] text-black font-semibold"
              onClick={newImagePreview ? handleSave : handleUpload}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {newImagePreview ? (
                "Save Changes"
              ) : (
                <>
                  <Upload size={20} className="mr-2" />
                  Upload Picture
                </>
              )}
            </Button>
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
    </div>
  );
}
