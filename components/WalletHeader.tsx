"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";

interface WalletHeaderProps {
  title: string;
  icon: React.ReactNode;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ title, icon }) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuthStore();
  const backgroundColor = isDarkMode ? "bg-primary-100" : "bg-gray-100";
  const router = useRouter();

  return (
    <div>
      <div className={`pt-4 px-4 xs:px-3 pb-4 ${backgroundColor}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/images/icon.png"
              alt="Logo"
              width={120}
              height={48}
              className="object-contain xs:w-[100px]"
            />
          </div>

          <div className="flex items-center">
            <div className="">
              <p
                className={`${
                  isDarkMode ? "text-white" : "text-black"
                } text-xs xs:text-[10px] mr-1 font-bold`}
              >
                My Account
              </p>
              <p
                className={`${
                  isDarkMode ? "text-white" : "text-black"
                } font-bold text-base xs:text-sm mr-2`}
              >
                ₦
                {user?.balance?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </p>
            </div>

            <button onClick={() => router.push("/settings")}>
              <div className="w-8 h-8 xs:w-7 xs:h-7 rounded-full bg-primary-400 overflow-hidden">
                {user?.avatarUrl && (
                  <Image
                    src={user.avatarUrl || "/placeholder.svg"}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`px-4 xs:px-3 py-2 pb-6 xs:pb-4 gap-2 flex items-center ${backgroundColor}`}
      >
        {icon}
        <p
          className={`${
            isDarkMode ? "text-white" : "text-black"
          } font-bold text-xl xs:text-lg`}
        >
          {title}
        </p>
      </div>
    </div>
  );
};

export default WalletHeader;
