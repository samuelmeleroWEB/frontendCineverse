import { useSwiper } from "swiper/react";
import { BiRewind, BiFastForward } from "react-icons/bi";

export const SwiperNavButtons = () => {
  const swiper = useSwiper();

  return (
    <div className="swiper-nav-btns">
      <button
        type="button"
        className="nav-btn nav-btn-prev"
        onClick={() => swiper.slidePrev()}
        aria-label="Anterior"
      >
        <BiRewind size={40} />
      </button>

      <button
        type="button"
        className="nav-btn nav-btn-next"
        onClick={() => swiper.slideNext()}
        aria-label="Siguiente"
      >
        <BiFastForward size={40} />
      </button>
    </div>
  );
};
