import {  useState } from "react";
import styles from "./FormRooms.module.css";
import { addRoom } from "../../../services/rooms.services";

export function FormRooms() {
  const [form, setForm] = useState({
 
    name: "",
    capacity: 100, // por defecto 
  });

  const [loading, setLoading] = useState(false); // desactiva el boton y mostramos loading
  const [message, setMessage] = useState<string | null>(null); // mensaje de exito u error

  // se ejecuta cuando escribamos, name es el campo que cambiamos, value el valor escrito
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value })); // mantenemos lo anterior
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // limpiamos mensajes

    try {
     
      await addRoom({
        name: form.name,
        capacity: form.capacity,
      });
      setMessage("✅ Sala añadida correctamente");

      setForm({ // limpiamos el form
        
        name: "",
        capacity: 100, 
      });
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "❌ Error al guardar la sala");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.admin}>
      <h1>Formulario</h1>
      <h2>Añadir nueva sala</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacidad..."
          value={form.capacity}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Guardando..."
            : "Añadir sala"}
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
