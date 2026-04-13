import React from "react";
import { motion } from "framer-motion";
import "./LandingStyles.css";

export const FinalCTA = () => {
    return (
        <section className="final-cta-section py-5 text-center position-relative">
            <div className="cta-glow-bg"></div>
            <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="py-5"
                >
                    <h2 className="display-4 fw-bold text-white mb-4">
                        ¿Listo para eliminar la <span className="text-neon-cyan">Espera</span>?
                    </h2>
                    <p className="lead text-white-50 mb-5 mx-auto" style={{ maxWidth: "700px" }}>
                        Únete a miles de negocios que ya están optimizando su tiempo y aumentando sus ingresos con LineUp.
                    </p>
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-4">
                        <button className="btn-neon-cyan px-5 py-3">
                            Empezar Gratis Ahora
                        </button>
                        <button className="btn-neon-purple px-5 py-3">
                            Conviertete En Liner
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
