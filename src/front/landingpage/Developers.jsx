import React from "react";
import { motion } from "framer-motion";
import "./LandingStyles.css";

const team = [
    {
        name: "Abraham",
        role: "Fullstack / AI Specialist",
        desc: "Cerebro detrás de la integración con Gemini AI, conectando datos y lógica para predicciones precisas.",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJstCbfzKY01Z4hufdLCfKHktNBO2BhXoWRA&s",
        color: "var(--neon-cyan)"
    },
    {
        name: "Juan",
        role: "Lead Developer / Arquitecto",
        desc: "Encargado de la estructura central y escalabilidad de LineUp, obsesionado con el código limpio y eficiente.",
        img: "https://i.pinimg.com/736x/a5/37/05/a53705b9a77b24e5b04b99e06b737a60.jpg",
        color: "var(--neon-purple)"
    },
    {
        name: "Humberto",
        role: "Frontend Specialist / UX",
        desc: "Diseñador de la experiencia visual y fluidez de la interfaz, experto en crear interfaces que se sienten vivas.",
        img: "https://i.pinimg.com/736x/a2/bd/a1/a2bda19504c043b128a525472bc9d32f.jpg",
        color: "var(--neon-cyan)"
    }
];

export const Developers = () => {
    return (
        <section id="equipo" className="py-5" style={{ background: "var(--bg-dark)" }}>
            <div className="container py-5">
                <div className="text-center mb-5">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        className="display-6 fw-bold text-white mb-2"
                    >
                        Los Creadores tras <span className="text-neon-cyan">LineUp</span>
                    </motion.h2>
                    <p className="text-white-50">Ingeniería y diseño unidos por un propósito.</p>
                </div>

                <div className="row g-4">
                    {team.map((member, index) => (
                        <div key={index} className="col-lg-4">
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: false }}
                                className="dev-card"
                            >
                                <div className="dev-img-wrapper" style={{ boxShadow: `0 0 20px ${member.color}33` }}>
                                    <img src={member.img} alt={member.name} className="dev-img" />
                                </div>
                                <h4 className="text-white fw-bold mb-1">{member.name}</h4>
                                <p className="text-neon-cyan small fw-bold mb-4">{member.role}</p>
                                <p className="text-white-50 mb-4 px-3" style={{ fontSize: "0.9rem" }}>
                                    {member.desc}
                                </p>
                                <div className="d-flex justify-content-center">
                                    <a href="#" className="dev-social-link"><i className="fa-brands fa-linkedin-in"></i></a>
                                    <a href="#" className="dev-social-link"><i className="fa-brands fa-github"></i></a>
                                    <a href="#" className="dev-social-link"><i className="fa-brands fa-twitter"></i></a>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
