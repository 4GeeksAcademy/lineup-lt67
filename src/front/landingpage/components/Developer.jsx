import React from "react";
import { motion } from "framer-motion";

const team = [
    {
        name: "Abraham",
        role: "Fullstack / AI Specialist",
        desc: "Cerebro detrás de la integración con Gemini AI, conectando datos y lógica para predicciones precisas.",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJstCbfzKY01Z4hufdLCfKHktNBO2BhXoWRA&s",
    },
    {
        name: "Juan",
        role: "Lead Developer / Arquitecto",
        desc: "Encargado de la estructura central y escalabilidad de LineUp, obsesionado con el código limpio y eficiente.",
        img: "https://i.pinimg.com/736x/a5/37/05/a53705b9a77b24e5b04b99e06b737a60.jpg",
    },
    {
        name: "Humberto",
        role: "Frontend Specialist / UX",
        desc: "Diseñador de la experiencia visual y fluidez de la interfaz, experto en crear interfaces que se sienten vivas.",
        img: "https://i.pinimg.com/736x/a2/bd/a1/a2bda19504c043b128a525472bc9d32f.jpg",
    }
];

export default function Developer() {
  return (
    <section className="dev-sec" id="equipo" style={{position: "relative", overflow: "hidden"}}>
      {/* Decorative background elements para hacerlo más "vivo" */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
        style={{position: "absolute", top: "-200px", left: "-200px", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(26,54,255,0.1) 0%, rgba(0,0,0,0) 70%)", borderRadius: "50%", pointerEvents: "none"}}
      />
      
      <div className="container" style={{maxWidth: "1100px", margin: "0 auto", padding: "0 1rem", position: "relative", zIndex: 1}}>
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
           viewport={{ once: true }}
           style={{textAlign: "center", marginBottom: "5rem"}}
        >
          <span style={{fontFamily: "var(--font-script)", color: "var(--blue)", fontSize: "clamp(3rem, 6vw, 60px)", display: "block", marginBottom: "-15px"}}>conoce al</span>
          <h2 className="dev-title" style={{marginBottom: "0", display: "inline-block", color: "var(--white)"}}>TEAM LINEUP</h2>
        </motion.div>
        
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center'}}>
          {team.map((member, i) => (
             <motion.div 
                key={i}
                className="dev-card"
                style={{
                  flex: '1 1 300px', 
                  margin: '0', 
                  textAlign: "center", 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: '30px',
                  padding: '40px 30px',
                  position: 'relative'
                }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, type: "spring", bounce: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(0,243,255,0.2)' }}
             >
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }} 
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      padding: "8px", 
                      background: "linear-gradient(135deg, var(--blue), #00f3ff)", 
                      borderRadius: "50%",
                      boxShadow: "0 15px 30px rgba(0,243,255,0.2)"
                    }}
                  >
                    <img src={member.img} alt={member.name} style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--dark)'}} />
                  </motion.div>
                </div>
                <h3 style={{fontFamily: "var(--font-caps)", color: "var(--white)", fontSize: "2.2rem", marginTop: '0.5rem', marginBottom: '0'}}>{member.name}</h3>
                <motion.p 
                  initial={{ opacity: 0.8 }} 
                  whileHover={{ opacity: 1, scale: 1.05 }} 
                  style={{color: "#00f3ff", fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1.5rem'}}
                >
                  {member.role}
                </motion.p>
                <p style={{color: "rgba(255,255,255,0.6)", lineHeight: '1.7', fontSize: '0.95rem'}}>
                  {member.desc}
                </p>

                {/* Developer Social Links */}
                <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', zIndex: 2, position: 'relative'}}>
                    {[
                        { icon: "fa-github", url: "#" },
                        { icon: "fa-linkedin-in", url: "#" },
                        { icon: "fa-x-twitter", url: "#" },
                        { icon: "fa-instagram", url: "#" }
                    ].map((social, idx) => (
                        <motion.a 
                            key={idx}
                            href={social.url}
                            whileHover={{ y: -5, color: "#00f3ff", scale: 1.2 }}
                            style={{ 
                                color: "rgba(255,255,255,0.3)", 
                                fontSize: "1.25rem", 
                                transition: "color 0.3s" 
                            }}
                        >
                            <i className={`fa-brands ${social.icon}`}></i>
                        </motion.a>
                    ))}
                </div>
                
                {/* Decorative floating shapes */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 3, delay: i }} 
                  style={{position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', opacity: 0.2, pointerEvents: 'none'}}
                >
                  ✦
                </motion.div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
