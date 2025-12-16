import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createMovie, updateMovie } from "../../../services/movies.services";
import { uploadImage } from "../../../services/uploadservices";
import styles from "./FormMovies.module.css";

type ImageMode = "url" | "file";

export function AdminFormMovies() {
  const location = useLocation();
  const movieToEdit = (location.state as any)?.movie;

  const [form, setForm] = useState({
    _id: "",
    title: "",
    description: "",
    duration: "",
    genre: "",
    ageRating: "",
    posterUrl: "",
    releaseDate: "",
    mvpImageUrl: "",
  });

  // PÓSTER (vertical)
  const [posterMode, setPosterMode] = useState<ImageMode>("url");
  const [posterFile, setPosterFile] = useState<File | null>(null);

  // IMAGEN MVP (horizontal)
  const [mvpMode, setMvpMode] = useState<ImageMode>("url");
  const [mvpFile, setMvpFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (movieToEdit) {
      setForm({
        _id: movieToEdit._id,
        title: movieToEdit.title || "",
        description: movieToEdit.description || "",
        duration: String(movieToEdit.duration || ""),
        genre: movieToEdit.genre || "",
        ageRating: movieToEdit.ageRating || "",
        posterUrl: movieToEdit.posterUrl || "",
        releaseDate: movieToEdit.releaseDate?.split("T")[0] || "",
        mvpImageUrl: movieToEdit.mvpImageUrl || "",
      });

      setPosterMode("url");
      setPosterFile(null);
      setMvpMode("url");
      setMvpFile(null);
    }
  }, [movieToEdit]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePosterFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPosterFile(file);
  }

  function handleMvpFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setMvpFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1) URL final del póster (vertical) -> OBLIGATORIA
      let finalPosterUrl = form.posterUrl;

      if (posterMode === "file") {
        if (!posterFile) {
          setMessage("❌ Selecciona un archivo de póster.");
          setLoading(false);
          return;
        }
        const resp = await uploadImage(posterFile);
        finalPosterUrl = resp.url;
      } else {
        if (!form.posterUrl.trim()) {
          setMessage("❌ El póster (URL) es obligatorio.");
          setLoading(false);
          return;
        }
      }

      // 2) URL final de la imagen MVP (horizontal) -> OPCIONAL
      let finalMvpImageUrl = form.mvpImageUrl;

      if (mvpMode === "file") {
        if (!mvpFile) {
          setMessage("❌ Selecciona un archivo para el banner MVP o cambia a URL.");
          setLoading(false);
          return;
        }
        const respMvp = await uploadImage(mvpFile);
        finalMvpImageUrl = respMvp.url;
      }

      // 3) Crear o actualizar
      const payload = {
        title: form.title,
        description: form.description,
        duration: Number(form.duration),
        genre: form.genre,
        ageRating: form.ageRating,
        posterUrl: finalPosterUrl,
        releaseDate: form.releaseDate,
        mvpImageUrl: finalMvpImageUrl,
      };

      if (form._id) {
        await updateMovie(form._id, payload);
        setMessage("✅ Película actualizada correctamente");
      } else {
        await createMovie(payload);
        setMessage("✅ Película añadida correctamente");
      }

      // 4) Reset
      setForm({
        _id: "",
        title: "",
        description: "",
        duration: "",
        genre: "",
        ageRating: "",
        posterUrl: "",
        releaseDate: "",
        mvpImageUrl: "",
      });
      setPosterFile(null);
      setPosterMode("url");
      setMvpFile(null);
      setMvpMode("url");
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "❌ Error al guardar la película");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.admin}>
      <h1>Formulario</h1>
      <h2>{form._id ? "Editar película" : "Añadir nueva película"}</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="duration"
          placeholder="Duración (minutos)"
          value={form.duration}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="genre"
          placeholder="Género"
          value={form.genre}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="ageRating"
          placeholder="Clasificación por edad (ej: +13)"
          value={form.ageRating}
          onChange={handleChange}
          required
        />

        {/* === PÓSTER VERTICAL === */}
        <div className={styles.posterField}>
          <label className={styles.posterLabel}>Póster (vertical)</label>

          <div className={styles.posterModeToggle}>
            <button
              type="button"
              className={
                posterMode === "url"
                  ? styles.posterModeButtonActive
                  : styles.posterModeButton
              }
              onClick={() => setPosterMode("url")}
            >
              URL externa
            </button>
            <button
              type="button"
              className={
                posterMode === "file"
                  ? styles.posterModeButtonActive
                  : styles.posterModeButton
              }
              onClick={() => setPosterMode("file")}
            >
              Subir archivo
            </button>
          </div>

          {posterMode === "url" && (
            <input
              type="text"
              name="posterUrl"
              placeholder="URL del póster"
              value={form.posterUrl}
              onChange={handleChange}
              required
            />
          )}

          {posterMode === "file" && (
            <input type="file" accept="image/*" onChange={handlePosterFileChange} />
          )}

          <div className={styles.posterPreviewWrapper}>
            {posterMode === "url" && form.posterUrl && (
              <img
                src={form.posterUrl}
                alt="Previsualización póster"
                className={styles.posterPreview}
              />
            )}

            {posterMode === "file" && posterFile && (
              <img
                src={URL.createObjectURL(posterFile)}
                alt="Previsualización póster"
                className={styles.posterPreview}
              />
            )}
          </div>
        </div>

        {/* === IMAGEN MVP HORIZONTAL === */}
        <div className={styles.posterField}>
          <label className={styles.posterLabel}>
            Foto formato MVP (banner horizontal)
          </label>

          <div className={styles.posterModeToggle}>
            <button
              type="button"
              className={
                mvpMode === "url"
                  ? styles.posterModeButtonActive
                  : styles.posterModeButton
              }
              onClick={() => setMvpMode("url")}
            >
              URL externa
            </button>
            <button
              type="button"
              className={
                mvpMode === "file"
                  ? styles.posterModeButtonActive
                  : styles.posterModeButton
              }
              onClick={() => setMvpMode("file")}
            >
              Subir archivo
            </button>
          </div>

          {mvpMode === "url" && (
            <input
              type="text"
              name="mvpImageUrl"
              placeholder="URL imagen horizontal (ej: 1920x1080)"
              value={form.mvpImageUrl}
              onChange={handleChange}
            />
          )}

          {mvpMode === "file" && (
            <input type="file" accept="image/*" onChange={handleMvpFileChange} />
          )}

          <p className={styles.fieldHint}>
            Opcional. Pero para poder seleccionar esta película en “MVP Películas”
            necesitarás rellenar este banner horizontal.
          </p>

          <div className={styles.posterPreviewWrapper}>
            {mvpMode === "url" && form.mvpImageUrl && (
              <img
                src={form.mvpImageUrl}
                alt="Previsualización imagen MVP"
                className={styles.posterPreview}
              />
            )}

            {mvpMode === "file" && mvpFile && (
              <img
                src={URL.createObjectURL(mvpFile)}
                alt="Previsualización imagen MVP"
                className={styles.posterPreview}
              />
            )}
          </div>
        </div>

        <input
          type="date"
          name="releaseDate"
          value={form.releaseDate}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Guardando..."
            : form._id
            ? "Actualizar película"
            : "Añadir película"}
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
