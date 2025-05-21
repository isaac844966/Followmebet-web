"use client";

import usePWAInstallPrompt from "@/hooks/usePWAIntsallPrompt";
import { useState } from "react";
import CustomModal from "./CustomModal";
import Image from "next/image";

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
    const message = (
      <>
        <p>
          Add to your home screen for quicker access and a smoother experience.
        </p>
        <Image src="/image/app-icon" alt="followmebet" />
      </>
    );
  return (
    <CustomModal
      visible={isInstallable && isModalVisible}
      onClose={handleCancel}
      title="Install FollowMeBet"
      message={message}
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
