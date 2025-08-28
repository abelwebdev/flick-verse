  export interface ServerUrlItem {
    key: string;
    name: string;
    url: string;
  }

  export const getServerUrls = (id: number | string): ServerUrlItem[] => [
    { key: "vidsrc", name: "Server 1", url: `https://vidsrc.icu/embed/movie/${id}?autoplay=1&muted=1` },
    { key: "2embed", name: "Server 2", url: `https://2embed.cc/embed/${id}` },
    { key: "multiembed", name: "Server 3", url: `https://multiembed.mov/?video_id=${id}&tmdb=1` },
    { key: "moviesapi", name: "Server 4", url: `https://moviesapi.club/movie/${id}` },
    { key: "autoembed", name: "Server 5", url: `https://autoembed.co/movie/tmdb/${id}` },
  ];