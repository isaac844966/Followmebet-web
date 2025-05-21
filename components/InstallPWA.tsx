// components/InstallPrompt.tsx
"use client";

import usePWAInstallPrompt from "@/hooks/usePWAIntsallPrompt";

export default function InstallPrompt() {
  const { isInstallable, promptInstall } = usePWAInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center">
        <h2 className="text-lg font-bold mb-2">Install FollowMeBet</h2>
        <p className="text-sm text-gray-600 mb-4">
          Add to your home screen for quicker access and a smoother experience.
        </p>
        <button
          onClick={promptInstall}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          Install Now
        </button>
      </div>
    </div>
  );
}
