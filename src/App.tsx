import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import {
  Header,
  SideBar,
  ScrollToTop,
  Loader,
} from "@/common";

import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css";

const Catalog = lazy(() => import("./pages/Catalog"));
const Home = lazy(() => import("./pages/Home"));
const Detail = lazy(() => import("./pages/Detail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Search = lazy(() => import("./pages/Search"));

const App = () => {

  return (
    <>
      <SideBar />
      <Header />
      <main>
        <ScrollToTop>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:category/:id" element={<Detail />} />
              <Route path="/:category" element={<Catalog />} />
              <Route path="/search/:id" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ScrollToTop>
      </main>
    </>
  );
};

export default App;
