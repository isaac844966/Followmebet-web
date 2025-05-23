"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import MatchHeader from "@/components/commentary/MatchHeader";
import TabNavigation from "@/components/commentary/TabNavigation";
import CommentaryTab from "@/components/commentary/CommentaryTab";
import { useLiveFixtureData } from "@/hooks/use-live-fixture-data";
import { useMatchEvents } from "@/hooks/use-match-event";
import { useStandings } from "@/hooks/use-standing";
import StandingsTab from "@/components/commentary/StandingsTabs";
import BackButton from "@/components/BackButton";
import LoadingSpinner from "@/components/LoadingSpinner";

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

  const { liveFixtureData } = useLiveFixtureData();
  const fixtureData = eventCode ? liveFixtureData[eventCode] : null;

  const {
    events,
    loading: eventsLoading,
    error: eventsError,
  } = useMatchEvents(eventCode);

  const [activeTab, setActiveTab] = useState(0);

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


  return (
    <div
      className={`h-screen flex flex-col ${backgroundColor} overflow-hidden`}
    >
      <div className={`${backgroundColor}`}>
        <BackButton title="Commentary" />

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
          category={category}
        />

        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          {activeTab === 0 && (
            <div className="h-full overflow-y-auto">
              {eventsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <LoadingSpinner
                    variant="circular"
                    size="lg"
                    color={isDarkMode ? "text-[#FBB03B]" : "text-[#1E1F68]"}
                  />
                </div>
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
            </div>
          )}

          {/* Standings Tab */}
          {activeTab === 1 && (
            <div className="h-full overflow-y-auto">
              {standingsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <LoadingSpinner
                    variant="circular"
                    size="lg"
                    color={isDarkMode ? "text-[#FBB03B]" : "text-[#1E1F68]"}
                  />
                </div>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
