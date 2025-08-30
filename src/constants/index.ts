import { FiSun } from "react-icons/fi";
import { BsMoonStarsFill } from "react-icons/bs";
import { GoDeviceDesktop } from "react-icons/go";
import { TbMovie } from "react-icons/tb";
import { MdOutlineLiveTv } from "react-icons/md";

import { ITheme, INavLink } from "../types";

export const navLinks: INavLink[] = [
  {
    title: "movies",
    path: "/movies",
    icon: TbMovie,
  },
  {
    title: "tv series",
    path: "/tv",
    icon: MdOutlineLiveTv,
  },
];

export const themeOptions: ITheme[] = [
  {
    title: "Dark",
    icon: BsMoonStarsFill,
  },
  {
    title: "Light",
    icon: FiSun,
  },
  {
    title: "System",
    icon: GoDeviceDesktop,
  },
];

export const sections = [
  {
    title: "Movies",
    category: "movie",
    type: "popular",
  },
  {
    title: "Series",
    category: "tv",
    type: "popular",
  },
];
