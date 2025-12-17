import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AdminRoute } from "./AdminRoute";
import { Layout } from "../pages/admin/Layout/Layout";
import { useAuthStore } from "../store/auth.store";
import { Home } from "../pages/public/Home/Home";
import { Dashboard } from "../pages/admin/Dashboard/Dashboard";
import { Movies } from "../pages/admin/Movies/Movies";
import { Users } from "../pages/admin/Users/Users";
import { FormMovies } from "../pages/admin/FormMovies/FormMovies";
import Rooms from "../pages/admin/Rooms/Rooms";
import { FormRooms } from "../pages/admin/FormRooms/FormRooms";
import { MovieSessions } from "../pages/admin/MovieSessions/MoviseSessions";
import Sessions from "../pages/admin/Sessions/Sessions";
import { MvpMovies } from "../pages/admin/MvpMovies/MvpMovies";
import Menus from "../pages/public/Menus/Menus";
import Billboard from "../pages/public/Billboard/Billboard";
import CartPage from "../pages/public/CartPage/CartPage";
import MovieDetail from "../pages/public/MovieDetail/MovieDetail";
import MyBookings from "../pages/public/MyBookings/MyBookings";
import MyData from "../pages/public/MyData/MyData";
import { Promotion } from "../pages/public/Promotions/Promotion";
import SessionDetail from "../pages/public/SessionDetails/SessionDetails";

//  subir el scroll al cambiar de ruta
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

// Lo llamamos AppRoutes para no confundirlo con Routes de react-router-dom
export default function AppRoutes() {
  const location = useLocation();
  const checkTokenExpiration = useAuthStore(
    (state) => state.checkTokenExpiration
  );

  //  Cada vez que cambie la ruta, comprobamos si el token ha caducado
  useEffect(() => {
    checkTokenExpiration();
  }, [location.pathname, checkTokenExpiration]);

  return (
    <>
      {/* Siempre que cambie la ruta, se ejecuta ScrollToTop */}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/promotions" element={<Promotion />} />
        <Route path="/menus" element={<Menus />} />
        <Route path="/billboard" element={<Billboard />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/billboard/:id" element={<MovieDetail />} />
        <Route path="/sessions/:id" element={<SessionDetail />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-data" element={<MyData/>} />

        {/* Ruta exclusiva para admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="movies" element={<Movies />} />
          <Route path="movies/new" element={<FormMovies />} />
          <Route path="movies/edit" element={<FormMovies />} />
          <Route path="users" element={<Users />} />
          <Route path="movies/:id/sessions" element={<MovieSessions />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/new" element={<FormRooms />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="mvp-movies" element={<MvpMovies />} />
        </Route>
      </Routes>
    </>
  );
}
