
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Movies.module.css";
import { getMovies, deleteMovie } from "../../../services/movies.services";

interface Movie {
  _id: string;
  title: string;
  description: string;
  duration: number;
  genre: string;
  ageRating: string;
  posterUrl: string;
  releaseDate: string;
}

export const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loadMovies() {
    try {
      setLoading(true);
      const data = await getMovies();
      setMovies(data);
    } catch (err) {
      console.error("Error cargando películas:", err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadMovies();
  }, []);


  
  function handleAdd() {
    // formulario vacío
    navigate("/admin/movies/new");
  }

  function handleEdit(movie: Movie) {
    //  le pasamos la peli en el state
    navigate("/admin/movies/edit", { state: { movie } });
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("¿Seguro que quieres eliminar esta película?");
    if (!ok) return;

    try {
      await deleteMovie(id);
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error eliminando película:", err);
      alert("Error al eliminar la película");
    }
  }
function handleSessions(movie: Movie) {
    navigate(`/admin/movies/${movie._id}/sessions`);
  }
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Películas</h2>
        <button className={styles.addButton} onClick={handleAdd}>
          + Añadir película
        </button>
      </div>

      {loading && <p>Cargando películas...</p>}

      {!loading && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Duración</th>
                <th>Género</th>
                <th>Edad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.duration} min</td>
                  <td>{movie.genre}</td>
                  <td>{movie.ageRating}</td>
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleEdit(movie)}
                    >
                      Editar
                    </button>
                     <button
      className={styles.actionBtn}
      onClick={() => handleSessions(movie)}
    >
      Sesiones
    </button>
                    <button
                      className={styles.actionBtnDanger}
                      onClick={() => handleDelete(movie._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {movies.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    No hay películas todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
