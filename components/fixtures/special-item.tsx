import Image from "next/image";
import { format, parseISO } from "date-fns";
import type { FixtureItem as FixtureItemType } from "@/lib/services/fixtureService";
import { Button } from "@/components/ui/button";
import TeamDisplay from "./team-display"; // Declare the TeamDisplay component

interface TeamInfo {
  name: string;
  logoUrl?: string;
}

interface TeamDisplayProps {
  team1: TeamInfo;
  team2: TeamInfo;
  textColor: string;
}

interface SpecialFixtureItemProps {
  fixture: FixtureItemType;
  categoryId: string;
  isDarkMode: boolean;
  textColor: string;
  secondaryTextColor: string;
  router: any;
}

const SpecialFixtureItem = ({
  fixture,
  categoryId,
  isDarkMode,
  textColor,
  secondaryTextColor,
  router,
}: SpecialFixtureItemProps) => {
  const matchTime = fixture.time ? format(parseISO(fixture.time), "HH:mm") : "";
  const matchDate = fixture.time ? format(parseISO(fixture.time), "d MMM") : "";
  const cardBackground = isDarkMode ? "bg-[#1A1942]" : "bg-[#f1f5f9]";

  const handleCreateBet = (): void => {
    const fixtureData = encodeURIComponent(JSON.stringify(fixture));
    router.push(
      `/create-bet/${fixture.id}?categoryId=${categoryId}&fixtureData=${fixtureData}&fromFixtureId=true&activeTab=special`
    );
  };

  if (fixture.betStatus === "ON") {
    return (
      <div className={`${cardBackground} rounded-lg mb-1 overflow-hidden`}>
        <div className="p-3 flex items-center justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="border-r border-r-[#62629e] pr-4">
                <p
                  className={`${textColor} text-md w-10 mb-1 text-center font-bold`}
                >
                  {matchDate}
                </p>
                <p className={`${secondaryTextColor} text-md`}>{matchTime}</p>
              </div>
              <TeamDisplay
                team1={fixture.item1}
                team2={fixture.item2}
                textColor={textColor}
              />
            </div>
          </div>
          <Button
            className={`${
              isDarkMode ? "bg-[#0B0B3F]" : "bg-[#E8E8FF]"
            } px-4 py-4 rounded-lg hover:bg-opacity-90`}
            onClick={handleCreateBet}
          >
            <span
              className={`${isDarkMode ? "text-white" : "text-black"} text-xs`}
            >
              Create New Bet
            </span>
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default SpecialFixtureItem;
