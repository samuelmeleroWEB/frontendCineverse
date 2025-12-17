import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCartStore } from "../../../store/cart.store";
import { useAuthStore } from "../../../store/auth.store";
import { createBooking } from "../../../services/booking.services";
import styles from "./CartPage.module.css";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, clearCart, totalAmount } = useCartStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleCheckout() {
    if (isCheckingOut) return;

    if (!token) {
      toast.error("Debes iniciar sesión para completar la compra.");
      navigate("/");
      return;
    }

    try {
      setIsCheckingOut(true);
      await createBooking(items);
      toast.success("Compra realizada correctamente 🎟️");
      clearCart();
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar la compra.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>Tu carrito</h1>

        {items.length === 0 ? (
          <p className={styles.empty}>Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.id} className={styles.item}>
                  {item.type === "ticket" ? (
                    <div className={styles.itemInfo}>
                      <h3>{item.movieTitle}</h3>
                      <p>
                        Sesión:{" "}
                        {new Date(item.sessionDateTime).toLocaleString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {item.roomName}
                      </p>
                      <p>Butacas: {item.seats.join(", ")}</p>
                    </div>
                  ) : (
                    <div className={styles.itemInfo}>
                      <h3>{item.name}</h3>
                      <p>Cantidad: {(item as any).quantity}</p>
                    </div>
                  )}

                  <div className={styles.itemRight}>
                    <span className={styles.price}>
                      {item.total.toFixed(2)} €
                    </span>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                      disabled={isCheckingOut}
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.summary}>
              <div>
                <span>Total : </span>
                <strong>{totalAmount().toFixed(2)} €</strong>
              </div>

              <button
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <span className={styles.loadingContent}>
                    <span className={styles.spinner} />
                    Procesando...
                  </span>
                ) : (
                  "Finalizar compra"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
