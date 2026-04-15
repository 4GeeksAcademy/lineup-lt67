import React from "react";
import { motion } from "framer-motion";
import heroImg from "../assets/hero_img.svg"; 

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.3, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="hero" id="inicio">
      <motion.div 
        className="hero-inner"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={itemVariants} style={{ position: 'relative' }}>
          <motion.img 
            src={heroImg} 
            alt="Mascota LINE UP" 
            className="hero-mascot" 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ position: 'relative', zIndex: 1 }}
          />
          <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(0,243,255,0.4) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(30px)', zIndex: 0, pointerEvents: 'none' }}></div>
        </motion.div>
        
        <motion.div className="hero-heading" variants={itemVariants}>
          <h1 className="hero-title01">TU TURNO</h1>
          <span className="hero-italic">sin esperar</span>
        </motion.div>
        
        <motion.p className="hero-body" variants={itemVariants}>
          LINE UP te dice exactamente cuando llegar. Sin filas, sin estrés y más importante sin hacerte perder tu tiempo.
        </motion.p>
        
        <motion.div className="hero-btns" variants={itemVariants}>
          <motion.a 
            href="#" 
            className="btn-white" 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            EMPIEZA YA &nbsp;→
          </motion.a>
          <motion.a 
            href="#nosotros" 
            className="btn-ghost-white" 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            CÓMO FUNCIONA
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
