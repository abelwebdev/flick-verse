  export interface MovieServerUrlItem {
    key: string;
    name: string;
    url: string;
  }
  export interface TvServerUrlItem {
    key: string;
    name: string;
    url: string;
  }

  export const getMovieServerUrls = (id: number | string): MovieServerUrlItem[] => [
    { key: "vidsrc", name: "Server 1", url: `https://vidsrc.icu/embed/movie/${id}?autoplay=1&muted=1` },
    { key: "2embed", name: "Server 2", url: `https://2embed.cc/embed/${id}` },
    { key: "multiembed", name: "Server 3", url: `https://multiembed.mov/?video_id=${id}&tmdb=1` },
    { key: "moviesapi", name: "Server 4", url: `https://moviesapi.club/movie/${id}` },
    { key: "autoembed", name: "Server 5", url: `https://autoembed.co/movie/tmdb/${id}` },
  ];

  export const getTvServerUrls = (
    id: number | string,
    season: number | string,
    episode: number | string
  ): TvServerUrlItem[] => [
    {
      key: "vidsrc",
      name: "Server 1",
      url: `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}?autoplay=1&muted=1`,
    },
    {
      key: "2embed",
      name: "Server 2",
      url: `https://2embed.cc/embedtv/${id}?s=${season}&e=${episode}`,
    },
    {
      key: "multiembed",
      name: "Server 3",
      url: `https://multiembed.mov/?tmdb=1&video_id=${id}&s=${season}&e=${episode}`,
    },
    {
      key: "moviesapi",
      name: "Server 4",
      url: `https://moviesapi.club/tv/${id}-${season}-${episode}`,
    },
    {
      key: "autoembed",
      name: "Server 5",
      url: `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`,
    },
  ];
