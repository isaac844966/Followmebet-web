import { useEffect, useRef } from "react";
import Image from "next/image";
import { LiveEventData } from "@/hooks/use-match-event";
import { LiveFixtureData } from "@/hooks/use-live-fixture-data";

interface CommentaryTabProps {
  events: Record<string, LiveEventData>;
  fixtureData: LiveFixtureData | null;
  primaryBg: string;
  textColor: string;
  secondaryTextColor: string;
  isDarkMode: boolean;
}

export default function CommentaryTab({
  events,
  fixtureData,
  primaryBg,
  textColor,
  secondaryTextColor,
  isDarkMode,
}: CommentaryTabProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Format time elapse for display
  const formatTimeElapse = (
    timeElapse: string | undefined,
    timeExtra: string | undefined,
    status: string | undefined
  ) => {
    if (!timeElapse) return "";

    // Special case for half-time and full-time indicators
    if (status === "HT" || status === "FT") return status;

    // Handle numeric times
    if (timeElapse === "45" && timeExtra) {
      return `45`;
    } else if (timeElapse === "90" && timeExtra && status !== "FT") {
      return `90`; // Show extra time for 90' unless it's FT
    }

    // Add extra time if available for other minutes
    if (timeExtra && timeExtra !== "") {
      return `${timeElapse}+${timeExtra}`;
    }

    return timeElapse;
  };

  // Return numerical value of time for sorting
  const getTimeValue = (
    timeElapse: string | undefined,
    timeExtra: string | undefined
  ) => {
    if (!timeElapse) return 0;

    // Handle special cases
    if (timeElapse === "HT" || timeElapse === "45.5") return 45.5;
    if (timeElapse === "FT" || timeElapse === "90.5") return 90.5;

    // Extract numeric part
    const baseTime = Number.parseFloat(timeElapse) || 0;
    const extraTime = timeExtra ? Number.parseFloat(timeExtra) || 0 : 0;

    // For sorting purposes, add a small fraction for extra time
    return baseTime + extraTime * 0.01;
  };

  // Process and organize events
  const processedEvents = () => {
    if (!events) return [];

    // First, convert to array and add computed properties
    const eventArray = Object.entries(events).map(([key, event]) => {
      const timeElapse =
        event.time_elapse ||
        (typeof event.status === "string" ? event.status : "0");

      // Get status for special cases (HT, FT)
      const status = event.status || "";

      const displayTime = formatTimeElapse(
        timeElapse,
        event.time_extra,
        typeof status === "string" ? status : undefined
      );
      const timeValue = getTimeValue(timeElapse, event.time_extra);

      // Special formatting for HT and FT events
      const isSpecialEvent = status === "HT" || status === "FT";

      return {
        id: key,
        ...event,
        timeElapse,
        displayTime,
        timeValue,
        isSpecialEvent,
        status,
      };
    });

    // Sort by time value
    return eventArray.sort((a, b) => a.timeValue - b.timeValue);
  };

  // Check if match has reached half time
  const hasReachedHalfTime = () => {
    if (!fixtureData) return false;

    // Match status is HT or FT or match has progressed beyond 45 minutes
    if (fixtureData.status === "HT" || fixtureData.status === "FT") return true;

    const currentMinute = Number.parseInt(fixtureData.status_elapse || "0", 10);
    return currentMinute >= 45;
  };

  // Check if match has reached full time
  const hasReachedFullTime = () => {
    if (!fixtureData) return false;

    // Match status is FT
    if (fixtureData.status === "FT") return true;

    const currentMinute = Number.parseInt(fixtureData.status_elapse || "0", 10);
    return currentMinute >= 90;
  };

  // Find special events like HT and FT
  const findSpecialEvents = () => {
    const htEvent = Object.values(events).find(
      (event) =>
        event.status === "HT" || (event.result && event.time_elapse === "45.5")
    );

    const ftEvent = Object.values(events).find(
      (event) =>
        event.status === "FT" || (event.result && event.time_elapse === "90.5")
    );

    return { htEvent, ftEvent };
  };

  const getEventIcon = (
    eventType: string | undefined,
    detail: string | undefined
  ) => {
    if (!eventType) return null;

    const type = eventType.toLowerCase();
    const info = detail?.toLowerCase() || "";

    // Return appropriate icon based on event type and detail
    switch (type) {
      case "goal":
        if (info.includes("own goal"))
          return <div className="w-5 h-5 bg-red-500 rounded-full"></div>;
        if (info.includes("missed"))
          return <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>;
        if (info.includes("penalty"))
          return <div className="w-5 h-5 bg-green-500 rounded-full"></div>;
        return <div className="w-5 h-5 bg-green-500 rounded-full"></div>;

      case "card":
        if (info.includes("yellow"))
          return <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>;
        if (info.includes("red"))
          return <div className="w-5 h-5 bg-red-500 rounded-full"></div>;
        return null;

      case "subst":
        return <div className="w-5 h-5 bg-blue-500 rounded-full"></div>;

      case "var":
        if (info.includes("goal cancelled"))
          return <div className="w-5 h-5 bg-red-500 rounded-full"></div>;
        if (info.includes("penalty confirmed"))
          return <div className="w-5 h-5 bg-green-500 rounded-full"></div>;
        return <div className="w-5 h-5 bg-purple-500 rounded-full"></div>;

      default:
        return null;
    }
  };

  // Get all processed events
  const allEvents = processedEvents();
  const { htEvent, ftEvent } = findSpecialEvents();

  // Find the half-time score
  const htScore = htEvent?.result || fixtureData?.ht_scores || "";

  // Find the full-time score
  const homeScore = fixtureData?.home_live_goals || "0";
  const awayScore = fixtureData?.away_live_goals || "0";
  const ftScore = ftEvent?.result || `${homeScore} - ${awayScore}`;

  // Organize events by half
  const firstHalfEvents = allEvents.filter(
    (event) => event.timeValue < 45.5 && event.status !== "HT"
  );

  const secondHalfEvents = allEvents.filter(
    (event) => event.timeValue > 45.5 && event.status !== "FT"
  );

  // Determine if we should show HT and FT sections
  const showHalfTime =
    hasReachedHalfTime() && (firstHalfEvents.length > 0 || htScore);
  const showFullTime =
    hasReachedFullTime() && (secondHalfEvents.length > 0 || ftScore);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events]);

  // Function to render individual event
  const renderEvent = (event: any) => {
    // Skip HT and FT events as we'll handle them separately
    if (event.status === "HT" || event.status === "FT") {
      return null;
    }

    // Determine if it's a special event
    const isSpecialEvent = event.team === "";

    // Determine which team the event belongs to
    const isHomeEvent = event.team === "hometeam";
    const isAwayEvent = event.team === "awayteam";

    // Get player name and assist
    const playerName = event.player || "";
    const assistName = event.assist || "";

    // Get event icon
    const icon = getEventIcon(event.event_type, event.event_detail);
    const eventDetails = event.event_detail;

    return (
      <div
        key={event.id}
        className={`mb-2 rounded-lg overflow-hidden ${primaryBg} relative`}
      >
        {isSpecialEvent ? (
          // Special events
          <div className="p-3">
            <div className="flex items-center">
              <span className="text-gray-300 text-base w-10">
                {event.displayTime}
              </span>

              <div className="flex-1 items-center text-center">
                <span className="text-white text-base font-medium">
                  {event.player || "Match Update"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Regular events with left/right alignment based on team
          <div className="p-3">
            <div className="flex items-center gap-4">
              {/* Time column - always on the left */}
              <span
                className={`${
                  fixtureData?.status === "FT" ||
                  fixtureData?.status === "PST" ||
                  fixtureData?.status === "CANC"
                    ? secondaryTextColor
                    : "text-[#FFA726]"
                } font-medium text-base`}
              >
                {event.displayTime}
              </span>

              <div className="flex-1 flex items-center">
                {isHomeEvent ? (
                  // Home team event (left side)
                  <div className="flex items-center w-full">
                    <div>
                      <p
                        className={`${textColor} font-bold w-32 text-left truncate`}
                      >
                        {playerName}
                      </p>
                      {assistName && (
                        <p
                          className={`${secondaryTextColor} font-medium text-sm w-32 text-left truncate`}
                        >
                          {event.event_type?.toLowerCase() === "goal"
                            ? "Assist: "
                            : ""}
                          {assistName}
                        </p>
                      )}
                    </div>
                    {icon && (
                      <div className="absolute left-[43%] flex gap-2">
                        <div>{icon}</div>
                        <span className={`text-sm ${secondaryTextColor}`}>
                          ({eventDetails})
                        </span>
                      </div>
                    )}
                  </div>
                ) : isAwayEvent ? (
                  // Away team event (right side)
                  <div className="flex items-center justify-end w-full">
                    {icon && (
                      <div className="absolute right-[50%] flex gap-2">
                        <span className={`text-sm ${secondaryTextColor}`}>
                          ({eventDetails})
                        </span>
                        <div>{icon}</div>
                      </div>
                    )}
                    <div className="text-right">
                      <p
                        className={`${textColor} font-bold text-sm w-40 text-right truncate`}
                      >
                        {playerName}
                      </p>
                      {assistName && (
                        <p
                          className={`${secondaryTextColor} font-medium text-sm w-40 text-right truncate`}
                        >
                          {event.event_type?.toLowerCase() === "goal"
                            ? "Assist: "
                            : ""}
                          {assistName}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  // Fallback for events without team specification
                  <div className="flex items-center justify-center w-full">
                    <p className="text-white font-bold">{playerName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 px-4">
      <div ref={scrollRef} className="h-full overflow-y-auto">
        {/* First half events */}
        {firstHalfEvents.map((event) => renderEvent(event))}

        {/* Half Time marker - only show if match has reached half time */}
        {showHalfTime && (
          <div
            className={`mb-2 rounded-lg overflow-hidden ${primaryBg} relative`}
          >
            <div className="p-3">
              <div className="flex items-center">
                <span className={`${secondaryTextColor} text-base w-12`}>
                  HT
                </span>
                {htScore && (
                  <span
                    className={`${textColor} text-md font-bold absolute left-[47%]`}
                  >
                    {htScore}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Second half events */}
        {secondHalfEvents.map((event) => renderEvent(event))}

        {/* Full Time marker - only show if match has reached full time */}
        {showFullTime && (
          <div
            className={`mb-2 rounded-lg overflow-hidden ${primaryBg} relative`}
          >
            <div className="p-3">
              <div className="flex items-center">
                <span className={`${secondaryTextColor} text-base w-12`}>
                  FT
                </span>
                <span
                  className={`${textColor} text-md font-bold absolute left-[47%]`}
                >
                  {ftScore}
                </span>
              </div>
            </div>
          </div>
        )}

        {allEvents.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-center">
              No match events available yet
            </p>
          </div>
        )}

        {/* Add some padding at the bottom for better scrolling */}
        <div className="h-10"></div>
      </div>
    </div>
  );
}
