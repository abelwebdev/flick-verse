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
      query: () => `/movie/popular?language=en-US&page=1`,
    }),
    getTrendingTvSeries: builder.query({
      query: () => `/tv/popular?language=en-US&page=1`,
    }),
    getMovie: builder.query({
      query: ({ category, id }: { category: string; id: number }) => `/movie/${id}?language=en-US&append_to_response=credits`,
    }),
    getTv: builder.query({
      query: ({ category, id }: {category: string; id: number }) => `/tv/${id}?language=en-US&append_to_response=credits`,
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