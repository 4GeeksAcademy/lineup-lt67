import React from "react";
import { motion } from "framer-motion";

export const LandingHero = () => {
    // Variantes para las animaciones escalonadas
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    // Generar partículas aleatorias para el fondo
    const particles = Array.from({ length: 20 });

    return (
        <section className="vh-100 d-flex align-items-center justify-content-center position-relative">
            {/* Fondo de Partículas Animadas */}
            <div className="particle-field position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0, overflow: "hidden" }}>
                {particles.map((_, i) => (
                    <div 
                        key={i} 
                        className={`particle ${i % 2 === 0 ? 'particle-cyan' : 'particle-purple'}`}
                        style={{
                            position: "absolute",
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            animationDuration: `${Math.random() * 15 + 10}s`,
                            animationDelay: `${Math.random() * 10}s`,
                            borderRadius: "50%",
                            opacity: 0.5
                        }}
                    ></div>
                ))}
            </div>

            <motion.div 
                className="container text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ zIndex: 1 }}
            >
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10">
                        {/* Subtítulo dinámico */}
                        <motion.span 
                            variants={itemVariants}
                            className="text-neon-purple fw-bold mb-3 d-block"
                            style={{ letterSpacing: "4px", fontSize: "0.9rem" }}
                        >
                            EL FUTURO DE LAS FILAS ES DIGITAL
                        </motion.span>

                        {/* Título Principal Gigante */}
                        <motion.h1 
                            variants={itemVariants}
                            className="hero-title mb-4"
                        >
                            LineUp
                        </motion.h1>

                        {/* Descripción breve */}
                        <motion.p 
                            variants={itemVariants}
                            className="lead text-white-50 mb-5 mx-auto"
                            style={{ maxWidth: "600px" }}
                        >
                            Gestiona tus servicios, turnos y establecimientos con la potencia de la Inteligencia Artificial. Menos espera, más eficiencia.
                        </motion.p>

                        {/* Botones de acción principal */}
                        <motion.div 
                            variants={itemVariants}
                            className="d-flex flex-column flex-sm-row justify-content-center gap-4"
                        >
                            <button className="btn-neon-cyan px-5">
                                Ver Servicios
                            </button>
                            <button className="btn-neon-purple px-5">
                                Crear Cuenta
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <i className="fa-solid fa-chevron-down h3"></i>
            </div>

            {/* Background elements (Decorative Glows) */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: -1, overflow: "hidden" }}>
                <div style={{ 
                    position: "absolute", 
                    width: "40vw", 
                    height: "40vw", 
                    top: "-10vw", 
                    right: "-10vw", 
                    background: "radial-gradient(circle, rgba(192, 132, 252, 0.15) 0%, rgba(0,0,0,0) 70%)",
                    borderRadius: "50%"
                }}></div>
                <div style={{ 
                    position: "absolute", 
                    width: "30vw", 
                    height: "30vw", 
                    bottom: "-5vw", 
                    left: "-5vw", 
                    background: "radial-gradient(circle, rgba(0, 243, 255, 0.1) 0%, rgba(0,0,0,0) 70%)",
                    borderRadius: "50%"
                }}></div>
            </div>
        </section>
    );
};
