import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useParams } from "react-router-dom";

import { Poster, Loader, Error } from "@/common";
import { Casts, Genre } from "./components";

import { useGetMovieQuery, useGetTvQuery, useGetSeasonEpisodesQuery } from "@/services/TMDB";
import { useMotion } from "@/hooks/useMotion";
import { mainHeading, maxWidth, paragraph } from "@/styles";
import { cn } from "@/utils/helper";
import { useTheme } from "@/context/themeContext";
import { getMovieServerUrls, getTvServerUrls } from "@/utils/urls";

const Detail = () => {
  const { category, id } = useParams(); // params: movie | tv
  const { fadeDown, staggerContainer } = useMotion();

  // Show/hide full overview
  const [showMore, setShowMore] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);

  // Queries (skip ensures only one runs)
  const {
    data: movie,
    isLoading: isMovieLoading,
    isFetching: isMovieFetching,
    isError: isMovieError,
  } = useGetMovieQuery(
    { id: String(id) },
    { skip: category !== "movie" }
  );

  const {
    data: tv,
    isLoading: isTvLoading,
    isFetching: isTvFetching,
    isError: isTvError,
  } = useGetTvQuery(
    { id: String(id) },
    { skip: category !== "tv" }
  );

  const { data: seasonData } = useGetSeasonEpisodesQuery(
    { id: String(id), season_number: selectedSeason },
    { skip: category !== "tv" }
  );


  // Pick correct data source
  const media = category === "movie" ? movie : tv;

  const { theme } = useTheme();
  const isDark = theme === "Dark";

  const servers: ServerUrlItem[] =
    category === "movie"
      ? getMovieServerUrls(String(id))
      : getTvServerUrls(String(id), selectedSeason, selectedEpisode);
  const [activeServerKey, setActiveServerKey] = useState<string>(
    servers[0]?.key || "vidsrc"
  );
  const activeServerUrl = servers.find((s) => s.key === activeServerKey)?.url || servers[0]?.url;

  // Extract number of seasons/episodes if TV
  const numberOfSeasons = category === "tv" && (tv?.number_of_seasons || 0);
  const numberOfEpisodes = category === "tv" && (tv?.number_of_episodes || 0);


  useEffect(() => {
    if (media?.title || media?.name) {
      document.title = media.title || media.name;
    } else {
      document.title = "Flick Verse";
    }
    return () => {
      document.title = "Flick Verse";
    };
  }, [media?.title, media?.name]);
  useEffect(() => {
    if (category === "tv" && id) {
      const tvServers = getTvServerUrls(String(id), selectedSeason, selectedEpisode);
      setActiveServerKey(tvServers[0]?.key || "vidsrc");
    }
  }, [id, category, selectedSeason, selectedEpisode]);

  // Loading & Error states
  if (isMovieLoading || isTvLoading || isMovieFetching || isTvFetching) {
    return <Loader />;
  }
  if (isTvError || isMovieError) {
    return <Error error="Something went wrong!" />;
  }

  
  // Destructure safely from media
  const {
    title,
    poster_path: posterPath,
    overview = "",
    name,
    genres = [],
    credits,
    vote_average,
    runtime,
    release_date,
    first_air_date,
    episode_run_time,
  } = media || {};

  const displayYear = (release_date || first_air_date || "").slice(0, 4);

  const runtimeMinutes =
    typeof runtime === "number" && runtime > 0
      ? runtime
      : Array.isArray(episode_run_time) && episode_run_time.length > 0
      ? episode_run_time[0]
      : undefined;

  const displayRating =
    typeof vote_average === "number" ? vote_average.toFixed(1) : undefined;

  const lightBackgroundStyle = {
    backgroundImage: `linear-gradient(to top, rgba(255,255,255,0.96), rgba(255,255,255,0.92), rgba(255,255,255,0.85), rgba(255,255,255,0.6)), url('https://image.tmdb.org/t/p/original/${posterPath}'`,
    backgroundPosition: "top",
    backgroundSize: "cover",
  } as const;
  

  return (
    <section className="w-full relative z-0 pt-[50px] md:pt-[60px] dark:bg-black bg-mainColor" style={isDark ? undefined : lightBackgroundStyle}>
      {/* Player */}
      <div className="relative md:order-1 order-2 w-full z-0 h-[calc(100vh-60px)] md:h-[calc(100vh-60px)]">
        <iframe
          src={activeServerUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Movie Player"
        ></iframe>
      </div>
      {/* Server Selector */}
      <div
        className={cn(
          maxWidth,
          "w-full mt-3 md:mt-4 flex items-center justify-center"
        )}
      >
        <label
          htmlFor="server-select"
          className={cn(
            "mr-2 text-sm",
            isDark ? "text-gray-200" : "text-gray-700"
          )}
        >
          Server:
        </label>
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
      {/* Season & Episode Selector) */}
      {category === "tv" && tv && (
        <div className={cn(maxWidth, "w-full mt-4 flex flex-col gap-4")}>
          {/* Season Selector */}
          <div className="flex items-center gap-3">
            <label
              className={cn("text-sm", isDark ? "text-gray-200" : "text-gray-700")}
            >
              Season:
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => {
                setSelectedSeason(Number(e.target.value));
                setSelectedEpisode(1); // reset episode when season changes
              }}
              className={cn(
                "px-3 py-2 rounded border text-sm outline-none",
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-secColor"
                  : "bg-white border-gray-300 text-gray-800 focus:border-black"
              )}
            >
              {Array.from({ length: tv.number_of_seasons || 1 }, (_, i) => i + 1).map(
                (seasonNum) => (
                  <option key={seasonNum} value={seasonNum}>
                    Season {seasonNum}
                  </option>
                )
              )}
            </select>
          </div>
          {/* Episode Grid */}
          <div>
            <h4 className={cn("mb-2 text-sm font-semibold", isDark ? "text-gray-200" : "text-gray-800")}>
              Episodes:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {seasonData?.episodes?.map((ep: any) => (
              <button
                key={ep.id}
                onClick={() => setSelectedEpisode(ep.episode_number)}
                className={cn(
                  "px-3 py-2 rounded text-sm border w-full relative overflow-hidden",
                  selectedEpisode === ep.episode_number
                    ? isDark
                      ? "bg-gray-700 text-white border-gray-700" // same as hover dark
                      : "bg-gray-200 text-gray-900 border-gray-200" // same as hover light
                    : isDark
                    ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                )}
              >
                <span className="block whitespace-nowrap overflow-hidden hover:animate-scroll-text">
                  {ep.name && !ep.name.toLowerCase().startsWith("episode")
                    ? ep.episode_number + ". " + ep.name
                    : `Episode ${ep.episode_number}`}
                </span>
              </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Details */}
      <div
        className={`${maxWidth} pt-2 md:pt-5 mt-5 lg:pt-4 sm:pb-28 xs:pb-10 pb-8 flex md:flex-row flex-col lg:gap-12 md:gap-10 gap-6 items-center md:items-start justify-center md:order-2 order-1 relative z-10`}
      >
        <Poster title={title} posterPath={posterPath} />

        <m.div
          variants={staggerContainer(0.2, 0.4)}
          initial="hidden"
          animate="show"
          className={`relative z-10 ${
            isDark ? "text-gray-300" : "text-gray-800"
          } sm:max-w-[80vw] max-w-[90vw] md:max-w-[520px] font-nunito flex flex-col lg:gap-5 sm:gap-4 xs:gap-[14px] gap-3 mb-8 flex-1 will-change-transform motion-reduce:transform-none`}
        >
          <m.h2
            variants={fadeDown}
            className={cn(
              mainHeading,
              `${
                isDark ? "text-gray-100" : "text-gray-900"
              } md:max-w-[420px] will-change-transform motion-reduce:transform-none`
            )}
          >
            {title || name}
          </m.h2>

          <m.ul
            variants={fadeDown}
            className="flex flex-row items-center sm:gap-[14px] xs:gap-3 gap-[6px] flex-wrap"
          >
            {genres.map((genre: { name: string; id: number }) => (
              <Genre key={genre.id} name={genre.name} />
            ))}
          </m.ul>

          {/* Overview with toggle */}
          <m.p
            variants={fadeDown}
            className={`${paragraph} ${
              isDark ? "text-gray-300" : "text-gray-800"
            }`}
          >
            <span>
              {overview.length > 280
                ? showMore
                  ? overview
                  : `${overview.slice(0, 280)}...`
                : overview}
            </span>
            {overview.length > 280 && (
              <button
                type="button"
                className="font-bold ml-1 hover:underline transition-all duration-300"
                onClick={() => setShowMore((prev) => !prev)}
              >
                {!showMore ? "show more" : "show less"}
              </button>
            )}
          </m.p>

          {/* Extra info */}
          {(runtimeMinutes || displayRating || displayYear) && (
            <div
              className={`text-sm ${
                isDark ? "text-gray-200" : "text-gray-700"
              } flex flex-wrap items-center gap-x-4 gap-y-1`}
            >
              {runtimeMinutes && (
                <span>
                  <span className="font-semibold">Runtime:</span>{" "}
                  {runtimeMinutes} min
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
              {category === "tv" && numberOfSeasons && (
                <span>
                  <span className="font-semibold">Seasons:</span> {numberOfSeasons}
                </span>
              )}
              {category === "tv" && numberOfEpisodes && (
                <span>
                  <span className="font-semibold">Episodes:</span> {numberOfEpisodes}
                </span>
              )}
            </div>
          )}
          {/* Casts */}
          <Casts casts={credits?.cast || []} />
        </m.div>
        
      </div>
    </section>
  );
};

export default Detail;
