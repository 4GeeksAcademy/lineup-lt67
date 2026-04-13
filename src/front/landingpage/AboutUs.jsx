import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import "./LandingStyles.css";

const Counter = ({ value, duration = 2, suffix = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref);
    
    // Spring animation for smooth numerical transition
    const springValue = useSpring(0, {
        duration: duration * 1000,
        bounce: 0,
    });
    
    const displayValue = useTransform(springValue, (latest) => 
        Math.floor(latest).toLocaleString() + suffix
    );

    useEffect(() => {
        if (isInView) {
            springValue.set(value);
        } else {
            springValue.set(0);
        }
    }, [isInView, value, springValue]);

    return (
        <motion.span ref={ref} className="stat-number text-neon-cyan">
            {displayValue}
        </motion.span>
    );
};

export const AboutUs = () => {
    return (
        <section id="nosotros" className="py-5" style={{ background: "var(--bg-dark)" }}>
            <div className="container py-5">
                <div className="row align-items-center mb-5">
                    {/* Columna Texto */}
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: false }}
                        >
                            <h6 className="text-neon-purple text-uppercase fw-bold mb-3">Nuestra Historia</h6>
                            <h2 className="display-4 fw-bold mb-4 text-white">
                                Redefiniendo la <span className="text-neon-cyan">Experiencia</span> de Espera
                            </h2>
                            <p className="lead text-white-50 mb-4">
                                LineUp nació de una idea simple: el tiempo es nuestro recurso más valioso. 
                                Hemos construido una plataforma que utiliza tecnología de punta para 
                                eliminar las filas físicas y optimizar la conexión entre proveedores y clientes.
                            </p>
                            <p className="text-white-50 mb-5">
                                Con nuestra infraestructura basada en la nube y algoritmos de IA, 
                                transformamos la forma en que el mundo gestiona turnos, servicios y 
                                establecimientos en tiempo real.
                            </p>
                        </motion.div>
                    </div>

                    {/* Columna Imagen */}
                    <div className="col-lg-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: false }}
                            className="landing-image-container"
                        >
                            <img 
                                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
                                alt="Tecnología Neón LineUp" 
                                className="img-fluid"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="row text-center mt-5 stats-container gx-0">
                    <div className="col-md-4 stat-item">
                        <Counter value={3} suffix="" />
                        <span className="text-white-50 text-uppercase small fw-bold">Miembros Fundadores</span>
                    </div>
                    <div className="col-md-4 stat-item">
                        <Counter value={3} suffix="" />
                        <span className="text-white-50 text-uppercase small fw-bold">Países Operando</span>
                    </div>
                    <div className="col-md-4 stat-item">
                        <Counter value={98000} suffix="+" />
                        <span className="text-white-50 text-uppercase small fw-bold">Usuarios Activos</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
