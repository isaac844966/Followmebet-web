import { ChevronRightIcon as Chevron } from "lucide-react";
import type {
  FixtureCategory,
  FixtureItem as FixtureItemType,
} from "@/lib/services/fixtureService";
import SpecialFixtureItem from "./special-item";
import type { JSX } from "react/jsx-runtime"; 

interface SpecialFixtureCategoryProps {
  category: FixtureCategory;
  isDarkMode: boolean;
  textColor: string;
  secondaryTextColor: string;
  router: any;
}

const SpecialFixtureCategory = ({
  category,
  isDarkMode,
  textColor,
  secondaryTextColor,
  router,
}: SpecialFixtureCategoryProps): JSX.Element => {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-2 px-4">
        <p className={`${textColor} font-medium text-sm`}>
          {category.category}
        </p>
        <span className={`${secondaryTextColor} text-md font-bold`}>
          <Chevron
            className={isDarkMode ? "text-white" : "text-black"}
            size={16}
          />
        </span>
      </div>

      {category.items.map((fixture: FixtureItemType) => (
        <div key={fixture.id} className="px-4">
          <SpecialFixtureItem
            fixture={fixture}
            categoryId={category.id}
            isDarkMode={isDarkMode}
            textColor={textColor}
            secondaryTextColor={secondaryTextColor}
            router={router}
          />
        </div>
      ))}
    </div>
  );
};

export default SpecialFixtureCategory;
