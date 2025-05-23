"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import Image from "next/image";
import { Info, RefreshCw, Settings, ChevronRight } from "lucide-react";
import CustomButton from "@/components/CustomButton";
import { fetchUserProfile } from "@/lib/services/authService";
import { initializeFirebaseMessaging } from "@/lib/services/updateNotifictionToken";
import InstallPWA from "@/components/InstallPWA";
import IosInstallPrompt from "@/components/IosInstallPropt";

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const backgroundColor = isDarkMode ? "#0B0B3F" : "#fff";
  const { user } = useAuthStore();
  const isLoading = !user || !user.firstname;
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const [refreshing, setRefreshing] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(88); // Default header height in pixels

  useEffect(() => {
    initializeFirebaseMessaging();

    // Measure header height after render
    const header = document.getElementById("dashboard-header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  }, []);

  const navigateToBets = (statusTab: string, visibilityTab?: string) => {
    if (statusTab === "accepted") {
      router.push("/my-bets?tab=accepted");
    } else if (statusTab === "settled") {
      router.push("/my-bets?tab=settled");
    } else if (statusTab === "pending") {
      router.push(`/my-bets?tab=pending&subTab=${visibilityTab || "public"}`);
    }
  };

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        backgroundColor,
        scrollbarWidth: "none", 
        msOverflowStyle: "none", 
      }}
    >
      {/*  Header */}
      <div
        id="dashboard-header"
        className="fixed top-0 left-0 right-0 z-10"
        style={{ backgroundColor }}
      >
        <div className="px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between py-6">
            <Image
              src="/images/icon.png"
              alt="Logo"
              width={120}
              height={48}
              className="object-contain xs:w-32 h-10"
            />
            <div className="flex items-center">
              <div className="flex items-center">
                {isLoading ? (
                  <div className="w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <div className={`${textColor} text-xs text-left mr-2`}>
                    <span className="text-xs xs:text-[10px]">My Account</span>
                    <br />
                    <span
                      className={`${textColor} font-bold text-left text-xs`}
                    >
                      ₦
                      {user?.balance?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      }) || `0.00`}
                    </span>
                  </div>
                )}
                <button onClick={() => router.push("/settings")}>
                  <div className="w-8 h-8 xs:w-6 xs:h-6 rounded-full border border-[#FBB03B] flex items-center justify-center overflow-hidden">
                    {user?.avatarUrl ? (
                      <Image
                        src={user.avatarUrl || "/placeholder.svg"}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div
                        className={`w-full h-full ${
                          isDarkMode ? "bg-primary-400" : "bg-primary-1900"
                        }`}
                      ></div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PWA Install Prompts */}
      <InstallPWA />
      <IosInstallPrompt />

      {/* Main content  */}
      <div
        className="flex-1 overflow-y-auto "
        style={{
          paddingTop: `${headerHeight}px`,
          scrollbarWidth: "none", 
          msOverflowStyle: "none", 
        }}
      >
        <style jsx global>{`
          /* Hide scrollbar for Chrome, Safari and Opera */
          ::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for IE, Edge and Firefox */
          body {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        `}</style>

        <div className="px-2 max-w-4xl mx-auto pb-10">
          <div className="space-y-3 xs:space-y-2">
            {/* User Profile Card */}
            <div
              className={`${
                isDarkMode ? "bg-primary-1400" : "bg-primary-100"
              } rounded-lg p-4 xs:p-3 flex items-center`}
            >
              {isLoading ? (
                <div className="w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <div className="w-12 h-12 xs:w-8 xs:h-8 rounded-full mr-3 xs:mr-2 border-primary-400 border-2 overflow-hidden">
                    <Image
                      src={
                        user?.avatarUrl ||
                        "https://avatar.iran.liara.run/public/41" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt="User Avatar"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1">
                    <p
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-primary-600"
                      } text-xs xs:text-[10px] mb-0.5`}
                    >
                      Welcome Back
                    </p>
                    <h2 className="text-white text-base xs:text-sm font-bold">
                      {user?.firstname} {user?.lastname}
                    </h2>
                    <div className="flex items-center mt-0.5">
                      <div className="w-2 h-2 xs:w-1.5 xs:h-1.5 rounded-full bg-primary-400 mr-1.5"></div>
                      <p className="text-white text-xs xs:text-[10px] uppercase">
                        Legendary
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/settings")}
                    className="p-2 xs:p-1.5"
                  >
                    <Settings
                      size={16}
                      color="white"
                      className="xs:w-4 xs:h-4"
                    />
                  </button>
                </>
              )}
            </div>

            {/* Wallet Balance Card */}
            <div
              className={`${
                isDarkMode ? "bg-primary-1400" : "bg-primary-1200"
              } rounded-lg p-4 flex items-center justify-between`}
            >
              <div>
                {isLoading ? (
                  <div className="w-5 h-5 xs:w-4 xs:h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <p
                    className={`${
                      isDarkMode ? "text-white" : "text-black"
                    } text-lg xs:text-base font-bold`}
                  >
                    ₦
                    {user?.balance?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    }) || `0.00`}
                  </p>
                )}
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-primary-600"
                  } text-xs xs:text-[10px]`}
                >
                  Wallet Balance
                </p>
              </div>

              <button onClick={onRefresh} className="mr-2 p-1.5">
                <RefreshCw
                  size={20}
                  color={isDarkMode ? "white" : "#1E1F68"}
                  className={`${
                    refreshing ? "animate-spin" : ""
                  } xs:w-4 xs:h-4`}
                />
              </button>

              <div>
                <CustomButton
                  title="Deposit"
                  size="md"
                  onClick={() => router.push("/deposit")}
                  disabled={isLoading || refreshing}
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className="rounded-lg py-4 px-4 cursor-pointer hover:opacity-90 transition-opacity relative"
                style={{ backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF" }}
                onClick={() => navigateToBets("pending", "public")}
              >
                <p
                  className={`${secondaryTextColor} text-md xs:text-sm font-semibold`}
                >
                  Total Pending Public Bets
                </p>

                {isLoading ? (
                  <div className="w-4 h-4 xs:w-3 xs:h-3 border-2 border-t-transparent border-white rounded-full animate-spin mt-3"></div>
                ) : (
                  <p
                    className={`${
                      isDarkMode ? "text-white" : "text-primary-100"
                    } text-xl xs:text-lg font-bold mt-3`}
                  >
                    {user?.pendingPublicBets || 0}
                  </p>
                )}

                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <ChevronRight
                    size={16}
                    color={isDarkMode ? "white" : "#1E1F68"}
                    className="xs:w-3 xs:h-3"
                  />
                </div>
              </div>

              <div
                className="rounded-lg py-4 px-4 cursor-pointer hover:opacity-90 transition-opacity relative"
                style={{ backgroundColor: isDarkMode ? "#1E1F68" : "#FFFBE8" }}
                onClick={() => navigateToBets("pending", "private")}
              >
                <p
                  className={`${secondaryTextColor} text-md xs:text-sm font-semibold`}
                >
                  Total Pending Private Bets
                </p>

                {isLoading ? (
                  <div className="w-4 h-4 xs:w-3 xs:h-3 border-2 border-t-transparent border-white rounded-full animate-spin mt-3"></div>
                ) : (
                  <p
                    className={`${
                      isDarkMode ? "text-white" : "text-primary-100"
                    } text-xl xs:text-lg font-bold mt-3`}
                  >
                    {user?.pendingPrivateBets || 0}
                  </p>
                )}

                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <ChevronRight
                    size={16}
                    color={isDarkMode ? "white" : "#1E1F68"}
                    className="xs:w-3 xs:h-3"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div
                className="rounded-lg py-4 px-4 cursor-pointer hover:opacity-90 transition-opacity xs:h-[100px] relative"
                style={{ backgroundColor: isDarkMode ? "#1E1F68" : "#FDEFFF" }}
                onClick={() => navigateToBets("accepted")}
              >
                <p
                  className={`${secondaryTextColor} text-md xs:text-sm font-semibold`}
                >
                  Total Accepted Bets
                </p>

                {isLoading ? (
                  <div className="w-4 h-4 xs:w-3 xs:h-3 border-2 border-t-transparent border-white rounded-full animate-spin mt-3"></div>
                ) : (
                  <p
                    className={`${textColor} text-xl xs:text-lg font-bold mt-3`}
                  >
                    {user?.openBets || 0}
                  </p>
                )}

                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <ChevronRight
                    size={16}
                    color={isDarkMode ? "white" : "#1E1F68"}
                    className="xs:w-3 xs:h-3"
                  />
                </div>
              </div>

              <div
                className="rounded-lg py-4 px-4 cursor-pointer hover:opacity-90 transition-opacity xs:h-[100px] relative"
                style={{ backgroundColor: isDarkMode ? "#1E1F68" : "#E9FFE8" }}
                onClick={() => navigateToBets("settled")}
              >
                <p
                  className={`${secondaryTextColor} text-md xs:text-sm font-semibold`}
                >
                  Total Settled Bets
                </p>

                {isLoading ? (
                  <div className="w-4 h-4 xs:w-3 xs:h-3 border-2 border-t-transparent border-white rounded-full animate-spin mt-3"></div>
                ) : (
                  <p
                    className={`${
                      isDarkMode ? "text-white" : "text-primary-100"
                    } text-xl xs:text-lg font-bold mt-3`}
                  >
                    {user?.completedBets || 0}
                  </p>
                )}

                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <ChevronRight
                    size={16}
                    color={isDarkMode ? "white" : "#1E1F68"}
                    className="xs:w-3 xs:h-3"
                  />
                </div>
              </div>
            </div>

            {/* Action Items */}
            <Link
              href="/transactions"
              className={`${
                isDarkMode ? "bg-primary-1400" : "bg-blue-50"
              } rounded-lg p-4 flex items-center justify-between`}
            >
              <div className="flex items-center">
                <Info size={20} color={isDarkMode ? "white" : "#1E1F68"} />
                <span
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } ml-3 font-semibold text-base`}
                >
                  Transactions
                </span>
              </div>

              <div className="flex items-center self-center">
                <span className="text-gray-400 mr-2 xs:mr-1 text-xs xs:text-[10px] font-semibold">
                  View
                </span>
                <ChevronRight
                  size={16}
                  color={isDarkMode ? "white" : "#1E1F68"}
                />
              </div>
            </Link>

            <Link
              href="/help"
              className={`${
                isDarkMode ? "bg-primary-1400" : "bg-blue-50"
              } rounded-lg p-4 flex items-center justify-between`}
            >
              <div className="flex items-center">
                <Info size={20} color={isDarkMode ? "white" : "#1E1F68"} />
                <span
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } ml-3 font-semibold text-base`}
                >
                  Help
                </span>
              </div>

              <div className="flex items-center self-center">
                <span className="text-gray-400 mr-2 text-xs font-semibold">
                  Get Help
                </span>
                <ChevronRight
                  size={16}
                  color={isDarkMode ? "white" : "#1E1F68"}
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
