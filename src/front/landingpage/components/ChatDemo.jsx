import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AI_RESPONSES = [
  "LineUp reduce el tiempo de espera en un 40% mediante algoritmos predictivos de flujo.",
  "Nuestra IA aprende de tus horas pico para sugerir personal adicional y evitar cuellos de botella.",
  "Puedes gestionar múltiples sucursales con sincronización en milisegundos desde cualquier dispositivo."
];

const featureData = [
  { icon: "🧠", title: "IA Predictiva",   text: "Anticípate a la demanda y ajusta tus recursos de forma inteligente con Machine Learning." },
  { icon: "⚡", title: "Ultra Velocidad", text: "Sincronización total en todos tus dispositivos en tiempo real sin latencias." },
  { icon: "🛡️", title: "Seguridad Total", text: "Tus datos resguardados bajo estándares paramétricos de encriptación militar." }
];

export default function ChatDemo() {
  const [messages, setMessages] = useState([
    { id: 1, text: "¡Hola! ¿Cómo puede LineUp ayudar a mi negocio?", sender: "ai" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping]     = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length > 1 || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), text: inputValue, sender: "user" }]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const reply = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: "ai" }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section className="chat-demo-sec" id="demo">
      <div className="container">

        {/* Heading */}
        <motion.div
          className="chat-demo-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
            <h2 className="feat-title-italic">El poder de</h2>
            <span className="feat-title-caps">LINE UP</span>
        </motion.div>

        {/* Two columns */}
        <div className="chat-demo-cols">

          {/* Left — feature cards */}
          <div className="chat-features-col">
            {featureData.map((feat, idx) => (
              <motion.div
                key={idx}
                className="chat-feat-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2, type: "spring", bounce: 0.4 }}
                viewport={{ once: true }}
                /* whileHover needs inline because framer overrides scale/x */
                whileHover={{ scale: 1.02, x: 10, boxShadow: "0 20px 40px rgba(26,54,255,0.06)", borderColor: "rgba(26,54,255,0.2)" }}
              >
                <div className="chat-feat-icon">{feat.icon}</div>
                <div>
                  <h4 className="chat-feat-title">{feat.title}</h4>
                  <p className="chat-feat-text">{feat.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right — chat window */}
          <motion.div
            className="chat-window-col"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Header */}
            <div className="chat-window-header">
              <div className="chat-header-icon-wrap">
                {/* Pulse dot — needs animate so stays inline via framer */}
                <motion.div
                  className="chat-header-dot"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <div className="chat-header-avatar">✨</div>
              </div>
              <div className="chat-header-info">
                <h6 className="chat-header-title">Asistente de Inteligencia</h6>
                <span className="chat-header-status">Sistema Óptimo en Línea</span>
              </div>
            </div>

            {/* Scroll area */}
            <div className="chat-scroll-area">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    /* 
                      These styles MUST stay inline because they depend on msg.sender 
                      and framer-motion needs them for enter animation 
                    */
                    style={{
                      padding: "16px 22px",
                      borderRadius: "24px",
                      marginBottom: "16px",
                      maxWidth: "85%",
                      background: msg.sender === "user"
                        ? "linear-gradient(135deg, var(--blue), #4f46e5)"
                        : "#f1f5f9",
                      color: msg.sender === "user" ? "var(--white)" : "var(--dark)",
                      marginLeft: msg.sender === "user" ? "auto" : "0",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                      boxShadow: msg.sender === "user"
                        ? "0 10px 20px rgba(26,54,255,0.2)"
                        : "0 5px 15px rgba(0,0,0,0.03)",
                      borderBottomRightRadius: msg.sender === "user" ? "4px" : "24px",
                      borderBottomLeftRadius:  msg.sender === "ai"   ? "4px" : "24px",
                    }}
                  >
                    {msg.text}
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    className="chat-typing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Dot animations need framer inline */}
                    <motion.div className="chat-typing-dot" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} />
                    <motion.div className="chat-typing-dot" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} />
                    <motion.div className="chat-typing-dot" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} />
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input-field"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Consulta con nuestra IA..."
              />
              <motion.button
                type="submit"
                className="btn-blue chat-send-btn"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(26,54,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="chat-send-icon">✈</span>
              </motion.button>
            </form>

          </motion.div>
        </div>
      </div>
    </section>
  );
}