import React from "react";
import { motion } from "framer-motion";
import ctaImg from "../assets/LINEUP_CTA-img.svg"; // Fallback to Welcome01 duck image

export default function FinalCTA() {
  return (
    <section className="cta-wrapper">
      <div className="container" id="cta" style={{maxWidth: "1200px", margin: "0 auto", padding: "0 1rem"}}>
        <motion.div 
          className="cta-sec"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img src={ctaImg} alt="Pato CTA" className="cta-duck" />
          <div className="cta-content">
            <h2 className="cta-title">¿LISTO PARA ELIMINAR LA ESPERA?</h2>
            <p className="cta-body">
              Únete a miles de negocios que ya están optimizando su tiempo y aumentando sus ingresos con LineUp.
            </p>
            <div className="cta-btns">
              <a href="#" className="btn-blue">EMPEZAR GRATIS AHORA</a>
              <a href="#" className="btn-ghost-dark">CONVIERTETE EN LINER</a>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="cta-footer-bg"></div>
    </section>
  )
}
