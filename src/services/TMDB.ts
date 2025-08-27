import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_KEY, API_BEARER } from "@/utils/config";

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

    getShow: builder.query({
      query: ({ category, id }: { category: string; id: number }) =>
        `${category}/${id}?append_to_response=videos,credits&api_key=${API_KEY}`,
    }),
  }),
});

export const { useGetTrendingMoviesQuery, useGetTrendingTvSeriesQuery, useGetShowQuery } = tmdbApi;