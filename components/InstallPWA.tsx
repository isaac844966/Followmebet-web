"use client";

import usePWAInstallPrompt from "@/hooks/usePWAIntsallPrompt";


export default function InstallPrompt() {
  const { isInstallable, promptInstall } = usePWAInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white border rounded-xl shadow-md p-4 flex items-center gap-2">
      <p className="text-sm">Install our app for a better experience!</p>
      <button
        onClick={promptInstall}
        className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
      >
        Install
      </button>
    </div>
  );
}
