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
