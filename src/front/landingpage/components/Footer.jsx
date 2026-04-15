import React from "react";
import { motion } from "framer-motion";
import logoFooter from "../assets/logo-footer.svg"; 

export default function Footer() {
  return (
    <footer className="site-footer" style={{ background: "var(--dark)", padding: "60px 0 30px", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
      {/* Glow Decorativo Premium */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "400px", height: "1px", background: "linear-gradient(90deg, transparent, var(--blue), transparent)", boxShadow: "0 0 30px 2px var(--blue)" }}></div>

      <div className="container" style={{maxWidth: "1200px", margin: "0 auto", padding: "0 1rem"}}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px", marginBottom: "40px" }}>
          
          {/* Columna 1: Brand & Bio */}
          <div>
            <img src={logoFooter} alt="LINE UP" style={{ height: "45px", marginBottom: "25px", opacity: 0.9 }} />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", lineHeight: "1.8", maxWidth: "300px", margin: 0 }}>
              Hecho con amor y pasión por Abraham, Juan y Humberto. Transformando la gestión del tiempo global con Inteligencia Artificial de última generación.
            </p>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
             <h4 style={{ color: "var(--white)", fontFamily: "var(--font-caps)", fontSize: "1.4rem", letterSpacing: "1px", marginBottom: "15px", marginTop: "0" }}>Explorar</h4>
             <motion.a whileHover={{ x: 5, color: "var(--white)" }} href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.95rem", transition: "color 0.3s" }}>Ir a la App</motion.a>
             <motion.a whileHover={{ x: 5, color: "var(--white)" }} href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.95rem", transition: "color 0.3s" }}>Portal Liners</motion.a>
             <motion.a whileHover={{ x: 5, color: "var(--white)" }} href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.95rem", transition: "color 0.3s" }}>Términos de Servicio</motion.a>
             <motion.a whileHover={{ x: 5, color: "var(--white)" }} href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.95rem", transition: "color 0.3s" }}>Políticas de Privacidad</motion.a>
          </div>

          {/* Columna 3: Contacto & Redes Sociales */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
             <h4 style={{ color: "var(--white)", fontFamily: "var(--font-caps)", fontSize: "1.4rem", letterSpacing: "1px", marginBottom: "15px", marginTop: "0" }}>Contacto</h4>
             <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", margin: 0, display: "flex", alignItems: "center" }}>
               <i className="fa-solid fa-envelope" style={{ color: "var(--blue)", marginRight: '12px', fontSize: '1.2rem' }}></i>
               hello@lineup.com
             </p>
             <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", margin: 0, marginBottom: "15px", display: "flex", alignItems: "center" }}>
               <i className="fa-solid fa-location-dot" style={{ color: "var(--blue)", marginRight: '12px', fontSize: '1.2rem' }}></i>
               Venezuela - Argentina - Mexico
             </p>
             
             <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                {[
                  { icon: "fa-x-twitter", label: "Twitter" },
                  { icon: "fa-instagram", label: "Instagram" },
                  { icon: "fa-linkedin-in", label: "LinkedIn" },
                  { icon: "fa-github", label: "GitHub" }
                ].map((social, i) => (
                   <motion.a 
                     key={i}
                     whileHover={{ y: -6, background: "var(--blue)", color: "var(--white)", scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     href="#" 
                     aria-label={social.label} 
                     style={{ 
                       width: "44px", 
                       height: "44px", 
                       borderRadius: "50%", 
                       background: "rgba(255,255,255,0.03)", 
                       border: "1px solid rgba(255,255,255,0.1)",
                       display: "flex", 
                       alignItems: "center", 
                       justifyContent: "center", 
                       color: "rgba(255,255,255,0.6)", 
                       textDecoration: "none",
                       transition: "background 0.3s, color 0.3s, border-color 0.3s"
                     }}
                   >
                     <i className={`fa-brands ${social.icon}`} style={{ fontSize: '1.2rem' }}></i>
                   </motion.a>
                ))}
             </div>
          </div>
          
        </div>

        {/* Separador Final & Copyright */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "35px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
           <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", margin: 0 }}>© {new Date().getFullYear()} LineUp Systems. Todos los derechos reservados.</p>
           
           <div style={{ display: "flex", gap: "12px", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "8px 16px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <motion.span 
                 animate={{ opacity: [0.4, 1, 0.4] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 style={{ width: "8px", height: "8px", background: "#00f3ff", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 10px #00f3ff" }}
              />
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>Sistemas Op. 100%</span>
           </div>
        </div>
      </div>
    </footer>
  );
}
