"use client";

import { format, isSameDay, isToday } from "date-fns";

interface DateSelectorProps {
  dateRange: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  textColor: string;
}

export default function DateSelector({
  dateRange,
  selectedDate,
  onDateSelect,
  textColor,
}: DateSelectorProps) {
  return (
    <div className="py-4 xs:py-3 flex px-3 xs:px-2 justify-between w-full">
      {dateRange.map((date) => (
        <button
          key={date.toISOString()}
          onClick={() => onDateSelect(date)}
          className="mx-1 xs:mx-0.5 rounded-lg items-center"
        >
          <span
            className={`text-sm xs:text-xs ${
              isSameDay(date, selectedDate)
                ? "text-[#FBB03B] font-bold"
                : textColor
            }`}
          >
            {isToday(date) ? "Today" : `${format(date, "d MMM")}`}
          </span>
        </button>
      ))}
    </div>
  );
}
