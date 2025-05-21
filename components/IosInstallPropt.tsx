"use client";

import { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import Image from "next/image";

export default function IosInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the device is iOS and not already in standalone mode
    const isIOS =
      /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) &&
      !window.matchMedia("(display-mode: standalone)").matches &&
      !(window.navigator as any).standalone;

    // Only show the prompt on iOS devices
    if (isIOS) {
      // You might want to add a delay or check localStorage to avoid showing this on every page load
      const hasSeenPrompt = localStorage.getItem("ios-install-prompt-seen");
      if (!hasSeenPrompt) {
        setShowPrompt(true);
      }
    }
  }, []);

  const handleClose = () => {
    setShowPrompt(false);
    // Optionally store in localStorage to avoid showing again for some time
    localStorage.setItem("ios-install-prompt-seen", Date.now().toString());
  };

  const message = (
    <>
      <p className="text-base xs:text-sm">
        To install this app on your iPhone or iPad, tap the{" "}
        <span className="font-semibold">Share</span> icon in Safari and then
        select <span className="font-semibold">"Add to Home Screen"</span>.
      </p>
    </>
  );

  const title = (
    <>
      <Image
        src="/app-icon.png"
        alt="followmebet"
        width={48}
        height={20}
      />
      <p className="text-2xl xs:text-xl">Install FollowMeBet</p>
    </>
  );

  return (
    <CustomModal
      visible={showPrompt}
      onClose={handleClose}
      title={title}
      message={message}
      primaryButtonText="Got it"
      secondaryButtonText="Maybe later"
      onPrimaryButtonPress={handleClose}
      onSecondaryButtonPress={handleClose}
      primaryButtonColor="#4F46E5"
      primaryTextColor="#FFFFFF"
      hideCloseOnOverlayPress={false}
    />
  );
}
