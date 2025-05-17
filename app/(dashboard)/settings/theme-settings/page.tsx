"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export default function ThemeSettings() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [darkThemeEnabled, setDarkThemeEnabled] = useState(isDarkMode);
  const [lightThemeEnabled, setLightThemeEnabled] = useState(!isDarkMode);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const router = useRouter();

  useEffect(() => {
    setDarkThemeEnabled(isDarkMode);
    setLightThemeEnabled(!isDarkMode);
  }, [isDarkMode]);

  const handleDarkThemeToggle = (value: boolean) => {
    setDarkThemeEnabled(value);
    setLightThemeEnabled(!value);
    setHasChanges(value !== isDarkMode);
  };

  const handleLightThemeToggle = (value: boolean) => {
    setLightThemeEnabled(value);
    setDarkThemeEnabled(!value);
    setHasChanges(value !== !isDarkMode);
  };

  const saveChanges = async () => {
    if (hasChanges) {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toggleTheme();
      setHasChanges(false);
      setLoading(false);
      router.back();
    }
  };

  return (
    <div className={`${backgroundColor} min-h-screen px-4`}>
      <BackButton title="Theme" />

      <div className="flex flex-col px-4 mt-6 relative pb-24">
        {/* Theme Options */}
        <div
          className={`${
            isDarkMode ? "bg-primary-1400" : "bg-blue-50"
          } rounded-lg p-8 mb-3 flex items-center justify-between`}
        >
          <p className={`${isDarkMode ? "text-primary-1200" : "text-black"}`}>
            Dark Theme {isDarkMode ? "(Current)" : ""}
          </p>
          <Switch
            id="dark-theme"
            checked={darkThemeEnabled}
            onCheckedChange={handleDarkThemeToggle}
          />
        </div>

        <div
          className={`${
            isDarkMode ? "bg-primary-1400" : "bg-blue-50"
          } rounded-lg p-8 mb-3 flex items-center justify-between`}
        >
          <p className={`${isDarkMode ? "text-primary-1200" : "text-black"}`}>
            Light Theme {!isDarkMode ? "(Current)" : ""}
          </p>
          <Switch
            id="light-theme"
            checked={lightThemeEnabled}
            onCheckedChange={handleLightThemeToggle}
          />
        </div>

        {/* Save Button */}
        <div className="fixed bottom-8 left-4 right-4 mx-auto max-w-md">
          <Button
            className="w-full py-6 bg-[#FFA726] hover:bg-[#FF9800] text-black font-semibold"
            onClick={saveChanges}
            disabled={!hasChanges || loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
