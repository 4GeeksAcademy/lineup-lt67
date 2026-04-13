import React from "react";
import { LandingNavbar } from "./LandingNavbar";
import { LandingHero } from "./LandingHero";
import { AboutUs } from "./AboutUs";
import { MissionVision } from "./MissionVision";
import { ChatDemo } from "./ChatDemo";
import { Developers } from "./Developers";
import { Testimonials } from "./Testimonials";
import { FinalCTA } from "./FinalCTA";
import { Link } from "react-router-dom";
import "./LandingStyles.css";

export const MainLanding = () => {
    return (
        <div className="landing-container">
            {/* 1. Navegación */}
            <LandingNavbar />

            {/* 2. Sección de Impacto (Hero) */}
            <LandingHero />

            {/* 3. Quiénes Somos & Estadísticas */}
            <AboutUs />

            {/* 4. Misión y Visión con Tarjetas Neón */}
            <MissionVision />

            {/* 5. Demo Interactiva de Chat IA */}
            <ChatDemo />

            {/* 6. Sección de Equipo: Los Desarrolladores */}
            <Developers />

            {/* 7. Prueba Social (Testimonios) */}
            <Testimonials />

            {/* 8. Llamado a la Acción Final */}
            <FinalCTA />

            {/* 8. Pie de Página Personalizado (Footer) */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
                            <h4 className="text-white fw-bold mb-3">Line<span className="text-neon-cyan">Up</span></h4>
                            <p className="text-white-50 small mb-0">© 2026 LineUp Systems. Todos los derechos reservados.</p>
                            <p className="text-neon-purple small fw-bold mt-2">
                                Hecho con amor y pasión por Abraham, Juan y Humberto
                            </p>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex justify-content-center justify-content-md-end gap-4">
                                <Link to="#" className="footer-link small">Términos</Link>
                                <Link to="#" className="footer-link small">Privacidad</Link>
                                <Link to="#" className="footer-link small">Contacto</Link>
                                <div className="d-flex gap-3 ms-md-4">
                                    <i className="fa-brands fa-twitter text-white-50"></i>
                                    <i className="fa-brands fa-linkedin text-white-50"></i>
                                    <i className="fa-brands fa-github text-white-50"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
