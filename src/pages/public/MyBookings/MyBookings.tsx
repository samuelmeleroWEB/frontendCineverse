import { useEffect, useState } from "react";
import { getMyBookings, type Booking } from "../../../services/booking.services";
import styles from "./MyBookings.module.css";
import loaderStyles from "../../../components/DayCarousel/DayCarousel.module.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyBookings();
        // console.log("BOOKINGS DESDE BACK:", data);

        const now = new Date();

        //   dejamos reservas cuya sesión aún no ha pasado
        // si data existe usa data, si no usa []
        const upcoming = (data ?? [])
          .filter((b) => { // solo reservas futuras
            if (!b.sessionDateTime) return false; // recorremos cada reserva
            const sessionDate = new Date(b.sessionDateTime); // convierte la fecha en un objeto date
            return sessionDate.getTime() >= now.getTime(); // si es mayor que la fecha actual se mantiene, si no se elimina
          })
          .sort( // ordenar
            (a, b) =>
              new Date(a.sessionDateTime ?? 0).getTime() - // si la ficha existe se convierte, sino usa 0 para no romper
              new Date(b.sessionDateTime ?? 0).getTime()
          );

        setBookings(upcoming);
      } catch (err) {
        console.error(err);
        setError("Error al cargar tus reservas.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  //  Mientras carga
  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Mis reservas</h1>

        <div className={loaderStyles.loaderWrapper}>
          <div className={loaderStyles.loader}></div>
          <p className={loaderStyles.loaderText}>
            Cargando tus reservas...
          </p>
        </div>
      </div>
    );
  }

  //  Error
  if (error) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Mis reservas</h1>
        <p>{error}</p>
      </div>
    );
  }

  //  Sin reservas
  if (!bookings || bookings.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Mis reservas</h1>
        <p>Todavía no tienes reservas.</p>
      </div>
    );
  }

  //  Lista de reservas
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mis reservas</h1>

      <div className={styles.list}>
        {bookings.map((booking, index) => (
          <div key={booking.id ?? index} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>Reserva #{index + 1}</span>
              <span className={styles.date}>
                {new Date(booking.createdAt).toLocaleString("es-ES")}
              </span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.row}>
                <span className={styles.label}>Película</span>
                <span className={styles.value}>{booking.movieTitle}</span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Sesión</span>
                <span className={styles.value}>
                  {booking.sessionDateTime &&
                    new Date(booking.sessionDateTime).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                  · {booking.roomName}
                </span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Butacas</span>
                <span className={styles.value}>
                  {booking.seats?.length
                    ? booking.seats.join(", ")
                    : "No especificadas"}
                </span>
              </div>

              {/*  Menús asociados a la reserva */}
              {booking.menus && booking.menus.length > 0 && (
                <div className={styles.row}>
                  <span className={styles.label}>Menús</span>
                  <span className={styles.value}>
                    {booking.menus
                      .map(
                        (m) =>
                          `${m.name} x${m.quantity ?? 1}`
                      )
                      .join(" · ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
