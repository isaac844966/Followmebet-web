// components/IosInstallPrompt.tsx
"use client";
import { useEffect, useState } from "react";

const IosInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isIOS =
      /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) &&
      !window.matchMedia("(display-mode: standalone)").matches;

    if (isIOS) {
      setShowPrompt(true);
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-bold mb-2">Install FollowMeBet</h2>
        <p className="text-sm text-gray-700 mb-4">
          To install this app on your iPhone or iPad, tap the{" "}
          <span className="font-semibold">Share</span> icon in Safari and then
          select <span className="font-semibold">"Add to Home Screen"</span>.
        </p>
        <button
          className="text-indigo-600 underline mt-2"
          onClick={() => setShowPrompt(false)}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default IosInstallPrompt;
