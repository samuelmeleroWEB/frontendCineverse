import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./MovieSessions.module.css";
import { getMovieById } from "../../../services/movies.services";
import { getRooms } from "../../../services/rooms.services";
import { createSession, getSessionsByMovie } from "../../../services/sessions.services";

export function MovieSessions() {
  const { id: movieId } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    roomId: "",
    dateFrom: "",
    repeatDays: 1,
    time: "",
    basePrice: "",
  });

  useEffect(() => {
    async function loadData() {
      if (!movieId) return;
      try {
        setLoading(true);
        const [movieData, roomsData, sessionsData] = await Promise.all([
          getMovieById(movieId),
          getRooms(),
          getSessionsByMovie(movieId),
        ]);
        setMovie(movieData);
        setRooms(roomsData);
        setSessions(sessionsData);
      } catch (err) {
        console.error(err);
        setMessage("Error al cargar datos de la película o sesiones");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [movieId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "repeatDays" ? Number(value) : name === "basePrice" ? value : value,
    }));
  }

  async function handleCreateSessions(e: React.FormEvent) {
    e.preventDefault();
    if (!movieId) return;

    const { roomId, dateFrom, repeatDays, time, basePrice } = form;
    if (!roomId || !dateFrom || !time || !basePrice) {
      setMessage("Rellena todos los campos del formulario");
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const [hour, minute] = time.split(":");

      const baseDate = new Date(dateFrom);

      const created: any[] = [];

      for (let i = 0; i < repeatDays; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);
        date.setHours(Number(hour), Number(minute), 0, 0);

        const startTime = date.toISOString();

        const session = await createSession({
          movieId,
          roomId,
          startTime,
          basePrice: Number(basePrice),
        });

        created.push(session);
      }

      setMessage(`✅ Se han creado ${created.length} sesiones`);
      setSessions((prev) => [...prev, ...created]);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "❌ Error al crear sesiones");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p style={{ padding: "1rem" }}>Cargando...</p>;
  }

  if (!movie) {
    return <p style={{ padding: "1rem" }}>Película no encontrada</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Sesiones para: {movie.title}</h1>
      <p>
        {movie.genre} · {movie.duration} min · {movie.ageRating}
      </p>

      <section className={styles.formSection}>
        <h2>Crear sesiones</h2>
        <form className={styles.form} onSubmit={handleCreateSessions}>
          <label>
            Sala
            <select
              name="roomId"
              value={form.roomId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una sala</option>
              {rooms.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha inicial
            <input
              type="date"
              name="dateFrom"
              value={form.dateFrom}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Repetir durante (días)
            <input
              type="number"
              name="repeatDays"
              min={1}
              value={form.repeatDays}
              onChange={handleChange}
            />
          </label>

          <label>
            Hora (HH:MM)
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Precio base (€)
            <input
              type="number"
              name="basePrice"
              min={0}
              step="0.1"
              value={form.basePrice}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "Creando..." : "Crear sesiones"}
          </button>
        </form>

        {message && <p className={styles.message}>{message}</p>}
      </section>

      <section className={styles.sessionsSection}>
        <h2>Sesiones existentes</h2>
        {sessions.length === 0 ? (
          <p>No hay sesiones para esta película todavía.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Sala</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s._id}>
                  <td>
                    {new Date(s.startTime).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td>
                    {new Date(s.startTime).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>{s.room?.name}</td>
                  <td>{s.basePrice} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
