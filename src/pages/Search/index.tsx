import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { MovieCard, SkelatonLoader } from "@/common";
import CatalogHeader from "@/pages/Catalog/components/CatalogHeader";
import { useGetMovieSearchQuery, useGetTvSearchQuery } from "@/services/TMDB";
import { smallMaxWidth } from "@/styles";
import { cn } from "@/utils/helper";

const Search = () => {
  const { id = "" } = useParams();
  const query = decodeURIComponent(id);
  const [page, setPage] = useState(1);
  const [shows, setShows] = useState<any[]>([]);

  const { data: movieSearchData, isLoading: isMovieLoading, isFetching: isMovieFetching } = useGetMovieSearchQuery({
    query,
    page,
  }, { skip: !query });

  const { data: tvSearchData, isLoading: isTvLoading, isFetching: isTvFetching } = useGetTvSearchQuery({
    query,
    page,
  }, { skip: !query });

  const merged = useMemo(() => {
    const items = [
      ...(movieSearchData?.results || []).map((r: any) => ({ ...r, _type: 'movie', _name: r.title || r.name })),
      ...(tvSearchData?.results || []).map((r: any) => ({ ...r, _type: 'tv', _name: r.title || r.name })),
    ];

    const q = (query || "").toLowerCase().trim();
    const qWords = q.split(/\s+/).filter(Boolean);

    const scoreName = (name: string): number => {
      if (!name) return -1e9;
      const n = name.toLowerCase();
      if (n === q && q.length > 0) return 1e9; // exact match first
      let score = 0;
      if (q.length > 0) {
        if (n.startsWith(q)) score += 1200;
        const idx = n.indexOf(q);
        if (idx !== -1) score += Math.max(0, 800 - idx * 10);
        for (const w of qWords) {
          const wi = n.indexOf(w);
          if (wi !== -1) score += Math.max(0, 200 - wi * 5);
        }
        score -= Math.abs(n.length - q.length) * 2; // mild length penalty
      }
      return score;
    };

    return items
      .map((it) => ({ ...it, _score: scoreName(it._name || ""), _pop: it.popularity || 0 }))
      .sort((a, b) => {
        if (b._score !== a._score) return b._score - a._score;
        return (b._pop as number) - (a._pop as number);
      });
  }, [movieSearchData, tvSearchData, query]);

  const isLoading = isMovieLoading && isTvLoading;
  const isFetching = isMovieFetching || isTvFetching;

  useEffect(() => {
    setPage(1);
    setShows([]);
  }, [id]);

  useEffect(() => {
    if (isLoading || isFetching) return;
    if (merged?.length) {
      if (page > 1) {
        setShows((prev) => [...prev, ...merged]);
      } else {
        setShows([...merged]);
      }
    }
  }, [merged, isLoading, isFetching, page]);

  return (
    <>
    <CatalogHeader category={"movies"} title="search" />
    <section className={cn(smallMaxWidth, "lg:mt-12 md:mt-8 sm:mt-6 xs:mt-4 mt-5")}> 
      <h1 className="text-xl dark:text-gray-400 font-semibold mb-4">Search results for "{query}"</h1>
      {isLoading ? (
        <SkelatonLoader isMoviesSliderLoader={false} />
      ) : shows?.length > 0 ? (
        <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-center">
          {shows.map((item, index) => (
            <div key={index} className="flex flex-col shrink-0 gap-4 xs:gap-2 md:gap-2 w-[200px] rounded-lg">
              <MovieCard movie={item} category={(item as any)._type} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No results found</div>
        </div>
      )}
      {isFetching ? (
        <div className="my-4">
          <FaSpinner className="mx-auto dark:text-gray-300 w-5 h-5 animate-spin" style={{color: "#73f340"}} />
        </div>
      ) : shows?.length > 0 ? (
        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            onClick={() => setPage(page + 1)}
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

export default Search;


