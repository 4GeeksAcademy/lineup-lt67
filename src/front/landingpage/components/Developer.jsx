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
  },
];

const socials = [
  { icon: "fa-github",     url: "#" },
  { icon: "fa-linkedin-in",url: "#" },
  { icon: "fa-x-twitter",  url: "#" },
  { icon: "fa-instagram",  url: "#" },
];

export default function Developer() {
  return (
    <section className="dev-sec" id="equipo">

      {/* Decorative orb — rotate needs framer inline */}
      <motion.div
        className="dev-orb"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
      />

      <div className="container dev-container">

        {/* Heading */}
        <motion.div
          className="dev-heading"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="dev-heading-script">conoce al</span>
          <h2 className="dev-title">TEAM LINEUP</h2>
        </motion.div>

        {/* Cards row */}
        <div className="dev-cards-row">
          {team.map((member, i) => (
            <motion.div
              key={i}
              className="dev-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
              /* whileHover needs inline — framer overrides background/borderColor */
              whileHover={{ y: -15, background: "rgba(255,255,255,0.06)", borderColor: "rgba(0,243,255,0.2)" }}
            >
            
              <div className="dev-avatar-wrap">
                <motion.div
                  className="dev-avatar-ring"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={member.img} alt={member.name} className="dev-avatar-img" />
                </motion.div>
              </div>

              {/* Name */}
              <h3 className="dev-name">{member.name}</h3>

              {/* Role — whileHover needs framer inline */}
              <motion.p
                className="dev-role"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
              >
                {member.role}
              </motion.p>

              {/* Description */}
              <p className="dev-desc">{member.desc}</p>

              {/* Socials */}
              <div className="dev-socials">
                {socials.map((s, idx) => (
                  <motion.a
                    key={idx}
                    href={s.url}
                    className="dev-social-link"
                    whileHover={{ y: -5, color: "#00f3ff", scale: 1.2 }}
                  >
                    <i className={`fa-brands ${s.icon}`}></i>
                  </motion.a>
                ))}
              </div>

              {/* Floating star — animate needs framer inline */}
              <motion.div
                className="dev-star"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: i }}
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