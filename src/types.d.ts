export interface ITheme {
  title: string;
  icon: IconType;
}

export interface INavLink extends ITheme {
  path: string;
}

export interface IMovie {
  id: string;
  poster_path: string;
  original_title: string;
  original_name?: string;
  title?: string;
  name: string;
  overview: string;
  backdrop_path: string
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

