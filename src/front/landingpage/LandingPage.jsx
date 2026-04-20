import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatDemo from "./components/ChatDemo";
import Developer from "./components/Developer";
import Footer from "./components/Footer";
import "./LandingStyles.css";

// Assets
import logoMenu from "./assets/logo-menu.svg";
import logoFooter from "./assets/logo-footer.svg";
import heroImg from "./assets/hero_img.svg";
import aboutImg from "./assets/LINEUP_about-img.svg";
import ctaImg from "./assets/LINEUP_CTA-img.svg";

export default function Welcome01() {

  const navigate = useNavigate();

  useEffect(() => {
    const nav = document.getElementById("navbar");
    const handleScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);

      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-menu li a:not(.dropdown-toggle)");

      let current = "";
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 100) {
          current = section.getAttribute("id");
        }
      });
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (
          link.getAttribute("href") === "#" + current ||
          (current === "inicio" && link.getAttribute("href") === "#")
        ) {
          link.classList.add("active");
        }
      });
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-wrapper")) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClickOutside);
    window.dispatchEvent(new Event("scroll"));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <header>
        <nav className="navbar-glass" id="navbar">
          <a href="#" className="nav-logo">
            <img src={logoMenu} alt="LINE UP" />
          </a>
          <ul className="nav-menu">
            <li><a href="#" className="active">Inicio</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#demo">Demo AI</a></li>
            <li><a href="#equipo">Equipo</a></li>
            <li><a href="#testimonios">Testimonios</a></li>
          </ul>
          <div className="nav-right">
            <a href="#" className="btn-nav01" onClick={(e) => { e.preventDefault(); navigate("/client/login"); }}>Acceder</a>
            <a href="#" className="btn-nav-outline" onClick={(e) => { e.preventDefault(); navigate("/client/register")}}>Registrarme</a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="hero-inner">
          <img src={heroImg} alt="Mascota LINE UP" className="hero-mascot" />
          <div className="hero-heading">
            <h1 className="hero-title01">TU TURNO</h1>
            <span className="hero-italic">sin esperar</span>
          </div>
          <p className="hero-body">
            LINE UP te dice exactamente cuando llegar. Sin filas, sin estrés y más importante sin hacerte perder tu tiempo.
          </p>
          <div className="hero-btns">
            <a href="#" className="btn-white">EMPIEZA YA &nbsp;→</a>
            <a href="#nosotros" className="btn-ghost-white">CÓMO FUNCIONA</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-band">
        <div className="container">
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-num">15</span>
              <span className="stat-lbl">MINUTOS</span>
              <p className="stat-desc">Tiempo de espera promedio por usuario</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-num">+25K</span>
              <span className="stat-lbl">USUARIOS</span>
              <p className="stat-desc">Activos y usando la app diariamente</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-num">24/7</span>
              <span className="stat-lbl">MONITOREO</span>
              <p className="stat-desc">Data e información siempre en tiempo real</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-sec" id="nosotros">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 about-col-text">
              <h2 className="about-caps">LA EXPERIENCIA</h2>
              <span className="about-italic">de esperar</span>
              <p className="about-body">
                LineUp nació de una idea simple: el tiempo es nuestro recurso más valioso. Hemos construido una plataforma que utiliza tecnología de punta para eliminar las filas físicas y optimizar la conexión entre proveedores y clientes.
              </p>
              <p className="about-body">
                Con nuestra infraestructura basada en la nube y algoritmos de IA, transformamos la forma en que el mundo gestiona turnos, servicios y establecimientos en tiempo real.
              </p>
              <a href="#" className="btn-blue">PROBAR AHORA</a>
            </div>
            <div className="col-lg-6 about-col-img">
              <img src={aboutImg} alt="Pato pensando en burger" className="about-duck" />
            </div>
          </div>
        </div>
      </section>

      {/* CHAT DEMO */}
      <ChatDemo />

      {/*EQUIPO*/}
      <Developer />
      
      {/* TESTIMONIALS + CTA */}
      <section className="testi-sec" id="testimonios">
        <div className="container">
          <div className="text-center mb-0">
            <h2 className="testi-caps">LO QUE DICEN</h2>
            <span className="testi-italic">de nosotros</span>
          </div>
          <div className="testi-cards-row">
            {[1, 2, 3].map((i) => (
              <div className="testi-col" key={i}>
                <div className="testi-avatar"></div>
                <div className="testi-card">
                  <p>Nemo enim ipsam voluptatem quia asperiatur aut odit fugit sed quia consequuntur magni dolores eos ratione.</p>
                  <strong className="testi-name">MARCUS WHITFIELD</strong>
                  <span className="testi-role">DUEÑO DE RESTAURANTE</span>
                  <div className="testi-stars">★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container" id="cta">
          <div className="cta-sec">
            <img src={ctaImg} alt="Pato CTA" className="cta-duck" />
            <div className="cta-content">
              <h2 className="cta-title">¿LISTO PARA ELIMINAR LAS FILAS?</h2>
              <p className="cta-body">
                Únete a miles de negocios que ya están optimizando su tiempo y aumentando sus ingresos con LINE UP.
              </p>
              <div className="cta-btns">
                <a href="#" className="btn-blue">PROBAR AHORA</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer/>

    </>
  );
}