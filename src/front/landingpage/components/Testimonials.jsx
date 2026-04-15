import React from "react";
import { motion } from "framer-motion";

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

export default function Testimonials() {
  return (
    <section className="testi-sec" id="testimonios">
      <div className="container" style={{maxWidth: "1200px", margin: "0 auto", padding: "0 1rem"}}>
        <motion.div 
          style={{textAlign: "center", marginBottom: "2rem"}}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="testi-caps">LO QUE DICEN</h2>
          <span className="testi-italic">nuestros usuarios</span>
        </motion.div>
        
        <div className="testi-cards-row">
          {testimonials.map((t, index) => (
            <motion.div 
               className="testi-col" 
               key={index}
               initial={{ opacity: 0, y: 50, scale: 0.95 }}
               whileInView={{ opacity: 1, y: 0, scale: 1 }}
               transition={{ delay: index * 0.15, type: "spring", bounce: 0.4 }}
               viewport={{ once: true }}
               whileHover={{ y: -15 }}
            >
              <motion.img 
                className="testi-avatar" 
                src={t.img} 
                alt={t.name} 
                style={{objectFit: 'cover'}}
                whileHover={{ rotate: 10, scale: 1.15, boxShadow: "0 0 20px rgba(255,255,255,0.7)" }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.div 
                className="testi-card" 
                style={{boxShadow: "0 10px 40px rgba(0,0,0,0.08)", transition: "box-shadow 0.4s", cursor: "pointer"}}
                whileHover={{ boxShadow: "0 25px 50px rgba(26,54,255,0.15)" }}
              >
                <p style={{fontSize: "0.9rem", fontStyle: "italic", color: "#4b5563"}}>"{t.text}"</p>
                <strong className="testi-name" style={{color: "var(--blue)", fontSize: "0.9rem"}}>{t.name}</strong>
                <span className="testi-role" style={{color: "var(--dark)", opacity: 0.7, fontWeight: 700}}>{t.role}</span>
                <div className="testi-stars" style={{marginTop: "8px"}}>
                   {[...Array(5)].map((_, i) => (
                        <motion.span 
                            key={i} 
                            style={{color: i < t.stars ? "#ffb800" : "#e2e8f0", display: "inline-block"}}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ delay: i * 0.1 + index * 0.2, duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
                        >★</motion.span>
                    ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
