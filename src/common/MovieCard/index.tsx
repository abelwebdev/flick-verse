import { Link } from "react-router-dom";
import favicon from "../../assets/svg/favicon.svg"

import Image from "../Image";
import { IMovie } from "@/types";
import { useMediaQuery } from "usehooks-ts";

const MovieCard = ({
  movie,
  category,
}: {
  movie: IMovie;
  category: string;
}) => {
  const { poster_path, original_title: title, name, id, vote_average, release_date, first_air_date, genre_ids } = movie;
  const primaryTitle = (title?.length ? title : movie.title) || name;
  const year = (release_date || first_air_date || "").slice(0, 4);
  const genreMap: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
    10759: "Action & Adventure",
    10762: "Kids",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
  };
  const primaryGenre = genre_ids && genre_ids.length > 0 ? genreMap[genre_ids[0]] : undefined;
  const isMobile = useMediaQuery("(max-width: 380px)");
  return (
    <>
      <Link
        to={`/${category}/${id}`}
        className="dark:bg-[#1f1f1f] bg-[#f5f5f5] rounded-lg relative group w-[200px] select-none xs:h-[300px] h-[260px] overflow-hidden z-0"
      >
        {typeof vote_average === "number" && (
          <div className="absolute top-2 left-2 z-[1] px-2 py-[2px] rounded-md text-[12px] font-semibold bg-black/70 text-white">
            ⭐ {vote_average.toFixed(1)}
          </div>
        )}
        <Image
          height={!isMobile ? 300 : 260}
          width={200}
          src={`https://image.tmdb.org/t/p/original/${poster_path}`}
          alt={movie.original_title}
          className="object-cover rounded-lg drop-shadow-md shadow-md group-hover:shadow-none group-hover:drop-shadow-none transition-all duration-300 ease-in-out"
          effect="zoomIn"
        />
        {/* subtle dark overlay for better text contrast */}
        <div className="absolute inset-0 rounded-lg bg-black/15" />
        {/* hover icon */}
        <div className="absolute top-0 left-0 w-[200px]  h-full group-hover:opacity-100 opacity-0 bg-[rgba(0,0,0,0.6)] transition-all duration-300 rounded-lg flex items-center justify-center">
          <div className="xs:text-[48px] text-[42px] text-[#ff0000] scale-[0.4] group-hover:scale-100 transition-all duration-300 ">
            <img src={favicon} alt="play icon" height="50" width="50" />
          </div>
        </div>
      </Link>

      {(primaryTitle || primaryGenre || year) && (
        <div className="mt-2 w-[200px]">
          <h4 className="dark:text-gray-100 text-gray-900 cursor-default text-[16px] font-semibold whitespace-normal break-words line-clamp-2">
            {primaryTitle}
          </h4>
          <p className="dark:text-gray-300 text-gray-600 text-[13px] line-clamp-1">
            {primaryGenre ? `${primaryGenre}` : ""}{primaryGenre && year ? " • " : ""}{year}
          </p>
        </div>
      )}
    </>
  );
};

export default MovieCard
