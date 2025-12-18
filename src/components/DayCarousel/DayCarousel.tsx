
import React, { useState } from "react";
import styles from "./DayCarousel.module.css";

export interface DayItem {
  id: string;
  label: string;
}
// Propiedades que recibe el componente Daycarousel
interface DayCarouselProps {
  days: DayItem[];
  selectedDayId: string;
  onChange: (dayId: string) => void; //función que avisa al padre cuando cambia el día
  visibleCount?: number; // cuántos días se ven a la vez (por defecto 5)
  loading?: boolean;     // opcional: desactivar botones mientras carga
}

const DayCarousel: React.FC<DayCarouselProps> = ({
  days,
  selectedDayId,
  onChange,
  visibleCount = 5,
  loading = false,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const currentIndex = days.findIndex((d) => d.id === selectedDayId); // buscamos el indice del día actual
  const endIndex = startIndex + visibleCount; //Calcula hasta dónde llega la ventana visible
  const visibleDays = days.slice(startIndex, endIndex); //Extrae solo los días que se mostrarán
  const ensureVisibleWindow = (targetIndex: number, prevStart: number) => { //El día seleccionado siempre esté dentro de los días visibles
    let newStart = prevStart;

    if (targetIndex < prevStart) {
      newStart = targetIndex; //El día seleccionado pasa a ser el primero visible
    } else if (targetIndex >= prevStart + visibleCount) {
      newStart = targetIndex - visibleCount + 1; //El día seleccionado entra como último visible
    }

    if (newStart < 0) newStart = 0; //evitamos indices negativos
    if (newStart > days.length - visibleCount) {
      newStart = Math.max(days.length - visibleCount, 0);//Si hay menos días que visibleCount, empieza en 0
    }

    return newStart;
  };

  const handleNext = () => {
    if (loading) return;
    if (currentIndex === -1 || currentIndex >= days.length - 1) return; //No avanza si:no hay día seleccionado ,ya estás en el último día

    const newIndex = currentIndex + 1;
    onChange(days[newIndex].id);
    setStartIndex((prev) => ensureVisibleWindow(newIndex, prev));//Ajusta la ventana visible para incluir el nuevo día
  };

  const handlePrev = () => {
    if (loading) return;
    if (currentIndex <= 0) return; //no retrocede si estas en el primer dia o no hay selección valida

    const newIndex = currentIndex - 1;
    onChange(days[newIndex].id); //selecciona el dia anterior
    setStartIndex((prev) => ensureVisibleWindow(newIndex, prev)); //Ajusta la ventana visible para incluir el nuevo día
  };

  const handleClickDay = (dayId: string) => {
    if (loading) return;
    const index = days.findIndex((d) => d.id === dayId);//Obtiene el índice del día clicado
    onChange(dayId);//Notifica al padre del cambio
    if (index === -1) return; // proteccion por si el dia no existe
    setStartIndex((prev) => ensureVisibleWindow(index, prev));
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.arrow}
        onClick={handlePrev}
        disabled={loading || currentIndex <= 0}
      >
        ◀
      </button>

      <div className={styles.container}>
        {visibleDays.map((day) => {
          const isActive = day.id === selectedDayId;

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => handleClickDay(day.id)}
              className={`${styles.dayButton} ${
                isActive ? styles.active : ""
              }`}
              disabled={loading}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.arrow}
        onClick={handleNext}
        disabled={loading || currentIndex === -1 || currentIndex >= days.length - 1}
      >
        ▶
      </button>
    </div>
  );
};

export default DayCarousel;
