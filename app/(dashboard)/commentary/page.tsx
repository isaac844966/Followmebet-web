"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import MatchHeader from "@/components/commentary/MatchHeader";
import TabNavigation from "@/components/commentary/TabNavigation";
import CommentaryTab from "@/components/commentary/CommentaryTab";
import { useLiveFixtureData } from "@/hooks/use-live-fixture-data";
import { useMatchEvents } from "@/hooks/use-match-event";
import { useStandings } from "@/hooks/use-standing";
import StandingsTab from "@/components/commentary/StandingsTabs";
import BackButton from "@/components/BackButton";

export default function CommentaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode } = useTheme();

  const eventCode = searchParams.get("eventCode") || "";
  const team1Name = searchParams.get("team1Name") || "";
  const team2Name = searchParams.get("team2Name") || "";
  const team1Logo = searchParams.get("team1Logo") || "";
  const team2Logo = searchParams.get("team2Logo") || "";
  const category = searchParams.get("category") || "";
  const categoryId = searchParams.get("categoryId") || "";

  // Get live fixture data using our custom hook
  const { liveFixtureData } = useLiveFixtureData();
  const fixtureData = eventCode ? liveFixtureData[eventCode] : null;

  // Get match events using our custom hook
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
  } = useMatchEvents(eventCode);

  // Tab state
  const [activeTab, setActiveTab] = useState(0); // 0 for Commentary, 1 for Standings

  // Get standings data using our custom hook
  const {
    standings,
    loading: standingsLoading,
    error: standingsError,
    leagueName,
  } = useStandings(categoryId, activeTab === 1);

  const backgroundColor = isDarkMode ? "bg-[#0B0B3F]" : "bg-white";
  const primaryBg = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-500";

  const handleNavigate = () => {
    router.push("/create-bet");
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  // Get team names and scores
  const team1 = fixtureData?.teamA || team1Name || "Team 1";
  const team2 = fixtureData?.teamB || team2Name || "Team 2";
  const homeScore = fixtureData?.home_live_goals || "0";
  const awayScore = fixtureData?.away_live_goals || "0";
  const matchStatus = fixtureData?.status || "NS";
  const matchMinute = fixtureData?.status_elapse || "";

  // Reusable loading component
  const LoadingIndicator = () => (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 className="h-8 w-8 xs:h-6 xs:w-6 text-primary animate-spin" />
    </div>
  );

  // Reusable error component
  const ErrorComponent = ({ error }: { error: string }) => (
    <div className="flex-1 flex items-center justify-center p-4 xs:p-2">
      <p className={`${textColor} text-center mb-4 xs:text-sm`}>{error}</p>
    </div>
  );

  // Calculate the total height of fixed elements for content padding
  // Back button (56px) + Match header (approx 120px) + Tab navigation (48px)
  const fixedHeaderHeight = "224px";

  return (
    <div className={`min-h-screen ${backgroundColor}`}>
      {/* Fixed Header Section */}
      <div className={`fixed top-0 left-0 right-0 z-10 ${backgroundColor}`}>
        {/* Back Button */}
          <BackButton title="Commentary" />

        {/* Match Header */}
        <MatchHeader
          team1={team1}
          team2={team2}
          team1Logo={team1Logo}
          team2Logo={team2Logo}
          homeScore={homeScore as string}
          awayScore={awayScore as string}
          matchStatus={matchStatus}
          matchMinute={matchMinute}
          primaryBg={primaryBg}
          textColor={textColor}
          isDarkMode={isDarkMode}
        />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Content Area with padding to account for fixed header */}
      <div className={`pt-[${fixedHeaderHeight}] xs:pt-[270px] min-h-screen`}>
        {/* Tab Content */}
        <div className="h-full">
          {/* Commentary Tab */}
          {activeTab === 0 && (
            <>
              {eventsLoading ? (
                <LoadingIndicator />
              ) : eventsError ? (
                <ErrorComponent error={eventsError} />
              ) : (
                <CommentaryTab
                  events={events}
                  fixtureData={fixtureData}
                  primaryBg={primaryBg}
                  textColor={textColor}
                  secondaryTextColor={secondaryTextColor}
                  isDarkMode={isDarkMode}
                />
              )}
            </>
          )}

          {/* Standings Tab */}
          {activeTab === 1 && (
            <>
              {standingsLoading ? (
                <LoadingIndicator />
              ) : standingsError ? (
                <ErrorComponent error={standingsError} />
              ) : (
                <StandingsTab
                  standings={standings}
                  loading={standingsLoading}
                  error={standingsError}
                  leagueName={leagueName}
                  categoryId={categoryId}
                  primaryBg={primaryBg}
                  textColor={textColor}
                  secondaryTextColor={secondaryTextColor}
                  team1Name={team1}
                  team2Name={team2}
                  isDarkMode={isDarkMode}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
