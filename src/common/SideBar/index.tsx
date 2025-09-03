import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, m } from "framer-motion";

import SidebarNavItem from "./SidebarNavItem";
import ThemeOption from "./SidebarThemeOption";
import Logo from "../Logo";
import Overlay from "../Overlay";

import { useGlobalContext } from "@/context/globalContext";
import { useTheme } from "@/context/themeContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useMotion } from "@/hooks/useMotion";
import { navLinks, themeOptions } from "@/constants";
import { sideBarHeading } from "@/styles";
import { INavLink } from "@/types";
import { cn } from "@/utils/helper";

const SideBar: React.FC = () => {
  const { showSidebar, setShowSidebar } = useGlobalContext();
  const { theme } = useTheme();
  const { slideIn } = useMotion();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const closeSideBar = useCallback(() => {
    setShowSidebar(false);
  }, [setShowSidebar]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) {
      closeSideBar();
      return;
    }
    navigate(`/search/${encodeURIComponent(q)}`);
    closeSideBar();
  };

  const { ref } = useOnClickOutside({
    action: closeSideBar,
    enable: showSidebar
  });

  return (
    <>
      {showSidebar && (
        <AnimatePresence>
        <Overlay>
          <m.nav
            variants={slideIn("right", "tween", 0, 0.3)}
            initial="hidden"
            animate="show"
            exit="hidden"
            ref={ref}
            className={cn(
              `fixed top-0 right-0 sm:w-[40%] xs:w-[220px] w-[195px] h-full z-[25] overflow-y-auto shadow-md md:hidden p-4 pb-0 dark:text-gray-200 text-gray-600`,
              theme === "Dark" ? "dark-glass" : "light-glass"
            )}
          >
            <div className="flex items-center justify-center  ">
              <Logo />
            </div>
            <div className="p-4 sm:pt-8  xs:pt-6 pt-[22px] h-full flex flex-col">
              <h3 className={sideBarHeading}>Menu</h3>
              <form onSubmit={onSubmit} className="mt-4 mb-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Movies and TV"
                  className="w-full py-2 px-3 rounded-md outline-none text-sm border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800 dark:text-gray-100"
                />
              </form>
              <ul className="flex flex-col sm:gap-2 xs:gap-[6px] gap-1 capitalize xs:text-[14px] text-[13.5px] font-medium">
                {navLinks.map((link: INavLink) => {
                  return (
                    <SidebarNavItem
                      link={link}
                      closeSideBar={closeSideBar}
                      key={link.title.replaceAll(" ", "")}
                    />
                  );
                })}
              </ul>
              <h3 className={cn(`mt-4 `, sideBarHeading)}>Theme</h3>
              <ul className="flex flex-col sm:gap-2 xs:gap-[4px] gap-[2px] capitalize text-[14.75px] font-medium">
                {themeOptions.map((theme) => {
                  return <ThemeOption theme={theme} key={theme.title} />;
                })}
              </ul>
            </div>
          </m.nav>
        </Overlay>
        </AnimatePresence>
      )}
    </>
  );
};

export default SideBar;
