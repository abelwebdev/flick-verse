import { createRoot } from 'react-dom/client'
import * as React from "react";
import './index.css'
import App from './App.jsx'
import Movie from './Pages/Movie.jsx'
import Tvseries from './Pages/Tvseries.jsx'
import SearchResult from './Pages/SearchResult.jsx'
import Movielist from './Pages/Movielist.jsx'
import Tvserieslist from './Pages/Tvserieslist.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/movies",
    element: <Movielist />
  },
  {
    path: "/tvseries",
    element: <Tvserieslist />
  },
  {
    path: "/movie/:title/:id",
    element: <Movie />
  },
  {
    path: "/tv/:title/:id",
    element: <Tvseries />
  },
  {
    path: "/search/:title",
    element: <SearchResult />
  }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)