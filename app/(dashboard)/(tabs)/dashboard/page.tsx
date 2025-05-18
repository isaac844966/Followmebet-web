"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import Image from "next/image";
import { Info, RefreshCw, Settings, Bell } from "lucide-react";
import CustomButton from "@/components/CustomButton";
import { fetchUserProfile } from "@/lib/services/authService";
import { initializeFirebaseMessaging } from "@/lib/services/updateNotifictionToken";

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const backgroundColor = isDarkMode ? "#0B0B3F" : "#fff";
  const { user } = useAuthStore();
  console.log(user);
  const isLoading = !user || !user.firstname;

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeFirebaseMessaging();
  }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  }, []);

  return (
    <div className="flex-1 min-h-screen" style={{ backgroundColor }}>
      {/* Fixed header */}
      <div
        className="fixed top-0 left-0 right-0 z-10"
        style={{ backgroundColor }}
      >
        <div className="px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between py-4">
            <Image
              src="/images/icon.png"
              alt="Logo"
              width={120}
              height={48}
              className="object-contain"
            />
            <div className="flex items-center">
              <button
                className="mr-3"
                onClick={() => console.log("Notification pressed")}
              >
                <Bell size={24} color={isDarkMode ? "white" : "#1E1F68"} />
              </button>
              <div className="flex items-center">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <div
                    className={`${
                      isDarkMode ? "text-white" : "text-primary-600"
                    } text-xs text-left mr-2`}
                  >
                    <span>My Account</span>
                    <br />
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-black"
                      } font-bold text-left`}
                    >
                      ₦
                      {user?.balance?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      }) || `0.00`}
                    </span>
                  </div>
                )}
                <button onClick={() => router.push("/settings")}>
                  <div className="w-8 h-8 rounded-full border border-[#FBB03B] flex items-center justify-center overflow-hidden">
                    {user?.avatarUrl ? (
                      <Image
                        src={user.avatarUrl || "/placeholder.svg"}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="object-cover"
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

      {/* Main content with padding to account for fixed header */}
      <div className="px-4 max-w-4xl mx-auto pt-20">
        <div className="space-y-4 pb-8">
          {/* User Profile Card */}
          <div
            className={`${
              isDarkMode ? "bg-primary-1400" : "bg-primary-100"
            } rounded-lg p-6 mb-2 flex items-center`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full mr-4 border-primary-400 border-2 overflow-hidden">
                  <Image
                    src={
                      user?.avatarUrl ||
                      "https://avatar.iran.liara.run/public/41"
                    }
                    alt="User Avatar"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-primary-600"
                    } text-xs mb-1`}
                  >
                    Welcome Back
                  </p>
                  <h2 className="text-white text-lg font-bold">
                    {user?.firstname} {user?.lastname}
                  </h2>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary-400 mr-2"></div>
                    <p className="text-white text-xs uppercase">Legendary</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/settings")}
                  className="p-2"
                >
                  <Settings size={16} color="white" />
                </button>
              </>
            )}
          </div>

          {/* Wallet Balance Card */}
          <div
            className={`${
              isDarkMode ? "bg-primary-1400" : "bg-primary-1200"
            } rounded-lg p-6 mb-2 flex items-center justify-between`}
          >
            <div>
              {isLoading || refreshing ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <p
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } text-xl font-bold`}
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
                } text-xs`}
              >
                Wallet Balance
              </p>
            </div>

            <button onClick={onRefresh} className="mr-4 p-2">
              <RefreshCw
                size={20}
                color={isDarkMode ? "white" : "#1E1F68"}
                className={refreshing ? "animate-spin" : ""}
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
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div
              className="rounded-lg py-6 px-4"
              style={{ backgroundColor: isDarkMode ? "#1E1F68" : "#E8E8FF" }}
            >
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-primary-600"
                } text-sm mb-2 font-semibold`}
              >
                Total Pending Public Bets
              </p>

              <div className="flex items-center justify-between">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <p
                    className={`${
                      isDarkMode ? "text-white" : "text-primary-100"
                    } text-2xl font-bold`}
                  >
                    {user?.pendingPublicBets || 0}
                  </p>
                )}
              </div>
            </div>

            <div
              className="rounded-lg py-6 px-4"
              style={{ backgroundColor: isDarkMode ? "#1E1F68" : "#FFFBE8" }}
            >
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-primary-600"
                } text-sm mb-2 font-semibold`}
              >
                Total Pending Private Bets
              </p>

              <div className="flex items-center justify-between">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <p
                    className={`${
                      isDarkMode ? "text-white" : "text-primary-100"
                    } text-2xl font-bold`}
                  >
                    {user?.pendingPrivateBets || 0}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div
              className="rounded-lg py-6 px-4"
              style={{ backgroundColor: isDarkMode ? "#1E1F68" : "#FDEFFF" }}
            >
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-primary-600"
                } text-sm mb-2 font-semibold`}
              >
                Total Accepted Bets
              </p>

              <div className="flex items-center justify-between">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <p
                    className={`${
                      isDarkMode ? "text-white" : "text-primary-100"
                    } text-2xl font-bold`}
                  >
                    {user?.openBets || 0}
                  </p>
                )}
              </div>
            </div>

            <div
              className="rounded-lg py-6 px-4"
              style={{ backgroundColor: isDarkMode ? "#1E1F68" : "#E9FFE8" }}
            >
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-primary-600"
                } text-sm mb-2 font-semibold`}
              >
                Total Settled Bets
              </p>

              <div className="flex items-center justify-between">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <p
                    className={`${
                      isDarkMode ? "text-white" : "text-primary-100"
                    } text-2xl font-bold`}
                  >
                    {user?.completedBets || 0}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Items */}
          <Link
            href="/transactions"
            className={`${
              isDarkMode ? "bg-primary-1400" : "bg-blue-50"
            } rounded-lg p-6 py-7 mb-2 flex items-center justify-between`}
          >
            <div className="flex items-center">
              <Info size={20} color={isDarkMode ? "white" : "#1E1F68"} />
              <span
                className={`${
                  isDarkMode ? "text-white" : "text-black"
                } ml-3 font-semibold text-lg`}
              >
                Transactions
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-gray-400 mr-2 text-sm font-semibold">
                View
              </span>
              <Settings size={12} color={isDarkMode ? "white" : "#1E1F68"} />
            </div>
          </Link>

          <Link
            href="/help"
            className={`${
              isDarkMode ? "bg-primary-1400" : "bg-blue-50"
            } rounded-lg p-6 py-7 mb-2 flex items-center justify-between`}
          >
            <div className="flex items-center">
              <Info size={24} color={isDarkMode ? "#FFF" : "#000"} />
              <span
                className={`${
                  isDarkMode ? "text-white" : "text-black"
                } ml-3 font-semibold text-lg`}
              >
                Help
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-gray-400 mr-2 text-sm font-semibold">
                Get Help
              </span>
              <Settings size={12} color={isDarkMode ? "white" : "#1E1F68"} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
