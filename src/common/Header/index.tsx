import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BsMoonStarsFill } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { FiSun } from "react-icons/fi";
import throttle from "lodash.throttle";
import { GoSearch } from "react-icons/go";

import { ThemeMenu, Logo } from "..";
import HeaderNavItem from "./HeaderNavItem";

import { useGlobalContext } from "@/context/globalContext";
import { useTheme } from "@/context/themeContext";
import { maxWidth, textColor } from "@/styles";
import { navLinks } from "@/constants";
import { THROTTLE_DELAY } from "@/utils/config";
import { cn } from "@/utils/helper";

const Header = () => {
  const { openMenu, theme, showThemeOptions } = useTheme();
  const { setShowSidebar } = useGlobalContext();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isNotFoundPage, setIsNotFoundPage] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const handleBackgroundChange = () => {
      const body = document.body;
      if (
        window.scrollY > 0 ||
        (body.classList.contains("no-scroll") &&
          parseFloat(body.style.top) * -1 > 0)
      ) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    const throttledHandleBackgroundChange = throttle(
      handleBackgroundChange,
      THROTTLE_DELAY
    );

    window.addEventListener("scroll", throttledHandleBackgroundChange);

    return () => {
      window.removeEventListener("scroll", throttledHandleBackgroundChange);
    };
  }, []);

  useEffect(() => {
    if (location.pathname.split("/").length > 3) {
      setIsNotFoundPage(true);
    } else {
      setIsNotFoundPage(false);
    }
  }, [location.pathname]);

  const isDetailPage = location.pathname.split("/").length === 3 && !location.pathname.startsWith("/search");


  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) {
      navigate("/search/");
      return;
    }
    navigate(`/search/${encodeURIComponent(trimmed)}`);
  };

  return (
    <header
      className={cn(
        `md:py-[16px] py-[14.5px]  fixed top-0 left-0 w-full z-[60] transition-all duration-50`,
        isDetailPage
          ? `dark:bg-black bg-mainColor`
          : isActive && (theme === "Dark" ? "header-bg--dark" : "header-bg--light")
      )}
    >
      <nav
        className={cn(maxWidth, `flex justify-between flex-row items-center`)}
      >
        <Logo
          logoColor={cn(
            isNotFoundPage
              ? "text-black dark:text-primary"
              : !isNotFoundPage && (isActive || isDetailPage)
              ? "text-black dark:text-primary"
              : "text-primary"
          )}
        />

        <div className="hidden md:flex flex-row gap-8 items-center text-gray-600 dark:text-gray-300">
          <ul className="flex flex-row gap-8 capitalize text-[14.75px] font-medium">
            {navLinks.map((link: { title: string; path: string }) => {
              return (
                <HeaderNavItem
                  key={link.title}
                  link={link}
                  isNotFoundPage={isNotFoundPage}
                  showBg={isActive || isDetailPage}
                />
              );
            })}
          </ul>

          <form onSubmit={onSearchSubmit} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search Movies and TV`}
                className={cn(
                  "py-[6px] pl-5 pr-10 rounded-full outline-none w-[100px] md:w-[250px] text-[14px] font-medium transition-all duration-200 border border-gray-300 dark:border-transparent",
                  isActive || isDetailPage
                    ? "bg-white/90 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    : "bg-white/80 text-gray-800 dark:bg-[#302d3a] dark:text-primary"
                )}
                aria-label="Search"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#73f340]">
                <GoSearch style={{ color: "#73f340" }} />
              </button>
            </div>
          </form>

          <div className="button relative">
            <button
              name="theme-menu"
              type="button"
              onClick={openMenu}
              id="theme"
              className={cn(
                `flex items-center justify-center mb-[2px] transition-all duration-100 hover:scale-110`,
                isNotFoundPage || isActive || isDetailPage
                  ? ` ${textColor} dark:hover:text-secColor hover:text-black `
                  : ` dark:hover:text-secColor text-gray-300 `
              )}
            >
              {theme === "Dark" ? <BsMoonStarsFill /> : <FiSun />}
            </button>
            <AnimatePresence>
              {showThemeOptions && <ThemeMenu />}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          name="menu"
          className={cn(
            `inline-block text-[22.75px] md:hidden  transition-all duration-300`,
            isNotFoundPage || isActive || isDetailPage
              ? `${textColor} dark:hover:text-secColor hover:text-black `
              : ` dark:hover:text-secColor text-secColor`
          )}
          onClick={() => setShowSidebar(true)}
        >
          <AiOutlineMenu />
        </button>
      </nav>
    </header>
  );
};

export default Header;
