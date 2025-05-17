"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Feather } from "lucide-react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import {
  getSuggestedChallengers,
  type SuggestedChallenger,
} from "@/lib/services/bet-service";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import NestedTabNavigation from "@/components/NestedTabNavigation";
import PhoneInput from "@/components/PhoneInput";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";

const SelectOpponentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode } = useTheme();
  const { user } = useAuthStore();

  const prediction = searchParams.get("prediction") || "";
  const condition = searchParams.get("condition") || "";
  const amount = searchParams.get("amount") || "";

  const [activeTab, setActiveTab] = useState("opponents");
  const [challengers, setChallengers] = useState<SuggestedChallenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Contact form
  const [phoneNumber, setPhoneNumber] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [opponentNameError, setOpponentNameError] = useState("");

  // Background and text colors based on theme
  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const cardBackground = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  // Define tabs with icons
  const tabs = [
    {
      key: "opponents",
      label: "Opponents",
      icon: (
        <Feather
          name="users"
          size={18}
          className={isDarkMode ? "text-white" : "text-black"}
        />
      ),
    },
    {
      key: "contacts",
      label: "Contacts",
      icon: (
        <Feather
          name="phone"
          size={18}
          className={isDarkMode ? "text-white" : "text-black"}
        />
      ),
    },
  ];

  useEffect(() => {
    if (activeTab === "opponents") {
      fetchChallengers();
    }
  }, [activeTab]);

  const fetchChallengers = async () => {
    try {
      setLoading(true);
      const response = await getSuggestedChallengers();
      setChallengers(response.items);
    } catch (err: any) {
      console.error("Error fetching challengers:", err);
      setError(err.message || "Failed to load suggested challengers");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const formatPhoneNumberForAPI = (input: string) => {
    if (!input) return "";

    let cleaned = input.replace(/\D/g, "");

    if (cleaned.startsWith("234")) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith("0")) {
      return `+234${cleaned.substring(1)}`;
    } else if (input.startsWith("+")) {
      if (cleaned.startsWith("234")) {
        return `+${cleaned}`;
      } else {
        return `+234${cleaned}`;
      }
    } else {
      return `+234${cleaned}`;
    }
  };

  const validatePhoneNumber = (number: string) => {
    if (!number || number.trim() === "") return false;

    const cleaned = number.replace(/\D/g, "");

    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const handleSelectChallenger = (challenger: SuggestedChallenger) => {
    const opponentName =
      challenger.nickname ||
      `${
        challenger.firstname.charAt(0).toUpperCase() +
        challenger.firstname.slice(1)
      } ${
        challenger.lastname.charAt(0).toUpperCase() +
        challenger.lastname.slice(1)
      }`;
    router.push(
      `/summary?prediction=${prediction}&condition=${condition}&amount=${amount}&betType=challenge&opponentId=${
        challenger.id
      }&opponentName=${opponentName}&opponentAvatar=${encodeURIComponent(
        challenger.avatarUrl
      )}`
    );
  };

  const handleContactSubmit = () => {
    let valid = true;

    // Validate phone number
    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required.");
      valid = false;
    } else if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError("Please enter a valid phone number.");
      valid = false;
    } else {
      setPhoneError("");
    }

    // Validate opponent name
    if (!opponentName.trim()) {
      setOpponentNameError("Opponent name is required.");
      valid = false;
    } else {
      setOpponentNameError("");
    }

    if (!valid) return;

    const formattedPhoneNumber = formatPhoneNumberForAPI(phoneNumber);

    const formattedOpponentName = opponentName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    router.push(
      `/bet-summary?prediction=${prediction}&condition=${condition}&amount=${amount}&betType=challenge&opponentName=${formattedOpponentName}&opponentPhone=${formattedPhoneNumber}`
    );
  };

  const filteredChallengers = searchQuery
    ? challengers.filter(
        (challenger) =>
          (challenger.nickname &&
            challenger.nickname
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (challenger.firstname &&
            challenger.firstname
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (challenger.lastname &&
            challenger.lastname
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      )
    : challengers;

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="items-center flex flex-col justify-center">
        <Feather
          name="users"
          size={60}
          className={isDarkMode ? "text-gray-600" : "text-gray-400"}
        />

        <p className={`${textColor} text-lg font-medium mt-4`}>Opps!!</p>
        <p className={`${textColor} text-center mt-2`}>
          Looks like you do not have friends
        </p>
      </div>

      <Button
        className="bg-[#FBB03B] py-6 px-6 rounded-md mt-auto w-full hover:bg-[#e9a436]"
        onClick={() => setActiveTab("contacts")}
      >
        Add from your Contact
      </Button>
    </div>
  );

  return (
    <div className={`min-h-screen ${backgroundColor} p-4`}>
      <BackButton title="Select Opponent" />
      <div className="mb-4 mt-2">
        <NestedTabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          iconPosition="left"
        />
      </div>

      <div className="flex-1">
        {activeTab === "opponents" ? (
          <div className="h-full">
            {/* Search Bar */}
            <div className="mb-4">
              <div
                className={`flex items-center ${
                  isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]"
                } rounded-lg px-3 py-2`}
              >
                <Feather
                  name="search"
                  size={20}
                  className={isDarkMode ? "text-white" : "text-black"}
                />
                <Input
                  placeholder="Search"
                  className={`${textColor} ml-2 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-10 border-b-2 border-[#FFA726]"></div>
              </div>
            ) : filteredChallengers.length > 0 ? (
              <div className="space-y-2 mt-4">
                {filteredChallengers.map((challenger) => (
                  <Card
                    key={challenger.id}
                    className={`${cardBackground} rounded-lg p-4 cursor-pointer border-[0.1px]`}
                    onClick={() => handleSelectChallenger(challenger)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative w-14 h-14 rounded-full border border-[#FFA726] overflow-hidden">
                          <Image
                            src={challenger.avatarUrl || "/placeholder.svg"}
                            alt={
                              challenger.nickname ||
                              `${challenger.firstname} ${challenger.lastname}`
                            }
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <p className={`${textColor} font-medium mb-2`}>
                            {challenger.nickname ||
                              `${challenger.firstname} ${challenger.lastname}`}
                          </p>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                            <p className={`${secondaryTextColor} text-xs`}>
                              LEGENDARY
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className={textColor}>›</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="h-64 px-4">{renderEmptyState()}</div>
            )}
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Phone Input */}
            <div className="space-y-2">
              <PhoneInput
                placeholder="Mobile Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                error={phoneError}
                maxLength={10}
              />
            </div>

            {/* Opponent Name */}
            <div className="space-y-2">
              <CustomInput
                placeholder="Opponent"
                onChange={(e) => setOpponentName(e.target.value)}
                error={opponentNameError}
                value={opponentName}
              />
            </div>

            {/* My Name */}
            <div className="space-y-2 ">
              <CustomInput
                placeholder="Me"
                value={`${user?.firstname} ${user?.lastname}`}
                editable={false}
              />
            </div>

            {/* Next Button */}
            <div className="mt-10">
              <CustomButton
                title="Next"
                className="w-full mt-20 "
                size="lg"
                onClick={handleContactSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectOpponentPage;
