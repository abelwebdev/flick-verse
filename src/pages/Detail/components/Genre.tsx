import { memo } from "react";
import { useTheme } from "@/context/themeContext";

const Genre = ({ name }: { name: string }) => {
  const { theme } = useTheme();
  const isDark = theme === "Dark";
  const base = "md:text-[12.75px] sm:text-[12px] xs:text-[11.75px] text-[10.75px] sm:py-1 py-[2.75px] sm:px-3 px-[10px] rounded-full";
  const tone = isDark
    ? "border border-white/80 text-gray-300 bg-transparent"
    : "border border-black/70 text-gray-800 bg-white/80";

  return <span className={`${base} ${tone}`}>{name}</span>;
};

export default memo(Genre);
