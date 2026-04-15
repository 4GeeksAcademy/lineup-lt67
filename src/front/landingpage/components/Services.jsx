import React from "react";
import { motion } from "framer-motion";
import aboutImg from "../assets/LINEUP_about-img.svg"; 

export default function Services() {
  const scrollVariants = {
    offscreen: { y: 60, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", bounce: 0.5, duration: 1 }
    }
  };

  return (
    <section className="about-sec" id="nosotros" style={{ background: "#ffffff", minHeight: "100vh", display: "flex", alignItems: "center", padding: "40px 0", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{maxWidth: "1250px", margin: "0 auto", padding: "0 1rem"}}>
        <div className="row" style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
          
          <motion.div 
            className="col-lg-7 about-col-text" 
            style={{flex: '1 1 55%', paddingRight: '4rem', minWidth: '320px'}}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            variants={scrollVariants}
          >
            <h2 className="about-caps" style={{ fontSize: "clamp(3.5rem, 6vw, 90px)", marginBottom: "0", color: "var(--dark)", lineHeight: '1.1', letterSpacing: '-1px' }}>
                LA EXPERIENCIA
            </h2>
            <span className="about-italic" style={{ fontSize: "clamp(4rem, 7vw, 100px)", color: "var(--blue)", marginBottom: "30px", marginTop: "-15px", display: "inline-block", textShadow: "0 10px 30px rgba(26,54,255,0.15)" }}>
                Premium
            </span>
            
            <p className="about-body" style={{ fontSize: "1.45rem", lineHeight: "1.7", color: "var(--dark)", fontWeight: "500", letterSpacing: "0.2px" }}>
              LineUp nació de una idea inquebrantable: <span style={{color: "var(--blue)", fontWeight: "700"}}>el tiempo es tu recurso más valioso</span>. Hemos forjado una infraestructura mundial que pulveriza las filas físicas y re-conecta tu negocio de manera inmediata fluida.
            </p>
            <p className="about-body" style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "var(--dark)", opacity: 0.7, marginBottom: "40px" }}>
              Nuestros poderosos algoritmos de Inteligencia Artificial transforman instintivamente la forma en que el mundo gestiona flujos, turnos y vida real. Entra en la élite tecnológica.
            </p>
            
            <motion.a 
                href="#" 
                className="btn-blue" 
                whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(26,54,255,0.4)", y: -5 }} 
                whileTap={{ scale: 0.95 }}
                style={{ padding: "18px 45px", fontSize: "1.1rem", letterSpacing: "1px", fontWeight: "700" }}
            >
                VIVIR LA EXPERIENCIA
            </motion.a>
          </motion.div>
          
          <motion.div 
            className="col-lg-5 about-col-img" 
            style={{flex: '1 1 45%', display: 'flex', justifyContent: 'center', minWidth: '320px', position: 'relative'}}
            initial={{ opacity: 0, scale: 0.8, x: 40 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div 
                animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                style={{ position: 'absolute', top: '5%', left: '5%', width: '90%', height: '90%', background: 'radial-gradient(circle, rgba(26,54,255,0.06) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }}
            />
            {/* Tamaño drásticamente reducido del Pato */}
            <img src={aboutImg} alt="Pato pensando" className="about-duck" style={{ width: "100%", maxWidth: "260px", position: "relative", zIndex: 1, filter: "drop-shadow(0 20px 40px rgba(23,36,71,0.15))" }} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
