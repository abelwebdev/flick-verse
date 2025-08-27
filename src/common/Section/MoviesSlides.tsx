import { FC } from "react";

import MovieCard from "../MovieCard";
import { IMovie } from "@/types";

interface MoviesSlidesProps {
  movies: IMovie[];
  category: string;
}

const MoviesSlides: FC<MoviesSlidesProps> = ({ movies, category }) => (
  <div className="flex flex-wrap justify-center sm:justify-between gap-x-5 gap-y-5 mt-1">
    {movies.map((movie) => (
      <div
        key={movie.id}
        className="flex flex-col xs:gap-[14px] gap-2 rounded-lg"
      >
        <MovieCard movie={movie} category={category} />
      </div>
    ))}
  </div>
);

export default MoviesSlides;
