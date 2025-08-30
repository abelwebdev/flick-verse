import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { MovieCard, SkelatonLoader } from "@/common";
import { CatalogHeader, Search } from "./components";
import { useGetContentQuery } from "@/services/TMDB";
import { smallMaxWidth } from "@/styles";
import { IMovie } from "@/types";
import { cn } from "@/utils/helper";

const Catalog = () => {
  const [page, setPage] = useState(1);
  const [shows, setShows] = useState<IMovie[]>([]);
  const [isCategoryChanged, setIsCategoryChanged] = useState<boolean>(false);
  const [query, setQuery] = useSearchParams();
  const { category } = useParams();

  const type = query.get("type") || "popular";
  const searchQuery = query.get("search") || "";


  const { data, isLoading, isFetching } = useGetContentQuery({
    category: category === "tv" ? "tv" : "movie",
    page,
  });

  useEffect(() => {
    setPage(page);
    setIsCategoryChanged(true);
  }, [category, searchQuery]);

  useEffect(() => {
    if (isLoading || isFetching) return;
    if (data?.results) {
      if (page > 1) {
        setShows((prev) => [...prev, ...data.results]);
      } else {
        setShows([...data.results]);
        setIsCategoryChanged(false);
      }
    }
  }, [data, isFetching, isLoading, page]);

  return (
    <>
      <CatalogHeader category={String(category)} />
      <section className={cn(smallMaxWidth, "lg:mt-12 md:mt-8 sm:mt-6 xs:mt-4 mt-2")}>
        <Search setQuery={setQuery}/>
        {isLoading || isCategoryChanged ? (
          <SkelatonLoader isMoviesSliderLoader={false} />
        ) : (
          <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-center">
            {shows?.map((movie, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 md:mr-5 xs:max-w-[170px] max-w-[250px] rounded-lg"
              >
                <MovieCard movie={movie} category={String(category)} />
              </div>
            ))}
          </div>
        )}
        {isFetching && !isCategoryChanged ? (
          <div className="my-4">
            <FiLoader className="mx-auto dark:text-gray-300 w-5 h-5 animate-spin"/>
          </div>
        ) : (
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
        )}
      </section>
    </>
  );
};

export default Catalog;
