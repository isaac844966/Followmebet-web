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

  const title = (
    <>
      <Image
        src="/app-icon.png"
        alt="followmebet"
        width={80} 
        height={40}
      />
      <p className="text-2xl xs:text-xl">Install FollowMeBet</p>
    </>
  );

  return (
    <CustomModal
      visible={isInstallable && isModalVisible}
      onClose={handleCancel}
      title={title}
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
