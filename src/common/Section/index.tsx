import { memo, FC } from "react";
import { Link } from "react-router-dom";

import MoviesSlides from "./MoviesSlides";
import { useTheme } from "@/context/themeContext";
import { cn } from "@/utils/helper";

interface SectionProps {
  title: string;
  category: string;
  className?: string;
  data?: { results?: any[] };
  type?: string;
  id?: number;
  showSimilarShows?: boolean;
}

const Section: FC<SectionProps> = ({
  title,
  category,
  className,
  data: initialData,
  type,
  id,
  showSimilarShows,
}) => {
  const { theme } = useTheme();
  const hasInitialData = Boolean(initialData && initialData.results);

  const sectionStyle = cn(
    `sm:py-[20px] xs:py-[18.75px] py-[16.75px] font-nunito`,
    className
  );
  const linkStyle = cn(
    `sm:py-1 py-[2px] sm:text-[14px] xs:text-[12.75px] text-[12px] sm:px-4 px-3 rounded-full  dark:text-gray-300 hover:-translate-y-1 transition-all duration-300`,
    theme === "Dark" ? "view-all-btn--dark" : "view-all-btn--light"
  );

  return (
    <section className={sectionStyle}>
      <div className="flex flex-row justify-between items-center mb-[22.75px]">
        <div className=" relative">
          <h3 className="sm:text-[22.25px] xs:text-[20px] text-[18.75px] dark:text-gray-50 sm:font-bold font-semibold">{title}</h3>
          <div className="line" />
        </div>
        {!showSimilarShows && (
          <Link
            to={`/${category === "movie" ? "movies" : category}`}
            className={linkStyle}
          >
            View all
          </Link>
        )}
      </div>
      <div>
        <MoviesSlides movies={(hasInitialData ? (initialData!.results ?? []) : []).slice(0, 20) as any} category={category} />
      </div>
    </section>
  );
};

export default memo(Section);
