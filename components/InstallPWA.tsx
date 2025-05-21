"use client";

import usePWAInstallPrompt from "@/hooks/usePWAIntsallPrompt";
import { useState } from "react";
import CustomModal from "./CustomModal";

export default function InstallPrompt() {
  const { isInstallable, promptInstall } = usePWAInstallPrompt();
  const [isModalVisible, setIsModalVisible] = useState(true);

  if (!isInstallable) return null;

  const handleInstall = async () => {
    const installed = await promptInstall();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <CustomModal
      visible={isInstallable && isModalVisible}
      onClose={handleCancel}
      title="Install FollowMeBet"
      message="Add to your home screen for quicker access and a smoother experience."
      primaryButtonText="Install Now"
      secondaryButtonText="Not Now"
      onPrimaryButtonPress={handleInstall}
      onSecondaryButtonPress={handleCancel}
      primaryButtonColor="#4F46E5" 
      primaryTextColor="#FFFFFF"
      hideCloseOnOverlayPress={false}
    />
  );
}
