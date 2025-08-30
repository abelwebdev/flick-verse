import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_BEARER } from "@/utils/config";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.themoviedb.org",
    prepareHeaders: (headers) => {
      if (API_BEARER) {
        headers.set("Authorization", `Bearer ${API_BEARER}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query({
      query: () => `/3/movie/popular?language=en-US&page=1`,
    }),
    getTrendingTvSeries: builder.query({
      query: () => `/3/tv/popular?language=en-US&page=1`,
    }),
    // getShows: builder.query({
    //   query: ({
    //     category,
    //     type,
    //     searchQuery,
    //     page,
    //     showSimilarShows,
    //     id,
    //   }: {
    //     category: string | undefined;
    //     type?: string;
    //     page?: number;
    //     searchQuery?: string;
    //     showSimilarShows?: boolean;
    //     id?: number;
    //   }) => {
    //     if (searchQuery) {
    //       return `search/${category}?api_key=${API_KEY}&query=${searchQuery}&page=${page}`;
    //     }

    //     if (showSimilarShows) {
    //       return `${category}/${id}/similar?api_key=${API_KEY}`;
    //     }

    //     return `${category}/${type}?api_key=${API_KEY}&page=${page}`;
    //   },
    // }),
    getMovie: builder.query({
      query: ({ category, id }: { category: string; id: number }) => `/3/movie/${id}?language=en-US`,
    }),
    getTv: builder.query({
      query: ({ category, id }: {category: string; id: number }) => `/3/tv/${id}?language=en-US`,
    }),
    getSeasonEpisodes: builder.query({
      query: ({ id, season_number }: { id: string; season_number: number }) =>
        `/3/tv/${id}/season/${season_number}?language=en-US`,
    }),
    // getMovies: builder.query({
    //   query: (page: number = 1) => `/3/movie/popular?language=en-US&page=${page}`,
    // }),
    // getTvs: builder.query({
    //   query: (page: number = 1) => `/3/tv/popular?language=en-US&page=${page}`,
    // }),
    // services/TMDB.ts
    getContent: builder.query({
      query: ({ category, page }: { category: string; page: number }) =>
        `/3/${category}/popular?language=en-US&page=${page}`,
    }),
  }),
});

export const { useGetTrendingMoviesQuery, useGetTrendingTvSeriesQuery, useGetMovieQuery, useGetTvQuery, useGetSeasonEpisodesQuery, useGetContentQuery } = tmdbApi;