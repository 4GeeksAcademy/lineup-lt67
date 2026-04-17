import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoMenu from "../assets/logo-menu.svg"
import "../LandingStyles.css";
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
      <nav className="navbar-glass" id="navbar">
        <div className="nav-left">
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
        </div>
        <div className="nav-right">
          <a href="#" className="btn-nav01" onClick={(e) => { e.preventDefault(); navigate("/client/login"); }}>Acceder</a>
          <a href="#" className="btn-nav-outline">Registrarme</a>
        </div>
      </nav>
    </header>
  );
}
