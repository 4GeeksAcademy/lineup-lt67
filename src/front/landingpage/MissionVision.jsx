import React from "react";
import { motion } from "framer-motion";
import "./LandingStyles.css";

export const MissionVision = () => {
    return (
        <section id="mision" className="py-5" style={{ background: "var(--bg-dark)" }}>
            <div className="container py-5">
                <div className="text-center mb-5">
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: false }}
                        className="display-5 fw-bold text-white mb-3"
                    >
                        Nuestra <span className="text-neon-cyan">Esencia</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: false }}
                        className="text-white-50 mx-auto"
                        style={{ maxWidth: "700px" }}
                    >
                        Más que una plataforma, somos el puente hacia una gestión de servicios sin fricciones, 
                        impulsada por la innovación constante.
                    </motion.p>
                </div>

                <div className="row g-4">
                    {/* Tarjeta Misión */}
                    <div className="col-md-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            viewport={{ once: false }}
                            className="card-neon card-neon-cyan"
                        >
                            <div className="mb-4">
                                <i className="fa-solid fa-rocket text-neon-cyan h1"></i>
                            </div>
                            <h3 className="text-white fw-bold mb-4">Nuestra Misión</h3>
                            <p className="text-white-50 lead">
                                Empoderar a negocios y clientes mediante una infraestructura digital 
                                robusca que elimine las pérdidas de tiempo innecesarias y maximice 
                                la productividad diaria a través de soluciones de IA accesibles para todos.
                            </p>
                        </motion.div>
                    </div>

                    {/* Tarjeta Visión */}
                    <div className="col-md-6">
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            viewport={{ once: false }}
                            className="card-neon card-neon-purple"
                        >
                            <div className="mb-4">
                                <i className="fa-solid fa-eye text-neon-purple h1"></i>
                            </div>
                            <h3 className="text-white fw-bold mb-4">Nuestra Visión</h3>
                            <p className="text-white-50 lead">
                                Ser el ecosistema líder a nivel global en la gestión de turnos y servicios, 
                                estableciendo el estandar de eficiencia y experiencia de usuario en 
                                ciudades inteligentes del futuro.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
