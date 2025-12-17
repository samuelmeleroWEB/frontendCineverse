
import styles from "./MyData.module.css";
import { useAuthStore } from "../../../store/auth.store"; 
export default function MyData() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const email = user.email;
  const username = email.split("@")[0];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mis datos</h1>

      <div className={styles.card}>
        <div className={styles.row}>
          <span className={styles.label}>Nombre de usuario</span>
          <span className={styles.value}>{username}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Correo electrónico</span>
          <span className={styles.value}>{email}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Contraseña</span>
          <span className={styles.value}>********</span>
        </div>

        <button className={styles.changePassword}>
          Cambiar contraseña
        </button>
      </div>
    </div>
  );
}
