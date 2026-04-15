import React from "react";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    { name: "AI PREDICTIVA", desc: "Con nuestra infraestructura basada en la nube y algoritmos de IA." },
    { name: "ULTRA VELOCIDAD", desc: "Con nuestra infraestructura basada en la nube y algoritmos de IA." },
    { name: "SEGURIDAD TOTAL", desc: "Con nuestra infraestructura basada en la nube y algoritmos de IA." },
    { name: "TIEMPO REAL", desc: "Con nuestra infraestructura basada en la nube y algoritmos de IA." },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.3 } }
  };

  return (
    <section className="features-sec">
      <div className="container" style={{maxWidth: "1200px", margin: "0 auto", padding: "0 1rem"}}>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{flex: '1 1 100%'}}>
            <h2 className="feat-title-italic">El poder de</h2>
            <span className="feat-title-caps">LINE UP</span>
            
            <motion.div 
              style={{display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '2rem'}}
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {features.map((feat) => (
                <motion.div key={feat.name} style={{flex: '1 1 calc(50% - 20px)'}} variants={itemVariants}>
                  <div className="feat-card">
                    <div className="feat-thumb">🚀</div>
                    <h5 className="feat-name">{feat.name}</h5>
                    <p className="feat-desc">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
