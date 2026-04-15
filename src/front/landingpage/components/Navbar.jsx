import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Uses neon cyan directly or through inline style for fusion

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav className={`navbar-glass ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <a href="#" className="nav-logo" style={{textDecoration: "none"}}>
          {/* Fusion: Logo look from LandingNavbar */}
          <span className="fw-bold text-white h4 mb-0" style={{ letterSpacing: "1px", margin: "0", color: "var(--white)", textShadow: "0 0 10px rgba(255,255,255,0.7)" }}>
              LineUp
          </span>
        </a>
        <ul className="nav-menu d-none d-md-flex">
          <li><a href="#inicio" className="active">Inicio</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="#mision">Misión</a></li>
          <li><a href="#demo">Demo AI</a></li>
          <li><a href="#equipo">Equipo</a></li>
        </ul>
        {/* Usamos el enlace tipo app del LandingNavbar combinado con el btn-nav del Welcome */}
        <Link to="/" className="btn-nav" style={{textDecoration: "none"}}>
           Ir a la App <span style={{marginLeft: "6px"}}>→</span>
        </Link>
      </nav>
    </header>
  );
}
