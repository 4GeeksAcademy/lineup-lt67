import React from "react";
import { motion } from "framer-motion";

export default function Stats() {
  return (
    <section className="stats-band" style={{ background: "linear-gradient(90deg, #0d1e66 0%, #172447 50%, #0d1e66 100%)", padding: "80px 0", borderTop: "1px solid rgba(0,243,255,0.1)", borderBottom: "1px solid rgba(0,0,0,0.5)", position: "relative", overflow: "hidden" }}>
        {/* Luces de Neon Dinamicas */}
        <motion.div 
            animate={{ x: [-100, 100, -100], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            style={{ position: 'absolute', top: '-50px', left: '20%', width: '300px', height: '100px', background: 'var(--blue)', filter: 'blur(80px)', pointerEvents: 'none' }}
        />
        <motion.div 
            animate={{ x: [100, -100, 100], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            style={{ position: 'absolute', bottom: '-50px', right: '20%', width: '400px', height: '150px', background: '#050a1a', filter: 'blur(80px)', pointerEvents: 'none' }}
        />

        <div className="container" style={{maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1}}>
          <motion.div 
            className="stats-row"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
                visible: { transition: { staggerChildren: 0.2 } },
                hidden: {}
            }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0', flexWrap: 'wrap' }}
          >
            <motion.div className="stat-item" style={{ flex: 1, textAlign: 'center', minWidth: '250px' }} variants={{ hidden: { opacity: 0, scale: 0.8}, visible: { opacity: 1, scale: 1}}}>
              <span className="stat-num" style={{ textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>15</span>
              <span className="stat-lbl" style={{ color: "var(--blue)", letterSpacing: "2px", textShadow: "0 0 10px rgba(255,255,255,0.9)" }}>MINUTOS</span>
              <p className="stat-desc" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>Tiempo de espera promedio por usuario</p>
            </motion.div>
            
            <div className="stat-divider" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,243,255,0.2), transparent)" }}></div>
            
            <motion.div className="stat-item" style={{ flex: 1, textAlign: 'center', minWidth: '250px' }} variants={{ hidden: { opacity: 0, scale: 0.8}, visible: { opacity: 1, scale: 1}}}>
              <span className="stat-num" style={{ textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>+25K</span>
              <span className="stat-lbl" style={{ color: "var(--blue)", letterSpacing: "2px", textShadow: "0 0 10px rgba(255,255,255,0.9)" }}>USUARIOS</span>
              <p className="stat-desc" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>Activos y usando la app diariamente</p>
            </motion.div>
            
            <div className="stat-divider" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,243,255,0.2), transparent)" }}></div>
            
            <motion.div className="stat-item" style={{ flex: 1, textAlign: 'center', minWidth: '250px' }} variants={{ hidden: { opacity: 0, scale: 0.8}, visible: { opacity: 1, scale: 1}}}>
              <span className="stat-num" style={{ textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>24/7</span>
              <span className="stat-lbl" style={{ color: "var(--blue)", letterSpacing: "2px", textShadow: "0 0 10px rgba(255,255,255,0.9)" }}>MONITOREO</span>
              <p className="stat-desc" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>Data e información siempre en tiempo real</p>
            </motion.div>
          </motion.div>
        </div>
    </section>
  )
}
