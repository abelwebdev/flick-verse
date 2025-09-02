import { memo, FC } from "react";
import { m } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import { mainHeading } from "@/styles";
import { useTheme } from "@/context/themeContext";
import { cn } from "@/utils/helper";
import Image from "@/common/Image";
import { useMotion } from "@/hooks/useMotion";

interface CastsProps {
  casts: {
    id: string;
    profile_path: string;
    name: string;
    character?: string;
  }[];
}

const Casts: FC<CastsProps> = ({ casts }) => {
  const isNotMobile = useMediaQuery("(min-width: 768px)");
  const { fadeDown, staggerContainer } = useMotion();
  const topCasts = casts.slice(0, 6);
  const { theme } = useTheme();
  const isDark = theme === "Dark";
  if (topCasts.length === 0) return null;

  return (
    <>
      <m.h3
        variants={fadeDown}
        className={cn(
              mainHeading,
              `${
                isDark ? "text-gray-100" : "text-gray-900"
              } md:max-w-[420px] mb-3 will-change-transform motion-reduce:transform-none`
            )}
      >
        Top Casts
      </m.h3>
      <m.div
        variants={staggerContainer(0.2, 1)}
        initial="hidden"
        animate="show"
        className="flex flex-wrap md:gap-5 sm:gap-4 gap-3 sm:-mt-2 xs:-mt-[6px] -mt-1"
      >
        {topCasts.map((cast) => {
          const { id, profile_path: profilePath, name, character } = cast;
          return (
            <m.figure
              variants={fadeDown}
              key={id}
              className="flex flex-col items-center gap-2"
            >
              <div className="md:h-[96px] md:w-[64px] h-[54px] w-[40px]">
                <Image
                  width={isNotMobile ? 64 : 40}
                  height={isNotMobile ? 96 : 54}
                  src={`https://image.tmdb.org/t/p/original/${profilePath}`}
                  alt={name}
                  className="object-cover rounded-md shadow-md"
                />
              </div>

              <div className="flex flex-col items-center text-center md:w-[64px] w-[40px]">
                <h4 className={cn(
                    `${
                      isDark ? "text-gray-100" : "text-gray-900"
                    } md:max-w-[420px] will-change-transform motion-reduce:transform-none`,
                    "text-[10px] md:text-xs leading-tight break-words whitespace-normal overflow-hidden"
                  )}>
                  {name}
                </h4>
                {character && (
                  <p className={cn(
                    `${
                      isDark ? "text-gray-100" : "text-gray-900"
                    } md:text-[10px] sm:text-[9px] text-[8px] leading-tight mt-1 italic`,
                    "break-words whitespace-normal overflow-hidden"
                  )}>
                    as {character}
                  </p>
                )}
              </div>
            </m.figure>
          );
        })}
      </m.div>
    </>
  );
};

export default memo(Casts, (prevProps, newProps) => {
  return prevProps.casts[0]?.id === newProps.casts[0]?.id;
});
