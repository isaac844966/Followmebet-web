"use client";

import type React from "react";

import { useState } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { Filter, X } from "lucide-react";
import CustomButton from "./CustomButton";

export type FilterDuration = "Last 3 months" | "Last 6 months" | "Custom";
export type FilterDateSelectionFor = "start" | "end" | null;
export type FilterTab = "Date" | "Time Frame";

export interface FilterParams {
  date_from?: string;
  date_to?: string;
}

interface TransactionFilterProps {
  onFiltersApplied: (filters: FilterParams) => void;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({
  onFiltersApplied,
}) => {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "#0B0B3F" : "#FFFFFF";

  // Filter modal state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilterTab, setActiveFilterTab] =
    useState<FilterTab>("Time Frame");
  const [filterDuration, setFilterDuration] =
    useState<FilterDuration>("Last 3 months");
  const [dateSelectionFor, setDateSelectionFor] =
    useState<FilterDateSelectionFor>(null);

  const [startDate, setStartDate] = useState<string>(() => {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    const month = threeMonthsAgo.toLocaleString("en-US", { month: "short" });
    const year = threeMonthsAgo.getFullYear();
    return `${month}, ${year}`;
  });

  const [endDate, setEndDate] = useState<string>(() => {
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();
    return `${month}, ${year}`;
  });

  const [selectedYear, setSelectedYear] = useState<string>(() =>
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Available years for selection (7 years back from current)
  const availableYears = Array.from(
    { length: 7 },
    (_, i) => `${new Date().getFullYear() - i}`
  );

  // Full list of months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Current month index (for showing current and previous months)
  const currentMonthIndex = new Date().getMonth();

  // Only show current month and previous months for current year
  const displayedMonths =
    selectedYear === new Date().getFullYear().toString()
      ? months.slice(0, currentMonthIndex + 1)
      : months;

  // Handle month selection
  const handleMonthSelection = (month: string) => {
    const shortMonth = month.substring(0, 3);
    const formattedDate = `${shortMonth}, ${selectedYear}`;

    if (dateSelectionFor === "start") {
      setStartDate(formattedDate);
      setActiveFilterTab("Time Frame");
    } else if (dateSelectionFor === "end") {
      setEndDate(formattedDate);
      setActiveFilterTab("Time Frame");
    }
  };

  const applyFilters = () => {
    let date_from: string | undefined;
    let date_to: string | undefined;

    const formatDateString = (dateStr: string) => {
      // Convert "Feb, 2025" to "2025-02-01 00:00:00" format
      const [month, year] = dateStr.split(", ");
      const monthMap: Record<string, string> = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };
      return `${year}-${monthMap[month]}-01 00:00:00`;
    };

    if (filterDuration === "Last 3 months") {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      date_to = `${year}-${month}-${day} 23:59:59`;

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      const threeMonthsYear = threeMonthsAgo.getFullYear();
      const threeMonthsMonth = String(threeMonthsAgo.getMonth() + 1).padStart(
        2,
        "0"
      );
      const threeMonthsDay = String(threeMonthsAgo.getDate()).padStart(2, "0");
      date_from = `${threeMonthsYear}-${threeMonthsMonth}-${threeMonthsDay} 00:00:00`;
    } else if (filterDuration === "Last 6 months") {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      date_to = `${year}-${month}-${day} 23:59:59`;

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      const sixMonthsYear = sixMonthsAgo.getFullYear();
      const sixMonthsMonth = String(sixMonthsAgo.getMonth() + 1).padStart(
        2,
        "0"
      );
      const sixMonthsDay = String(sixMonthsAgo.getDate()).padStart(2, "0");
      date_from = `${sixMonthsYear}-${sixMonthsMonth}-${sixMonthsDay} 00:00:00`;
    } else if (filterDuration === "Custom") {
      date_from = formatDateString(startDate);

      // For end date, get the last day of the month
      const [monthStr, yearStr] = endDate.split(", ");
      const monthMap: Record<string, string> = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };
      const month = monthMap[monthStr];
      const year = Number.parseInt(yearStr);

      // Get last day of the month
      const lastDay = new Date(year, Number.parseInt(month), 0).getDate();
      date_to = `${yearStr}-${month}-${lastDay} 23:59:59`;
    }

    onFiltersApplied({ date_from, date_to });
    setFilterModalVisible(false);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setFilterModalVisible(true)}
        className="p-2 xs:p-1.5"
      >
        <Filter size={22} color="#FBB03B" className="xs:w-5 xs:h-5" />
      </button>

      {/* Filter Modal */}
      {filterModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex justify-end items-end z-50">
          <div
            className="w-full rounded-t-3xl p-4 xs:p-3"
            style={{ backgroundColor }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 xs:mb-3">
              <div className="w-8 xs:w-6"></div>
              <div className="flex-1 flex justify-center">
                {/* Tab Selector */}
                <div className="flex border-b border-gray-600">
                  <button
                    onClick={() => setActiveFilterTab("Date")}
                    className={`px-4 xs:px-3 py-2 xs:py-1.5 ${
                      activeFilterTab === "Date"
                        ? "border-b-2 border-[#FBB03B]"
                        : ""
                    }`}
                  >
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-black"
                      } xs:text-sm`}
                    >
                      Date
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveFilterTab("Time Frame")}
                    className={`px-4 xs:px-3 py-2 xs:py-1.5 ${
                      activeFilterTab === "Time Frame"
                        ? "border-b-2 border-[#FBB03B]"
                        : ""
                    }`}
                  >
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-black"
                      } xs:text-sm`}
                    >
                      Time Frame
                    </span>
                  </button>
                </div>
              </div>
              <button onClick={() => setFilterModalVisible(false)}>
                <X
                  size={22}
                  color={isDarkMode ? "#FFFFFF" : "#000000"}
                  className="xs:w-5 xs:h-5"
                />
              </button>
            </div>

            {/* Modal Content based on active tab */}
            {activeFilterTab === "Date" ? (
              <div className="mb-6 xs:mb-4">
                <h3
                  className={`text-lg xs:text-base mb-4 xs:mb-3 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  {dateSelectionFor === "start"
                    ? "Select Start Date"
                    : "Select End Date"}
                </h3>

                {/* Side by side Month and Year selectors */}
                <div className="flex h-64 xs:h-48" style={{ backgroundColor }}>
                  {/* Months on the left */}
                  <div className="flex-1 mr-2 xs:mr-1 border-gray-200 rounded overflow-auto">
                    {displayedMonths.reverse().map((item) => (
                      <button
                        key={item}
                        className={`p-4 xs:p-3 w-full text-left ${
                          selectedMonth === item ? "bg-[#e6b662]" : ""
                        }`}
                        onClick={() => {
                          setSelectedMonth(item);
                          handleMonthSelection(item);
                        }}
                      >
                        <span
                          className={`font-bold xs:text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {item}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Years on the right */}
                  <div className="flex-1 ml-2 xs:ml-1 rounded overflow-auto">
                    {availableYears.map((item) => (
                      <button
                        key={item}
                        className={`p-4 xs:p-3 w-full text-left ${
                          selectedYear === item ? "bg-[#e6b662]" : ""
                        }`}
                        onClick={() => setSelectedYear(item)}
                      >
                        <span
                          className={`font-bold xs:text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {item}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Duration Selection */}
                <div className="mb-6 xs:mb-4">
                  <h3
                    className={`text-lg xs:text-base mb-4 xs:mb-3 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Duration
                  </h3>
                  <div className="flex gap-2 xs:gap-1">
                    <button
                      className={`flex-1 p-4 xs:p-3 rounded-lg border relative ${
                        filterDuration === "Last 3 months"
                          ? "border-[#FBB03B] bg-[#FBB03B] bg-opacity-10"
                          : "border-gray-500"
                      }`}
                      onClick={() => setFilterDuration("Last 3 months")}
                    >
                      <span
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        } xs:text-sm`}
                      >
                        Last 3 months
                      </span>
                      {filterDuration === "Last 3 months" && (
                        <div className="absolute bottom-2 right-2">
                          <div className="w-5 h-5 xs:w-4 xs:h-4 bg-[#FBB03B] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs xs:text-[10px]">
                              ✓
                            </span>
                          </div>
                        </div>
                      )}
                    </button>
                    <button
                      className={`flex-1 p-4 xs:p-3 rounded-lg border relative ${
                        filterDuration === "Last 6 months"
                          ? "border-[#FBB03B] bg-[#FBB03B] bg-opacity-10"
                          : "border-gray-500"
                      }`}
                      onClick={() => setFilterDuration("Last 6 months")}
                    >
                      <span
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        } xs:text-sm`}
                      >
                        Last 6 months
                      </span>
                      {filterDuration === "Last 6 months" && (
                        <div className="absolute bottom-2 right-2">
                          <div className="w-5 h-5 xs:w-4 xs:h-4 bg-[#FBB03B] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs xs:text-[10px]">
                              ✓
                            </span>
                          </div>
                        </div>
                      )}
                    </button>
                    <button
                      className={`flex-1 p-4 xs:p-3 rounded-lg border relative ${
                        filterDuration === "Custom"
                          ? "border-[#FBB03B] bg-[#FBB03B] bg-opacity-10"
                          : "border-gray-500"
                      }`}
                      onClick={() => setFilterDuration("Custom")}
                    >
                      <span
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        } xs:text-sm`}
                      >
                        Custom
                      </span>
                      {filterDuration === "Custom" && (
                        <div className="absolute bottom-2 right-2">
                          <div className="w-5 h-5 xs:w-4 xs:h-4 bg-[#FBB03B] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs xs:text-[10px]">
                              ✓
                            </span>
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Date Range Selection (always visible in Time Frame tab) */}
                <>
                  {/* Start Date */}
                  <div className="mb-4 xs:mb-3">
                    <h3
                      className={`text-lg xs:text-base mb-2 xs:mb-1 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      Start Date
                    </h3>
                    <button
                      className="p-4 xs:p-3 border border-gray-500 rounded-lg flex justify-between items-center w-full"
                      onClick={() => {
                        setDateSelectionFor("start");
                        const year = startDate.split(", ")[1];
                        setSelectedYear(year);
                        setActiveFilterTab("Date");
                      }}
                    >
                      <span
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        } xs:text-sm`}
                      >
                        {startDate}
                      </span>
                      <span className="ml-2">›</span>
                    </button>
                  </div>

                  {/* End Date */}
                  <div className="mb-6 xs:mb-4">
                    <h3
                      className={`text-lg xs:text-base mb-2 xs:mb-1 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      End Date
                    </h3>
                    <button
                      className="p-4 xs:p-3 border border-gray-500 rounded-lg flex justify-between items-center w-full"
                      onClick={() => {
                        setDateSelectionFor("end");
                        const year = endDate.split(", ")[1];
                        setSelectedYear(year);
                        setActiveFilterTab("Date");
                      }}
                    >
                      <span
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        } xs:text-sm`}
                      >
                        {endDate}
                      </span>
                      <span className="ml-2">›</span>
                    </button>
                  </div>

                  {/* Confirm Button */}
                  <CustomButton
                    title="Confirm"
                    size="lg"
                    onClick={applyFilters}
                    buttonStyle={{ marginBottom: 16 }}
                    className="w-full"
                  />
                </>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionFilter;
