import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useParams } from "react-router-dom";

import { Poster, Loader, Error } from "@/common";
import { Casts, Genre } from "./components";

import { useGetShowQuery } from "@/services/TMDB";
import { useMotion } from "@/hooks/useMotion";
import { mainHeading, maxWidth, paragraph } from "@/styles";
import { cn } from "@/utils/helper";
import { useTheme } from "@/context/themeContext";
import { getServerUrls, ServerUrlItem } from "@/utils/urls";

const Detail = () => {
  const { category, id } = useParams();
  const [show, setShow] = useState<Boolean>(false);
  const { fadeDown, staggerContainer } = useMotion();

  const { data: movie, isLoading, isFetching, isError } = useGetShowQuery({
    category: String(category),
    id: Number(id),
  });
  const { theme } = useTheme();
  const isDark = theme === "Dark";
  const servers: ServerUrlItem[] = getServerUrls(String(id));
  const [activeServerKey, setActiveServerKey] = useState<string>(servers[0]?.key || "vidsrc");
  const activeServerUrl =
    servers.find((s) => s.key === activeServerKey)?.url || servers[0]?.url;

  useEffect(() => {
    document.title =
      (movie?.title || movie?.name) && !isLoading
        ? movie.title || movie.name
        : "Flick Verse";
    return () => {
      document.title = "Flick Verse";
    };
  }, [movie?.title, isLoading, movie?.name]);

  const toggleShow = () => setShow((prev) => !prev);

  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error="Something went wrong!" />;
  }

  const {
    title,
    poster_path: posterPath,
    overview,
    name,
    genres,
    credits,
    vote_average,
    runtime,
    release_date,
    first_air_date,
    episode_run_time,
  } = movie;
  const displayYear = (release_date || first_air_date || "").slice(0, 4);
  const runtimeMinutes = typeof runtime === "number" && runtime > 0
    ? runtime
    : Array.isArray(episode_run_time) && episode_run_time.length > 0
      ? episode_run_time[0]
      : undefined;
  const displayRating = typeof vote_average === "number" ? vote_average.toFixed(1) : undefined;
  

  const lightBackgroundStyle = {
    backgroundImage: `linear-gradient(to top, rgba(255,255,255,0.96), rgba(255,255,255,0.92), rgba(255,255,255,0.85), rgba(255,255,255,0.6)), url('https://image.tmdb.org/t/p/original/${posterPath}'`,
    backgroundPosition: "top",
    backgroundSize: "cover",
  } as const;

  return (
    <>
      <section className="w-full relative z-0 pt-[50px] md:pt-[60px] dark:bg-black bg-mainColor" style={isDark ? undefined : lightBackgroundStyle}>
        <div className="relative md:order-1 order-2 w-full z-0 h-[calc(100vh-60px)] md:h-[calc(100vh-60px)]">
          <iframe
            src={activeServerUrl}
            className="absolute inset-0 w-full h-full"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Movie Player"
          ></iframe>
        </div>
        <div className={cn(maxWidth, "w-full mt-3 md:mt-4 flex items-center justify-center")}> 
          <label htmlFor="server-select" className={cn("mr-2 text-sm", isDark ? "text-gray-200" : "text-gray-700")}>Server:</label>
          <select
            id="server-select"
            value={activeServerKey}
            onChange={(e) => setActiveServerKey(e.target.value)}
            className={cn(
              "px-3 py-2 rounded border text-sm outline-none",
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-secColor"
                : "bg-white border-gray-300 text-gray-800 focus:border-black"
            )}
          >
            {servers.map((server) => (
              <option key={server.key} value={server.key}>
                {server.name}
              </option>
            ))}
          </select>
        </div>
        <div className={`${maxWidth} pt-2 md:pt-5 mt-5 lg:pt-4 sm:pb-28 xs:pb-10 pb-8 flex md:flex-row flex-col lg:gap-12 md:gap-10 gap-6 items-center md:items-start justify-center md:order-2 order-1 relative z-10`}>
          <Poster title={title} posterPath={posterPath} />
          <m.div
            variants={staggerContainer(0.2, 0.4)}
            initial="hidden"
            animate="show"
            className={`relative z-10 ${isDark ? "text-gray-300" : "text-gray-800"} sm:max-w-[80vw] max-w-[90vw] md:max-w-[520px] font-nunito flex flex-col lg:gap-5 sm:gap-4 xs:gap-[14px] gap-3 mb-8 flex-1 will-change-transform motion-reduce:transform-none`}
          >
            <m.h2
              variants={fadeDown}
              className={cn(mainHeading, `${isDark ? "text-gray-100" : "text-gray-900"} md:max-w-[420px] will-change-transform motion-reduce:transform-none`)}
            >
              {title || name}
            </m.h2>
            <m.ul
              variants={fadeDown}
              className="flex flex-row items-center  sm:gap-[14px] xs:gap-3 gap-[6px] flex-wrap will-change-transform motion-reduce:transform-none"
            >
              {genres.map((genre: { name: string; id: number }) => {
                return <Genre key={genre.id} name={genre.name} />;
              })}
            </m.ul>
            <m.p variants={fadeDown} className={`${paragraph} ${isDark ? "text-gray-300" : "text-gray-800"} will-change-transform motion-reduce:transform-none`}>
              <span>
                {overview.length > 280
                  ? `${show ? overview : `${overview.slice(0, 280)}...`}`
                  : overview}
              </span>
              <button
                type="button"
                className={cn(
                  `font-bold ml-1 hover:underline transition-all duration-300`,
                  overview.length > 280 ? "inline-block" : "hidden"
                )}
                onClick={toggleShow}
              >
                {!show ? "show more" : "show less"}
              </button>
            </m.p>
            {(runtimeMinutes || displayRating || displayYear) && (
              <div className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"} flex flex-wrap items-center gap-x-4 gap-y-1`}>
                {runtimeMinutes !== undefined && (
                  <span>
                    <span className="font-semibold">Runtime:</span> {runtimeMinutes} min
                  </span>
                )}
                {displayRating && (
                  <span className="inline-flex items-center gap-1">
                    <span className="font-semibold">Rating:</span>
                    <span className="text-yellow-400">★</span>
                    {displayRating}
                  </span>
                )}
                {displayYear && (
                  <span>
                    <span className="font-semibold">Year:</span> {displayYear}
                  </span>
                )}
              </div>
            )}
            <Casts casts={credits?.cast || []} />
          </m.div>
        </div>
      </section>
    </>
  );
};

export default Detail;
