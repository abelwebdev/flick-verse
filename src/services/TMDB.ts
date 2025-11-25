import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_BEARER } from "@/utils/config";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.themoviedb.org/3",
    prepareHeaders: (headers) => {
      if (API_BEARER) {
        headers.set("Authorization", `Bearer ${API_BEARER}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const today = new Date();
        let releasedMovies: any[] = [];
        let page = 1;
        let hasMore = true;
        while (releasedMovies.length < 20 && hasMore) {
          // Fetch a page of trending movies
          const res: any = await fetchWithBQ(
            `/trending/movie/week?language=en-US&page=${page}`
          );
          if (res.error) return { error: res.error };
          const movies = res.data.results.filter(
            (movie: any) => movie.release_date && new Date(movie.release_date) <= today
          );
          releasedMovies.push(...movies);
          // If no more movies from API, stop
          hasMore = res.data.page < res.data.total_pages;
          page++;
        }
        // Return 20 movies
        return { data: { results: releasedMovies.slice(0, 20) } };
      },
    }),
    getTrendingTvSeries: builder.query({
      query: () => `/tv/popular?language=en-US&page=1`,
    }),
    getMovie: builder.query({
      query: ({ id }: { id: number }) => `/movie/${id}?language=en-US&append_to_response=credits`,
    }),
    getTv: builder.query({
      query: ({ id }: { id: number }) => `/tv/${id}?language=en-US&append_to_response=credits`,
    }),
    getSeasonEpisodes: builder.query({
      query: ({ id, season_number }: { id: string; season_number: number }) => `/tv/${id}/season/${season_number}?language=en-US`,
    }),
    getContent: builder.query({
      query: ({ category, page }: { category: string; page: number }) => `/${category}/popular?language=en-US&page=${page}`,
    }),
    getMovieSearch: builder.query({
      query: ({ query, page = 1 }: { query: string; page?: number }) =>  `/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`,
    }),
    getTvSearch: builder.query({
      query: ({ query, page = 1 }: { query: string; page?: number }) => `/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=${page}`,
    }),
    getVideos: builder.query<any, { category: string; id: number }>({
      query: ({ category, id }) => `/${category}/${id}/videos`,
    }),
    getMovieImages: builder.query<any, { id: number }>({
      query: ({ id }) => `/movie/${id}/images?include_image_language=en`,
    }),
  }),
});

export const { useGetTrendingMoviesQuery, useGetTrendingTvSeriesQuery, useGetMovieQuery, useGetTvQuery, useGetSeasonEpisodesQuery, useGetContentQuery, useGetMovieSearchQuery, useGetTvSearchQuery, useGetVideosQuery, useGetMovieImagesQuery, useLazyGetMovieImagesQuery } = tmdbApi;