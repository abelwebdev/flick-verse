import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import { useEffect, useRef, useState } from "react";

import HeroSlide from "./HeroSlide";
import { useGlobalContext } from "@/context/globalContext";
import { IMovie } from "@/types";
import { useLazyGetMovieImagesQuery } from "@/services/TMDB";

const Hero = ({ movies }: { movies: IMovie[] }) => {
  const { isModalOpen } = useGlobalContext();

  const swiperRef = useRef<any>(null);
  const [logoPathByMovieId, setLogoPathByMovieId] = useState<Record<string, string | null>>({});
  const [fetchImages] = useLazyGetMovieImagesQuery();

  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    if (isModalOpen) {
      swiper.autoplay?.stop();
    } else {
      swiper.autoplay?.start();
    }
  }, [isModalOpen]);

  useEffect(() => {
    let isCancelled = false;
    const loadLogos = async () => {
      try {
        const entries = await Promise.all(
          movies.map(async (movie) => {
            try {
              const data = await fetchImages({ id: Number(movie.id) }).unwrap();
              const firstLogoPath: string | null = data?.logos?.[0]?.file_path ?? null;
              return [String(movie.id), firstLogoPath] as const;
            } catch {
              return [String(movie.id), null] as const;
            }
          })
        );
        if (isCancelled) return;
        const map: Record<string, string | null> = {};
        for (const [id, path] of entries) map[id] = path;
        setLogoPathByMovieId(map);
      } catch {
        // noop
      }
    };
    if (movies && movies.length > 0) {
      loadLogos();
    }
    return () => {
      isCancelled = true;
    };
  }, [movies, fetchImages]);

  useEffect(() => {
    // Preload all discovered logo images to warm the cache
    const baseUrl = "https://image.tmdb.org/t/p/original";
    Object.values(logoPathByMovieId).forEach((relativePath) => {
      if (!relativePath) return;
      const img = new Image();
      img.decoding = "async";
      img.src = `${baseUrl}${relativePath}`;
    });
  }, [logoPathByMovieId]);

  return (
    <Swiper
      ref={swiperRef}
      className="mySwiper lg:h-screen sm:h-[640px] xs:h-[520px] h-[460px] w-full"
      loop={true}
      slidesPerView={1}
      autoplay={{
        delay: 10000,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
    >
      {movies.map((movie) => {
        return (
          <SwiperSlide
            key={movie.id}
            style={{
              backgroundImage: `
              linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.5)),url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}'`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className=" h-full w-full will-change-transform motion-reduce:transform-none"
          >
            {({ isActive }) => (
              isActive ? (
                <HeroSlide movie={movie} logoPath={logoPathByMovieId[String(movie.id)] ?? null} />
              ) : null
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Hero;
