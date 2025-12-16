import { useEffect, useState, type FormEvent,  } from "react";
import styles from "./Sessions.module.css";
import { getSessions } from "../../../services/sessions.services";

interface Session {
  _id: string;
  movie: any;       // usas movie.title
  room: any;        // usas room.name
  startTime: string | number;
  basePrice: number;
}

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  //  estados para el buscador
  const [inputTerm, setInputTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  async function loadSessions() {
    try {
      setLoading(true);
      const data: Session[] = await getSessions();

      const now = Date.now();

      //  solo sesiones futuras, ordenadas
      const upcomingSessions = data
        .filter((session) => {
          const start = new Date(session.startTime).getTime();
          if (isNaN(start)) return false;
          return start >= now;
        })
        .sort((a, b) => {
          const aTime = new Date(a.startTime).getTime();
          const bTime = new Date(b.startTime).getTime();
          return aTime - bTime;
        });

      setSessions(upcomingSessions);
    } catch (err) {
      console.error("Error cargando sesiones:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  //  aplicar filtro por texto (como un ctrl+f)
  const filteredSessions = sessions.filter((session) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();

    const movieTitle = session.movie?.title?.toLowerCase?.() ?? "";
    const roomName = session.room?.name?.toLowerCase?.() ?? "";
    const dateString = new Date(session.startTime).toLocaleDateString(
      "es-ES",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );
    const timeString = new Date(session.startTime).toLocaleTimeString(
      "es-ES",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    return (
      movieTitle.includes(term) ||
      roomName.includes(term) ||
      dateString.includes(term) ||
      timeString.includes(term)
    );
  });

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchTerm(inputTerm);
  };

  const handleClearSearch = () => {
    setInputTerm("");
    setSearchTerm("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Sesiones</h2>

        {/*  Buscador simple */}
        <form
          onSubmit={handleSearchSubmit}
          className={styles.searchForm}
        >
          <input
            type="text"
            placeholder="Buscar por película, sala, fecha..."
            value={inputTerm}
            onChange={(e) => setInputTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button
            type="submit"
            className={styles.searchButton}
          >
            Buscar
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className={styles.clearButton}
            >
              X
            </button>
          )}
        </form>
      </div>

      {loading && <p>Cargando sesiones...</p>}

      {!loading && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Película</th>
                <th>Sala</th>
                <th>Fecha y hora</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => (
                <tr key={session._id}>
                  <td>{session.movie.title}</td>
                  <td>{session.room.name}</td>
                  <td>
                    {new Date(session.startTime).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                    {" - "}
                    {new Date(session.startTime).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>{session.basePrice}</td>
                  <td></td>
                </tr>
              ))}

              {filteredSessions.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    {sessions.length === 0
                      ? "No hay sesiones futuras."
                      : "No hay sesiones que coincidan con la búsqueda."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
