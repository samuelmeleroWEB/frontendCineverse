
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Rooms.module.css";
import { getRooms } from "../../../services/rooms.services";


interface Room {
  _id: string;
  name: string;
  capacity: number;
  rows: number;
  cols: number;
}

export default function  Rooms () {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loadRooms() {
    try {
      setLoading(true);
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error("Error cargando salas:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  // Añadir
  function handleAdd() {
    // formulario vacío (crear)
    navigate("/admin/rooms/new");
  }


 

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Salas</h2>
        <button className={styles.addButton} onClick={handleAdd}>
          + Añadir sala
        </button>
      </div>

      {loading && <p>Cargando salas...</p>}

      {!loading && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Capacidad</th>
                <th>Filas</th>
                <th>Columnas</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.name}</td>
                  <td>{room.capacity} personas</td>
                  <td>{room.rows}</td>
                  <td>{room.cols}</td>
              
                </tr>
              ))}

              {rooms.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    No hay salas todavía.
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
