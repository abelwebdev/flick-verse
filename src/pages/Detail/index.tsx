import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useParams } from "react-router-dom";

import { Poster, Loader, Error } from "@/common";
import { Casts, Genre } from "./components";

import { useGetMovieQuery, useGetTvQuery, useGetSeasonEpisodesQuery, useGetVideosQuery } from "@/services/TMDB";
import { useMotion } from "@/hooks/useMotion";
import { mainHeading, maxWidth, paragraph } from "@/styles";
import { cn } from "@/utils/helper";
import { useTheme } from "@/context/themeContext";
import { getMovieServerUrls, getTvServerUrls, MovieServerUrlItem, TvServerUrlItem } from "@/utils/urls";

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
    { id: Number(id) },
    { skip: category !== "movie" }
  );

  const {
    data: tv,
    isLoading: isTvLoading,
    isFetching: isTvFetching,
    isError: isTvError,
  } = useGetTvQuery(
    { id: Number(id) },
    { skip: category !== "tv" }
  );

  const { data: seasonData } = useGetSeasonEpisodesQuery(
    { id: String(id), season_number: selectedSeason },
    { skip: category !== "tv" }
  );

  const { data: videos } = useGetVideosQuery(
    { category: category as string, id: Number(id) },
    { skip: !category }
  );

  const trailer = videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  // Pick correct data source
  const media = category === "movie" ? movie : tv;

  const { theme } = useTheme();
  const isDark = theme === "Dark";

  const servers: (MovieServerUrlItem | TvServerUrlItem)[] =
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
    production_countries = [],
    origin_country = [],

  } = media || {};

  const displayYear = (release_date || first_air_date || "").slice(0, 4);

  const runtimeMinutes =
    typeof runtime === "number" && runtime > 0
      ? runtime
      : Array.isArray(episode_run_time) && episode_run_time.length > 0
      ? episode_run_time[0]
      : undefined;

  const displayRating = typeof vote_average === "number" ? vote_average.toFixed(1) : undefined;

  const getCountryDisplay = () => {
    if (category === "movie" && production_countries?.length > 0) {
      return production_countries.map((country: any) => country.name || country.iso_3166_1).join(", ");
    }
    if (category === "tv" && origin_country?.length > 0) {
      return origin_country.join(", ");
    }
    if (production_countries?.length > 0) {
      return production_countries.map((country: any) => country.name || country.iso_3166_1).join(", ");
    }
    return null;
  };

  const displayCountry = getCountryDisplay();

  const lightBackgroundStyle = {
    backgroundImage: `linear-gradient(to top, rgba(255,255,255,0.96), rgba(255,255,255,0.92), rgba(255,255,255,0.85), rgba(255,255,255,0.6)), url('https://image.tmdb.org/t/p/original/${posterPath}'`,
    backgroundPosition: "top",
    backgroundSize: "cover",
  } as const;

  const formatDate = (str: string) =>
  new Date(str).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="w-full relative z-0 pt-[50px] md:pt-[60px] dark:bg-[#0D0D0D] bg-mainColor lg:pb-14 md:pb-4 sm:pb-2 xs:pb-1 pb-0" style={isDark ? undefined : lightBackgroundStyle}>
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
          <div className="flex flex-col gap-2">
            <h1 className="text-dark dark:text-white my-2">Seasons</h1>
            <div className="flex overflow-x-auto gap-2 pb-1">
              {tv?.seasons
                ?.filter((season: { name: string; }) => !season.name.toLowerCase().includes("special")) // skip specials
                .map((season: any, index: number) => (
                  <button
                    key={season.id || index}
                    onClick={() => {
                      setSelectedSeason(season.season_number);
                      setSelectedEpisode(1); // reset episode
                    }}
                    className={cn(
                      "my-2 flex-shrink-0 flex flex-col items-center justify-center px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all duration-150",
                      "hover:shadow-lg hover:-translate-y-0.5 hover:border-[#00ff08] dark:hover:border-[#00ff08]",
                      "bg-white dark:bg-[#141414]",

                      season.season_number === selectedSeason
                        ? "border-slate-900 dark:border-white text-slate-900 dark:text-white"
                        : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                    )}
                  >
                    <span className="font-medium">Season {index + 1}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {season.episode_count} Episodes
                    </span>
                  </button>
                ))}
            </div>
          </div>
          {/* Episode Grid */}
          <h1 className="text-dark dark:text-white">Episodes</h1>
          <div className="h-screen overflow-y-auto pr-2 w-full">
            <ul className="space-y-4">
              {seasonData?.episodes?.map((ep: any) => (
                <li
                  key={ep.id}
                  className={cn(
                    "w-full rounded-xl border p-3 mt-1 shadow-sm transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 hover:border-[#00ff08]/60",
                    "bg-white dark:bg-[#000000]",

                    selectedEpisode === ep.episode_number
                      ? "border-black dark:border-[#ffffff] dark:hover:border-[#00ff08]"
                      : "border-transparent"
                  )}
                >
                  <button
                    onClick={() => setSelectedEpisode(ep.episode_number)}
                    className={cn(
                      "w-full flex flex-col md:flex-row gap-3 md:gap-4 items-center md:items-start text-center md:text-left rounded overflow-hidden",
                      selectedEpisode === ep.episode_number
                        ? isDark
                          ? "text-white"
                          : "text-gray-900"
                        : isDark
                        ? "text-gray-200"
                        : "text-gray-800"
                    )}
                  >
                    {/* Image */}
                    <div className="relative flex-none w-full sm:w-64 md:w-48 lg:w-56 h-64 sm:h-48 md:h-36 lg:h-44 overflow-hidden rounded-lg bg-slate-200">
                      {/* Rating top-left */}
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                        ⭐ {ep.vote_average.toFixed(1)}
                      </div>

                      {/* Runtime top-right */}
                      {ep.runtime ? (
                        <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-3 h-3 mr-1"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              fill="none"
                            />
                            <path
                              d="M12 7v5l3 2"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                          <span aria-label={`Runtime ${ep.runtime} minutes`}>
                            {ep.runtime}m
                          </span>
                        </div>
                      ) : null}

                      <img
                        src={`https://image.tmdb.org/t/p/original${ep.still_path}`}
                        alt={ep.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0 p-2 md:p-0 w-full md:w-auto">
                      <h3
                        className="font-semibold text-slate-900 dark:text-slate-100 truncate"
                        style={{ fontSize: "18px" }}
                      >
                        <span
                          className="inline-block whitespace-normal sm:whitespace-nowrap"
                          title={
                            ep.name && !ep.name.toLowerCase().startsWith("episode")
                              ? `${ep.episode_number}. ${ep.name}`
                              : `Episode ${ep.episode_number}`
                          }
                        >
                          {ep.name && !ep.name.toLowerCase().startsWith("episode")
                            ? ep.episode_number + ". " + ep.name
                            : `Episode ${ep.episode_number}`}
                        </span>
                      </h3>
                      <p
                        className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4 sm:line-clamp-3"
                        style={{ fontSize: "14px" }}
                      >
                        {ep.overview}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 opacity-70 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="3" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        <span>{formatDate(ep.air_date)}</span>
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Details */}
      <div className={`${maxWidth} pt-2 md:pt-5 mt-5 lg:pt-4 sm:pb-5 xs:pb-5 pb-2 flex md:flex-row flex-col lg:gap-12 md:gap-10 gap-6 items-center md:items-start justify-center md:order-2 order-1 relative z-10`}>
        <Poster title={title} posterPath={posterPath} />
        <m.div variants={staggerContainer(0.2, 0.4)}
          initial="hidden"
          animate="show"
          className={`relative z-10 ${
            isDark ? "text-gray-300" : "text-gray-800"
          } sm:max-w-[80vw] max-w-[90vw] md:max-w-[820px] font-nunito flex flex-col lg:gap-5 sm:gap-4 xs:gap-[14px] gap-3 mb-8 flex-1 will-change-transform motion-reduce:transform-none`}
        >
          {/* Title and Genre  */}
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
          {(runtimeMinutes || displayRating || displayYear || displayCountry) && (
            <m.div
              className={`text-sm ${
                isDark ? "text-gray-200" : "text-gray-700"
              } flex flex-wrap items-center gap-x-4 gap-y-1`}
            >
              {runtimeMinutes && (
                <m.span>
                  <span className="font-semibold">Runtime:</span>{" "}
                  {runtimeMinutes} min
                </m.span>
              )}
              {displayRating && (
                <m.span className="inline-flex items-center gap-1">
                  <m.span className="font-semibold">Rating:</m.span>
                  <m.span className="text-yellow-400">★</m.span>
                  {displayRating}
                </m.span>
              )}
              {displayYear && (
                <m.span>
                  <m.span className="font-semibold">Year:</m.span> {displayYear}
                </m.span>
              )}
              {displayCountry && (
                <m.span>
                  <m.span className="font-semibold">Country:</m.span> {displayCountry}
                </m.span>
              )}
              {category === "tv" && numberOfSeasons && (
                <m.span>
                  <m.span className="font-semibold">Seasons:</m.span> {numberOfSeasons}
                </m.span>
              )}
              {category === "tv" && numberOfEpisodes && (
                <m.span>
                  <span className="font-semibold">Episodes:</span> {numberOfEpisodes}
                </m.span>
              )}
            </m.div>
          )}
          {/* Casts */}
          <div className="hidden lg:block">
            <Casts casts={credits?.cast || []} />
          </div>
         </m.div>
      </div>
      {/* Casts */}
      <div className={`${maxWidth} lg:hidden block`}>
        <Casts casts={credits?.cast || []} />
      </div>
      {/* Trailer */}
      {trailer && (
        <div className="w-full flex flex-col items-center mt-3 mb-3">
          <m.h2
            variants={fadeDown}
            className={cn(
              mainHeading,
              `${
                isDark ? "text-gray-100" : "text-gray-900"
              } mb-3 md:max-w-[420px] will-change-transform motion-reduce:transform-none`
            )}
          >
            Official Trailer
          </m.h2>
          <div className="aspect-video w-full max-w-[90vw] lg:max-w-[1150px] px-2">
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default Detail;