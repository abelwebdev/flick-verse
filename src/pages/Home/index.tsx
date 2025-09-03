import { Loader, Error, Section } from "@/common";
import { Hero } from "./components";

import { useGetTrendingMoviesQuery, useGetTrendingTvSeriesQuery } from "@/services/TMDB";
import { maxWidth } from "@/styles";
import { sections } from "@/constants";
import { cn } from "@/utils/helper";

const Home = () => {
  const { data: movie, isLoading: isMovieLoading, isError: isMovieError } = useGetTrendingMoviesQuery({
    category: "movie",
    type: "popular",
    page: 1,
  });
  const { data: tv, isLoading: isTvLoading, isError: isTvError } = useGetTrendingTvSeriesQuery({
    category: "tv",
    type: "popular",
    page: 1,
  });

  if (isMovieLoading) {
    return <Loader />;
  }
  if (isTvLoading) {
    return <Loader />
  }
  if (isMovieError) {
    return <Error error="Unable to fetch the movies! " />;
  }
  if (isTvError) {
    return <Error error="Unable to fetch the series! " />;
  }

  const popularMovies = movie?.results.slice(0, 5);

  return (
    <>
      <Hero movies={popularMovies} />
      <div className={cn(maxWidth, "lg:mt-12 md:mt-8 sm:mt-6 xs:mt-4 mt-2")}>
        {sections.map(({ title, category, type }) => (
          title === "Movies" ? (
            <Section title={title} category={category} type={"movie"} data={movie} key={title} />
          ) : (
            <Section title={title} category={category} type={"tv"} data={tv} key={title} />
          )
        ))}
      </div>
    </>
  );
};

export default Home;
