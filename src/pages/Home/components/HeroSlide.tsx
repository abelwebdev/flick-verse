import { memo } from 'react';
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { mainHeading, maxWidth, paragraph, watchBtn } from "@/styles";
import { IMovie } from "@/types";
import { cn } from "@/utils/helper";
import { useMotion } from "@/hooks/useMotion";

const HeroSlide = ({ movie, logoPath }: { movie: IMovie, logoPath: string | null | undefined }) => {
  const navigate = useNavigate();
  const { fadeDown, staggerContainer } = useMotion();

  const {
    overview,
    original_title: title,
    id,
    vote_average,
    genre_ids,
  } = movie;

  const handleWatchNow = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <div
      className={cn(
        maxWidth,
        ` mx-auto flex items-center h-full  flex-row lg:gap-32 sm:gap-20`
      )}
    >
      <m.div
        variants={staggerContainer(0.2, 0.3)}
        initial=""
        animate="show"
        className="text-gray-300 sm:max-w-[80vw] max-w-[90vw]  md:max-w-[420px] font-nunito flex flex-col sm:gap-5 xs:gap-3 gap-[10px] sm:mb-8"
      >
        {logoPath ? (
          <m.div variants={fadeDown} className="mb-2 mt-5">
            <img
              src={`https://image.tmdb.org/t/p/original${logoPath}`}
              alt={title}
              className="max-w-full h-auto max-h-16 object-contain"
            />
          </m.div>
        ) : logoPath === null ? (
          <m.h2 variants={fadeDown} className={cn(mainHeading)}>
            {title}
          </m.h2>
        ) : null}
        <m.div variants={fadeDown} className="flex items-center gap-3">
          {vote_average && (
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-800/50 border border-gray-600/50 rounded-full">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-gray-300 text-sm font-medium">
                {vote_average.toFixed(1)}
              </span>
            </div>
          )}
          {genre_ids && genre_ids.length > 0 && (
            <>
              {(() => {
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
                return genre_ids.slice(0, 2).map((genreId, index) => {
                  const genreName = genreMap[genreId] || `Genre ${genreId}`;
                  return (
                    <div key={genreId} className="flex items-center gap-1 px-3 py-1 bg-gray-800/50 border border-gray-600/50 rounded-full">
                      <span className="text-gray-300 text-sm font-medium">
                        {genreName}
                      </span>
                    </div>
                  );
                });
              })()}
            </>
          )}
        </m.div>
        <m.p variants={fadeDown} className={paragraph}>
          {overview.length > 300 ? `${overview.substring(0, 300)}...` : overview}
        </m.p>
        <m.div
          variants={fadeDown}
          className="flex flex-row items-center  gap-4 sm:mt-6 xs:mt-5 mt-[18px] "
        >
          <button
            type="button"
            name="watch-now"
            className={cn(
              watchBtn,
              ` bg-[#6ae038] shadow-glow
             text-shadow text-secColor `
            )}
            onClick={handleWatchNow}
          >
            Watch now
          </button>
        </m.div>
      </m.div>
    </div>
  );
};

export default memo(HeroSlide);
