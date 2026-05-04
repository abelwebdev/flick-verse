type TmdbImageType = "poster" | "backdrop" | "profile" | "logo" | "still";

const TMDB_BASE_URL = "https://image.tmdb.org/t/p";

const TMDB_IMAGE_SIZES: Record<TmdbImageType, string> = {
  poster: "w500",
  backdrop: "original",
  profile: "w185",
  logo: "w500",
  still: "w300",
};

export const getTmdbImageUrl = (
  path: string | null | undefined,
  type: TmdbImageType
) => {
  if (!path) return "";

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${TMDB_BASE_URL}/${TMDB_IMAGE_SIZES[type]}${cleanPath}`;
};

