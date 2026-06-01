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
    { key: "vidlink", name: "Server 1", url: `https://vidlink.pro/movie/${id}?autoplay=false` },
    { key: "vidsrc", name: "Server 2", url: `https://vidsrcme.su/embed/movie/${id}?autoplay=1&muted=1` },
    { key: "2embed", name: "Server 3", url: `https://2embed.cc/embed/${id}` },
    { key: "multiembed", name: "Server 4", url: `https://multiembed.mov/?video_id=${id}&tmdb=1` },
    { key: "moviesapi", name: "Server 5", url: `https://moviesapi.to/movie/${id}` },
    { key: "autoembed", name: "Server 6", url: `https://autoembed.co/movie/tmdb/${id}` },
    { key: "videasy", name: "Server 7", url: `https://player.videasy.net/movie/${id}` }
  ];

  export const getTvServerUrls = (
    id: number | string,
    season: number | string,
    episode: number | string
  ): TvServerUrlItem[] => [
    {
      key: "vidlink",
      name: "Server 1",
      url: `https://vidlink.pro/tv/${id}/${season}/${episode}?autoplay=false`,
    },
    {
      key: "vidsrc",
      name: "Server 2",
      url: `https://vidsrcme.su/embed/tv/${id}/${season}/${episode}?autoplay=1&muted=1`,
    },
    {
      key: "2embed",
      name: "Server 3",
      url: `https://2embed.cc/embedtv/${id}?s=${season}&e=${episode}`,
    },
    {
      key: "multiembed",
      name: "Server 4",
      url: `https://multiembed.mov/?tmdb=1&video_id=${id}&s=${season}&e=${episode}`,
    },
    {
      key: "moviesapi",
      name: "Server 5",
      url: `https://moviesapi.to/tv/${id}-${season}-${episode}`,
    },
    {
      key: "autoembed",
      name: "Server 6",
      url: `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`,
    },
    {
      key: "videasy",
      name: "Server 7",
      url: `https://player.videasy.net/tv/${id}/${season}/${episode}`,
    }
  ];
