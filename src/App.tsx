import { useLocation } from "react-router-dom";
import Footer from "./components/Footer/Footer.component";
import Navbar from "./components/Navbar/Navbar.component";
import AppRoutes from "./router/routes";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      {
        // usamos el operador ternario para mostrar un contenido u otro, dependiendo de si el usuario está en una ruta de administración o no
      }
      {!isAdminRoute ? (
        <main className="app-content">
          <AppRoutes />{" "}
        </main>
      ) : (
        <AppRoutes />
      )}

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
