// App.jsx or InstallPrompt.jsx
import React, { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default mini-infobar
      setDeferredPrompt(e); // Save the event for triggering later
      setShowInstallButton(true); // Show your custom install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    setDeferredPrompt(null); // Clear the saved prompt
    setShowInstallButton(false); // Hide the install button
  };

  return (
    <>
      {showInstallButton && (
        <button onClick={handleInstallClick}>Install App</button>
      )}
    </>
  );
};

export default InstallPrompt;
