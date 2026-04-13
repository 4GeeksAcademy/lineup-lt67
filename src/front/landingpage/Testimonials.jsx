import React from "react";
import { motion } from "framer-motion";
import "./LandingStyles.css";

const testimonials = [
    {
        name: "Carlos Mendoza",
        role: "Dueño de Restaurante",
        text: "LineUp cambió radicalmente cómo manejamos la hora del almuerzo. Mis clientes ya no se van por ver una fila larga.",
        img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
        stars: 5
    },
    {
        name: "Elena Rossi",
        role: "Gerente de Clínica",
        text: "La IA predictiva es increíble. Sabemos exactamente cuánto tiempo tomará cada servicio antes de que empiece.",
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        stars: 5
    },
    {
        name: "Miguel Ángel",
        role: "Freelancer Servicios IT",
        text: "Como Liner, la app me permite encontrar trabajos cerca de mí y gestionar mi agenda de forma súper eficiente.",
        img: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200",
        stars: 4
    }
];

export const Testimonials = () => {
    return (
        <section id="testimonios" className="py-5" style={{ background: "var(--bg-dark)" }}>
            <div className="container py-5">
                <div className="text-center mb-5">
                    <motion.h2 
                        initial={{ opacity:0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        className="display-6 fw-bold text-white mb-2"
                    >
                        Lo que dicen <span className="text-neon-purple">nuestros usuarios</span>
                    </motion.h2>
                    <p className="text-white-50">Impacto real en negocios reales.</p>
                </div>

                <div className="row g-4">
                    {testimonials.map((t, index) => (
                        <div key={index} className="col-lg-4">
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: false }}
                                className="testimonial-card"
                            >
                                <div className="d-flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fa-solid fa-star ${i < t.stars ? "star-rating" : "text-white-50"}`} style={{ fontSize: "0.8rem" }}></i>
                                    ))}
                                </div>
                                <p className="text-white mb-4 italic">"{t.text}"</p>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="testimonial-img-wrapper">
                                        <img src={t.img} alt={t.name} className="testimonial-img" />
                                    </div>
                                    <div>
                                        <h6 className="text-white mb-0">{t.name}</h6>
                                        <small className="text-neon-cyan">{t.role}</small>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
