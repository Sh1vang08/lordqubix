import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import ScrollRail from "./components/ScrollRail";
import MusicBar from "./components/MusicBar";
import Loader from "./components/Loader";

const Products = lazy(() => import("./pages/Products"));
const CategoryAmplifiers = lazy(() => import("./pages/CategoryAmplifiers"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

/** Reset scroll on navigation; honour in-page hash targets. */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Brand splash on first arrival only — see Loader for why it does not
          repeat on every navigation. */}
      <Loader />
      <ScrollManager />
      {/* Keyed on the route so the rail recalculates against each page's
          own height rather than carrying the previous page's measurement. */}
      <ScrollRail key={pathname} />
      <Suspense fallback={<div className="route-fallback" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/products/power-amplifiers"
            element={<CategoryAmplifiers />}
          />
          {/* Every model resolves from the catalogue, so all 169 products
              have a real page rather than sharing one hardcoded example. */}
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* Mounted outside <Routes> and unkeyed, so playback continues
          uninterrupted as the visitor moves between pages. */}
      <MusicBar />
    </>
  );
}
