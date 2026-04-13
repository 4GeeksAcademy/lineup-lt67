import React from "react";
import { Link } from "react-router-dom";

export const LandingNavbar = () => {
    return (
        <nav className="navbar fixed-top landing-navbar">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                
                {/* Logo LineUp (Glowing) */}
                <div className="navbar-brand m-0 order-md-1">
                    <span className="fw-bold text-white h4 mb-0" style={{ letterSpacing: "1px" }}>
                        Line<span className="text-neon-cyan">Up</span>
                    </span>
                </div>

                {/* Enlaces de Navegación Centrales */}
                <div className="d-none d-md-flex align-items-center gap-2 order-md-2">
                    <a href="#nosotros" className="nav-link-neon">Nosotros</a>
                    <a href="#mision" className="nav-link-neon">Misión</a>
                    <a href="#demo" className="nav-link-neon">Demo AI</a>
                    <a href="#equipo" className="nav-link-neon">Equipo</a>
                </div>

                {/* Botón Ir a la App (Derecha en Desktop) */}
                <div className="order-md-3">
                    <Link to="/" className="text-decoration-none">
                        <button className="btn-neon-cyan btn-sm py-1 px-3" style={{ fontSize: "0.8rem" }}>
                            Ir a la App
                            <i className="fa-solid fa-arrow-right ms-2"></i>
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
