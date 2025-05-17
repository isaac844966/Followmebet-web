"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import BackButton from "@/components/BackButton";
import ActionItem from "@/components/ActionItem";
import { HelpCircle, LifeBuoy } from "lucide-react";

const HelpPage = () => {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "#0B0B3F" : "#fff";
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor }}>
      <div className="px-4 pt-4">
        <BackButton title="Help" />
      </div>

      <div className="flex-1 px-4 mt-6">
        <ActionItem
          title="FAQs"
          icon={
            <HelpCircle
              size={20}
              className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
            />
          }
          onPress={() => router.push("/help/faqs")}
          containerStyle={{
            backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
            padding: 28,
            marginBottom: 20,
          }}
        />

        <ActionItem
          title="Support"
          icon={
            <LifeBuoy
              size={20}
              className={isDarkMode ? "text-white" : "text-[#1E1F68]"}
            />
          }
          onPress={() => router.push("/help/support")}
          containerStyle={{
            backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF",
            padding: 28,
          }}
        />
      </div>
    </div>
  );
};

export default HelpPage;
