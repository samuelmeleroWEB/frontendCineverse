import { FaInstagram, FaTwitter, FaTiktok, FaYoutube } from "react-icons/fa";
import estilos from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={estilos.footerCineverse}>
      {/* --- PARTE SUPERIOR: Contenido --- */}
      <div className={estilos.footerContent}>
        
        {/* Columna 1: Marca y Sobre nosotros */}
        <div className={`${estilos.footerSection} ${estilos.brand}`}>
          <h2 className={estilos.footerLogo}>CINEVERSE</h2>
          <p>
            La mejor experiencia cinematográfica inmersiva. 
            Vive el cine como nunca antes con nuestra tecnología láser 4K y sonido Dolby Atmos.
          </p>
          <div className={estilos.socialIcons}>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaTiktok /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div className={`${estilos.footerSection} ${estilos.links}`}>
          <h3>CARTELERA</h3>
          <ul>
            <li><a href="#">Estrenos</a></li>
            <li><a href="#">Próximamente</a></li>
            <li><a href="#">Eventos Especiales</a></li>
            <li><a href="#">Sala Junior</a></li>
            <li><a href="#">Sala VIP</a></li>
          </ul>
        </div>

        {/* Columna 3: Ayuda / Legal */}
        <div className={`${estilos.footerSection} ${estilos.links}`}>
          <h3>AYUDA</h3>
          <ul>
            <li><a href="#">Contacto</a></li>
            <li><a href="#">Trabaja con nosotros</a></li>
            <li><a href="#">Aviso Legal</a></li>
            <li><a href="#">Política de Privacidad</a></li>
            <li><a href="#">Política de Cookies</a></li>
          </ul>
        </div>

        {/* Columna 4: Newsletter */}
        <div className={`${estilos.footerSection} ${estilos.newsletter}`}>
          <h3>NO TE PIERDAS NADA</h3>
          <p>Suscríbete para recibir ofertas exclusivas y palomitas gratis en tu cumpleaños.</p>
          <form className={estilos.newsletterForm}>
            <input type="email" placeholder="Tu correo electrónico..." />
            <button type="button">SUSCRIBIRME</button>
          </form>
        </div>

      </div>

      {/* --- PARTE INFERIOR: Copyright --- */}
      <div className={estilos.footerBottom}>
        <p>&copy; {new Date().getFullYear()} CINEVERSE S.L. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
