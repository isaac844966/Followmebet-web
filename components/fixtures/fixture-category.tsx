import { ChevronRightIcon as Chevron } from "lucide-react";
import type {
  FixtureCategory,
  FixtureItem as FixtureItemType,
} from "@/lib/services/fixtureService";
import SoccerFixtureItem from "./fixture-item";
import { LiveFixtureData } from "@/hooks/use-live-fixture-data";
import type { JSX } from "react/jsx-runtime";



interface SoccerFixtureCategoryProps {
  category: FixtureCategory;
  isDarkMode: boolean;
  textColor: string;
  secondaryTextColor: string;
  liveFixtureData: Record<string, LiveFixtureData>;
  router: any;
}

const SoccerFixtureCategory = ({
  category,
  isDarkMode,
  textColor,
  secondaryTextColor,
  liveFixtureData,
  router,
}: SoccerFixtureCategoryProps): JSX.Element => {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-2 px-4">
        <p className={`${textColor} font-medium text-sm xs:text-xs`}>
          {category.category}
        </p>
        <span className={`${secondaryTextColor} text-md font-bold`}>
          <Chevron
            className={isDarkMode ? "text-white" : "text-black"}
            size={16}
          />
        </span>
      </div>

      {category.items.map((fixture: FixtureItemType, index: number) => (
        <div key={`${category.id}-${fixture.id}-${index}`} className="px-4">
          <SoccerFixtureItem
            fixture={fixture}
            categoryId={category.id}
            isDarkMode={isDarkMode}
            textColor={textColor}
            secondaryTextColor={secondaryTextColor}
            liveFixtureData={liveFixtureData}
            router={router}
          />
        </div>
      ))}
    </div>
  );
};

export default SoccerFixtureCategory;
