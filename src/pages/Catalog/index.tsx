import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

import { MovieCard, SkelatonLoader } from "@/common";
import { CatalogHeader, Search } from "./components";
import {
  useGetContentQuery,
  useGetMovieDiscoverQuery,
  useGetMovieSearchQuery,
  useGetTvDiscoverQuery,
  useGetTvSearchQuery,
} from "@/services/TMDB";
import { smallMaxWidth } from "@/styles";
import { IMovie } from "@/types";
import { cn } from "@/utils/helper";

const DEFAULT_SORT = "popularity.desc";

const Catalog = () => {
  const [page, setPage] = useState(1);
  const [shows, setShows] = useState<IMovie[]>([]);
  const [isCategoryChanged, setIsCategoryChanged] = useState<boolean>(false);
  const [query, setQuery] = useSearchParams();
  const { category } = useParams();

  const mediaCategory = category === "tv" ? "tv" : "movie";
  const isMovieCategory = mediaCategory === "movie";

  const searchQuery = query.get("search") || "";
  const genreFilter = query.get("genre") || "";
  const yearFilter = query.get("year") || "";
  const sortParam = query.get("sort") || "";
  const sortFilter = sortParam || DEFAULT_SORT;

  const shouldUseSearch = Boolean(searchQuery);
  const shouldUseDiscover =
    !shouldUseSearch &&
    Boolean(genreFilter || yearFilter || sortParam);

  const discoverFilters = useMemo(
    () => ({
      genre: genreFilter,
      year: yearFilter,
      sortBy: sortFilter,
    }),
    [genreFilter, yearFilter, sortFilter]
  );

  const { data: contentData, isLoading: isContentLoading, isFetching: isContentFetching } = useGetContentQuery(
    {
      category: mediaCategory,
      page,
    },
    {
      skip: shouldUseSearch || shouldUseDiscover,
    }
  );

  const { data: movieSearchData, isLoading: isMovieSearchLoading, isFetching: isMovieSearchFetching } =
    useGetMovieSearchQuery(
      {
        query: searchQuery,
        page,
      },
      {
        skip: !shouldUseSearch || !isMovieCategory,
      }
    );

  const { data: tvSearchData, isLoading: isTvSearchLoading, isFetching: isTvSearchFetching } =
    useGetTvSearchQuery(
      {
        query: searchQuery,
        page,
      },
      {
        skip: !shouldUseSearch || isMovieCategory,
      }
    );

  const { data: movieDiscoverData, isLoading: isMovieDiscoverLoading, isFetching: isMovieDiscoverFetching } =
    useGetMovieDiscoverQuery(
      {
        page,
        filters: discoverFilters,
      },
      {
        skip: !shouldUseDiscover || !isMovieCategory,
      }
    );

  const { data: tvDiscoverData, isLoading: isTvDiscoverLoading, isFetching: isTvDiscoverFetching } =
    useGetTvDiscoverQuery(
      {
        page,
        filters: discoverFilters,
      },
      {
        skip: !shouldUseDiscover || isMovieCategory,
      }
    );

  const data = shouldUseSearch
    ? isMovieCategory
      ? movieSearchData
      : tvSearchData
    : shouldUseDiscover
      ? isMovieCategory
        ? movieDiscoverData
        : tvDiscoverData
      : contentData;

  const isLoading = shouldUseSearch
    ? isMovieCategory
      ? isMovieSearchLoading
      : isTvSearchLoading
    : shouldUseDiscover
      ? isMovieCategory
        ? isMovieDiscoverLoading
        : isTvDiscoverLoading
      : isContentLoading;

  const isFetching = shouldUseSearch
    ? isMovieCategory
      ? isMovieSearchFetching
      : isTvSearchFetching
    : shouldUseDiscover
      ? isMovieCategory
        ? isMovieDiscoverFetching
        : isTvDiscoverFetching
      : isContentFetching;

  const visibleResults = useMemo(() => {
    const results = ([...(data?.results || [])] as IMovie[]).filter((item) => {
      const matchesGenre = !genreFilter || item.genre_ids?.includes(Number(genreFilter));
      const releaseDate = item.release_date || item.first_air_date || "";
      const matchesYear = !yearFilter || releaseDate.startsWith(yearFilter);

      return matchesGenre && matchesYear;
    });

    const dateField = isMovieCategory ? "release_date" : "first_air_date";

    const sortedResults = [...results].sort((a, b) => {
      switch (sortParam) {
        case "vote_average.desc":
          return (b.vote_average ?? 0) - (a.vote_average ?? 0);
        case "vote_count.desc":
          return (b.vote_count ?? 0) - (a.vote_count ?? 0);
        case "primary_release_date.desc":
        case "first_air_date.desc":
          return String(b[dateField as keyof IMovie] || "").localeCompare(String(a[dateField as keyof IMovie] || ""));
        case DEFAULT_SORT:
        case "":
        default:
          return (b.popularity ?? 0) - (a.popularity ?? 0);
      }
    });

    return sortedResults;
  }, [data?.results, genreFilter, isMovieCategory, sortParam, yearFilter]);

  useEffect(() => {
    setPage(1);
    setIsCategoryChanged(true);
    setShows([]);
  }, [category, searchQuery, genreFilter, yearFilter, sortParam]);

  useEffect(() => {
    if (isLoading || isFetching) return;
    if (visibleResults?.length) {
      if (page > 1) {
        setShows((prev) => [...prev, ...visibleResults]);
      } else {
        setShows([...visibleResults]);
        setIsCategoryChanged(false);
      }
      return;
    }

    if (page === 1) {
      setShows([]);
      setIsCategoryChanged(false);
    }
  }, [isFetching, isLoading, page, visibleResults]);

  const hasActiveFilters = Boolean(searchQuery || genreFilter || yearFilter || sortParam);

  return (
    <>
      <CatalogHeader category={String(category)} />
      <section className={cn(smallMaxWidth, "lg:mt-12 md:mt-8 sm:mt-6 xs:mt-4 mt-2")}>
        <Search setQuery={setQuery} />
        {isLoading || isCategoryChanged ? (
          <SkelatonLoader isMoviesSliderLoader={false} />
        ) : shows?.length > 0 ? (
          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-center">
            {shows?.map((movie, index) => (
              <div
                key={index}
                className="flex flex-col shrink-0 gap-4 xs:gap-2 md:gap-2 w-[200px] rounded-lg"
              >
                <MovieCard movie={movie} category={String(category)} />
              </div>
            ))}
          </div>
        ) : hasActiveFilters ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No results found for the current search and filters.
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              Try loosening the genre, rating, or year filters and search again.
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              No {category === "tv" ? "TV series" : "movies"} available at the moment.
            </div>
          </div>
        )}
        {isFetching && !isCategoryChanged ? (
          <div className="my-4">
            <FaSpinner
              className="mx-auto dark:text-gray-300 w-5 h-5 animate-spin"
              style={{ color: "#73f340" }}
            />
          </div>
        ) : shows?.length > 0 ? (
          <div className="w-full flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setPage(page + 1);
              }}
              disabled={isFetching}
              className="sm:py-2 xs:py-[6px] py-1 sm:px-4 xs:px-3 px-[10.75px] bg-[#73f340] text-gray-50 rounded-full md:text-[15.25px] sm:text-[14.75px] xs:text-[14px] text-[12.75px] shadow-md hover:-translate-y-1 transition-all duration-300 font-medium font-nunito my-4"
            >
              Load more
            </button>
          </div>
        ) : null}
      </section>
    </>
  );
};

export default Catalog;
