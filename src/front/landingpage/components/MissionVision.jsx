import React from "react";
import { motion } from "framer-motion";

export default function MissionVision() {
  const cardHover = {
    scale: 1.02,
    y: -10,
    boxShadow: "0 25px 60px rgba(0, 243, 255, 0.15)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(0, 243, 255, 0.2)",
    background: "rgba(255,255,255,0.05)",
    transition: { type: "spring", stiffness: 300 }
  };

  return (
    <section id="mision" style={{ background: "linear-gradient(135deg, var(--blue) 0%, #0d1e66 100%)", minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 0", position: "relative", overflow: "hidden" }}>
      
      {/* Glow Decorativo Premium */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(0,243,255,0.15) 0%, rgba(0,0,0,0) 60%)", pointerEvents: "none" }}></div>

      <div className="container" style={{maxWidth: "1100px", margin: "0 auto", padding: "0 1rem", position: "relative", zIndex: 1, width: "100%"}}>
        <div className="text-center" style={{marginBottom: "4rem", textAlign: "center"}}>
            <motion.h2 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.6, type: "spring" }}
                 viewport={{ once: true }}
                 className="feat-title-caps"
                 style={{fontSize: 'clamp(3rem, 6vw, 70px)', margin: '0', color: 'var(--white)'}}
            >
                NUESTRA <span style={{fontFamily: 'var(--font-script)', color: 'var(--blue)', textShadow: '0 0 20px rgba(255,255,255,0.7)', textTransform: 'none', fontSize: 'clamp(4rem, 8vw, 90px)'}}>Esencia</span>
            </motion.h2>
            <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.2 }}
                 viewport={{ once: true }}
                 style={{ maxWidth: "700px", margin: '20px auto 0', color: 'rgba(255,255,255,0.9)', fontSize: '1.15rem', lineHeight: '1.6' }}
            >
                Más que una plataforma, somos el puente hacia una gestión de servicios sin fricciones, 
                impulsada por la innovación constante y guiada por un propósito claro.
            </motion.p>
        </div>

        <div style={{display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'stretch'}}>
             
             {/* Tarjeta Misión - Modo Luxury Dark */}
             <motion.div 
                 initial={{ opacity: 0, x: -40 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
                 viewport={{ once: true }}
                 whileHover={cardHover}
                 className="feat-card"
                 style={{
                   flex: '1 1 300px', 
                   background: 'rgba(255,255,255,0.06)', 
                   backdropFilter: 'blur(15px)',
                   padding: '40px 30px', 
                   borderRadius: '24px', 
                   border: '1px solid rgba(255,255,255,0.1)', 
                   position: 'relative', 
                   overflow: 'hidden',
                   display: 'flex',
                   flexDirection: 'column',
                   boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                 }}
             >
                 <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    className="feat-thumb" 
                    style={{background: 'var(--white)', width: '65px', height: '65px', fontSize: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--blue)'}}
                 >🚀</motion.div>
                 
                 <div style={{flex: 1}}>
                    <h3 className="feat-name" style={{fontSize: '2rem', marginBottom: '10px', color: 'var(--white)'}}>Nuestra Misión</h3>
                    <p className="feat-desc" style={{fontSize: '1rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)'}}>
                        Empoderar a negocios y clientes mediante una infraestructura digital 
                        robusta que elimine las pérdidas de tiempo innecesarias y maximice 
                        la productividad diaria a través de soluciones de IA
                    </p>
                 </div>

                 <div style={{position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.03, fontSize: '15rem', pointerEvents: 'none', color: '#00f3ff'}}>🚀</div>
             </motion.div>
             
             {/* Tarjeta Visión - Modo Luxury Dark */}
             <motion.div 
                 initial={{ opacity: 0, x: 40 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.4 }}
                 viewport={{ once: true }}
                 whileHover={cardHover}
                 className="feat-card"
                 style={{
                   flex: '1 1 300px', 
                   background: 'rgba(255,255,255,0.06)', 
                   backdropFilter: 'blur(15px)',
                   padding: '40px 30px', 
                   borderRadius: '24px', 
                   border: '1px solid rgba(255,255,255,0.1)', 
                   position: 'relative', 
                   overflow: 'hidden',
                   display: 'flex',
                   flexDirection: 'column',
                   boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                 }}
             >
                 <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="feat-thumb" 
                    style={{background: 'var(--dark)', width: '65px', height: '65px', fontSize: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'white'}}
                 >👁️</motion.div>
                 
                 <div style={{flex: 1}}>
                    <h3 className="feat-name" style={{color: 'var(--white)', fontSize: '2rem', marginBottom: '10px'}}>Nuestra Visión</h3>
                    <p className="feat-desc" style={{fontSize: '1rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)'}}>
                        Ser el ecosistema líder a nivel global en la gestión de turnos y servicios, 
                        estableciendo el estándar de eficiencia y experiencia de usuario en 
                        ciudades inteligentes del futuro.
                    </p>
                 </div>

                 <div style={{position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.03, fontSize: '15rem', pointerEvents: 'none', color: '#fff'}}>👁️</div>
             </motion.div>

        </div>
      </div>
    </section>
  )
}
