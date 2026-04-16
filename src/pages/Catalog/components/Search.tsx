import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { GoSearch } from "react-icons/go";
import { FiChevronDown, FiFilter } from "react-icons/fi";
import { useParams, useSearchParams } from "react-router-dom";
import type { SetURLSearchParams } from "react-router-dom";

import {
  useGetMovieGenresQuery,
  useGetTvGenresQuery,
} from "@/services/TMDB";

interface SearchProps {
  setQuery: SetURLSearchParams;
}

const DEFAULT_SORT = "popularity.desc";

const Search: React.FC<SearchProps> = ({ setQuery }) => {
  const { category } = useParams();
  const isTvCategory = category === "tv";
  const [searchParams] = useSearchParams();
  const searchParamsString = searchParams.toString();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || DEFAULT_SORT);
  const [isFiltersOpen, setIsFiltersOpen] = useState(Boolean(searchParams.get("genre") || searchParams.get("year") || searchParams.get("sort")));

  const { data: movieGenres } = useGetMovieGenresQuery(undefined, {
    skip: isTvCategory,
  });
  const { data: tvGenres } = useGetTvGenresQuery(undefined, {
    skip: !isTvCategory,
  });

  const genres = useMemo(
    () => (isTvCategory ? tvGenres?.genres : movieGenres?.genres) ?? [],
    [isTvCategory, movieGenres?.genres, tvGenres?.genres]
  );

  useEffect(() => {
    const nextSearch = searchParams.get("search") || "";
    const nextGenre = searchParams.get("genre") || "";
    const nextYear = searchParams.get("year") || "";
    const nextSort = searchParams.get("sort") || DEFAULT_SORT;

    setSearch(nextSearch);
    setGenre(nextGenre);
    setYear(nextYear);
    setSortBy(nextSort);
  }, [searchParams, searchParamsString]);

  const hasActiveFilters =
    Boolean(genre || year) || sortBy !== DEFAULT_SORT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextQuery = new URLSearchParams();
    const trimmedSearch = search.trim();

    if (trimmedSearch) nextQuery.set("search", trimmedSearch);
    if (genre) nextQuery.set("genre", genre);
    if (year) nextQuery.set("year", year);
    if (sortBy && sortBy !== DEFAULT_SORT) nextQuery.set("sort", sortBy);

    setQuery(nextQuery);
  };

  const handleClearSearch = () => {
    setSearch("");
    setGenre("");
    setYear("");
    setSortBy(DEFAULT_SORT);
    setIsFiltersOpen(false);
    setQuery({});
  };

  const newestSortValue = isTvCategory ? "first_air_date.desc" : "primary_release_date.desc";

  return (
    <form
      className="text-[14px] lg:py-10 md:pt-9 md:pb-10 sm:pt-8 sm:pb-10 pt-6 pb-8 flex justify-center"
      onSubmit={handleSubmit}
    >
      <div className="w-full max-w-5xl rounded-[28px] border border-white/30 bg-white/75 p-4 shadow-[0_16px_45px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-gradient-to-b dark:from-[#23212b]/95 dark:to-[#1a1821]/95 sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full rounded-full border border-gray-300 bg-white/85 py-[7px] pl-5 pr-10 font-medium text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#73f340] focus:bg-white dark:border-white/10 dark:bg-[#2f2c39] dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:bg-[#393545]"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder={`Search ${isTvCategory ? "TV series" : "movies"}`}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[18px] transition-transform duration-200 hover:scale-110"
                aria-label="Search catalog"
              >
                <GoSearch style={{ color: "#73f340" }} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFiltersOpen((prev) => !prev)}
                aria-expanded={isFiltersOpen}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/80 px-4 py-[9px] text-[13px] font-semibold text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#73f340] hover:bg-white dark:border-white/10 dark:bg-[#2f2c39] dark:text-gray-100 dark:hover:bg-[#393545]"
              >
                <FiFilter className="text-[15px]" />
                Filters
                <FiChevronDown
                  className={`text-[14px] transition-transform duration-300 ${isFiltersOpen ? "rotate-180" : ""}`}
                />
              </button>

              {hasActiveFilters || search ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white/80 px-4 py-[9px] text-[13px] font-semibold text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#73f340] hover:bg-white hover:text-gray-900 dark:border-white/10 dark:bg-[#2f2c39] dark:text-gray-300 dark:hover:bg-[#393545] dark:hover:text-white"
                >
                  Clear all
                </button>
              ) : null}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isFiltersOpen && (
              <m.div
                initial={{ height: 0, opacity: 0, y: -8 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-1 rounded-[24px] border border-white/25 bg-white/70 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-[#211f29]/95">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="flex flex-col gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-300">
                      Genre
                      <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-white/85 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-all duration-200 focus:border-[#73f340] dark:border-white/10 dark:bg-[#2f2c39] dark:text-gray-100"
                      >
                        <option value="">All genres</option>
                        {genres.map((item: { id: number; name: string }) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-300">
                      Year
                      <input
                        type="number"
                        min="1900"
                        max="2100"
                        step="1"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="2024"
                        className="w-full rounded-2xl border border-gray-300 bg-white/85 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-all duration-200 focus:border-[#73f340] dark:border-white/10 dark:bg-[#2f2c39] dark:text-gray-100"
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-300">
                      Sort by
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-white/85 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-all duration-200 focus:border-[#73f340] dark:border-white/10 dark:bg-[#2f2c39] dark:text-gray-100"
                      >
                        <option value="popularity.desc">Popularity</option>
                        <option value="vote_average.desc">Top rated</option>
                        <option value="vote_count.desc">Most voted</option>
                        <option value={newestSortValue}>Newest first</option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Filter by genre, year, or sorting style.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white/85 px-5 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#73f340] hover:bg-white dark:border-white/10 dark:bg-[#2a2734] dark:text-gray-200 dark:hover:bg-[#363244]"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-full bg-[#73f340] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        Apply filters
                      </button>
                    </div>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {(genre || year || sortBy !== DEFAULT_SORT) && (
            <div className="flex flex-wrap gap-2">
              {genre ? (
                <span className="rounded-full border border-[#73f340]/20 bg-[#f7ffef] px-3 py-1 text-[12px] font-semibold text-[#2f6f1d] dark:border-white/10 dark:bg-[#73f340]/10 dark:text-[#d2ffbe]">
                  Genre: {genres.find((item: { id: number; name: string }) => String(item.id) === genre)?.name || genre}
                </span>
              ) : null}
              {year ? (
                <span className="rounded-full border border-[#73f340]/20 bg-[#f7ffef] px-3 py-1 text-[12px] font-semibold text-[#2f6f1d] dark:border-white/10 dark:bg-[#73f340]/10 dark:text-[#d2ffbe]">
                  Year: {year}
                </span>
              ) : null}
              {sortBy !== DEFAULT_SORT ? (
                <span className="rounded-full border border-[#73f340]/20 bg-[#f7ffef] px-3 py-1 text-[12px] font-semibold text-[#2f6f1d] dark:border-white/10 dark:bg-[#73f340]/10 dark:text-[#d2ffbe]">
                  Sort: {sortBy === "vote_average.desc" ? "Top rated" : sortBy === "vote_count.desc" ? "Most voted" : sortBy === newestSortValue ? "Newest first" : "Popularity"}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default Search;
