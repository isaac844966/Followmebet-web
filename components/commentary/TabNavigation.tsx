"use client";

interface TabNavigationProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="flex justify-between border-b border-gray-700 mb-4 xs:mb-2">
      {["Commentary", "Standings"].map((tab, index) => (
        <button
          key={index}
          onClick={() => onTabChange(index)}
          className="flex-1 focus:outline-none"
        >
          <div className="py-4 xs:py-3 flex items-center justify-center">
            <span
              className={`${
                activeTab === index
                  ? "text-yellow-500 font-bold"
                  : "text-gray-500"
              } xs:text-sm`}
            >
              {tab}
            </span>
          </div>
          <div
            className={`h-0.5 ${
              activeTab === index ? "bg-yellow-500" : "bg-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
