import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LandingStyles.css";

const AI_RESPONSES = [
    "LineUp reduce el tiempo de espera en un 40% mediante algoritmos predictivos de flujo.",
    "Nuestra IA aprende de tus horas pico para sugerir personal adicional y evitar cuellos de botella.",
    "Puedes gestionar múltiples sucursales con sincronización en milisegundos desde cualquier dispositivo.",
    "La satisfacción del cliente aumenta un 65% al eliminar la incertidumbre de la fila física.",
    "Nuestras métricas avanzadas te permiten ver la rentabilidad por minuto de cada servicio."
];

export const ChatDemo = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "¡Hola! ¿Cómo puede LineUp ayudar a mi negocio?", sender: "ai" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Solo desplazarse si hay más que el mensaje de bienvenida inicial
        if (messages.length > 1 || isTyping) {
            scrollToBottom();
        }
    }, [messages, isTyping]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMsg = { id: Date.now(), text: inputValue, sender: "user" };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        
        // Simular respuesta de IA
        setIsTyping(true);
        setTimeout(() => {
            const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
            const newAiMsg = { id: Date.now() + 1, text: randomResponse, sender: "ai" };
            setMessages(prev => [...prev, newAiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <section id="demo" className="py-5" style={{ background: "var(--bg-dark)" }}>
            <div className="container py-5">
                <div className="text-center mb-5">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="display-5 fw-bold text-white mb-3"
                    >
                        Experimenta el <span className="text-neon-purple">Poder</span> de LineUp
                    </motion.h2>
                    <p className="text-white-50">Interactúa con nuestro asistente inteligente en tiempo real.</p>
                </div>

                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8">
                        {/* Ventana de Chat */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="chat-window"
                        >
                            <div className="chat-header d-flex align-items-center gap-3">
                                <div className="rounded-circle bg-neon-cyan" style={{ width: "12px", height: "12px", boxShadow: "0 0 10px var(--neon-cyan)" }}></div>
                                <span className="fw-bold text-white small text-uppercase" style={{ letterSpacing: "2px" }}>LineUp AI Assistant</span>
                            </div>

                            <div className="chat-messages">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`chat-bubble ${msg.sender === "user" ? "bubble-user" : "bubble-ai"}`}
                                        >
                                            {msg.text}
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="bubble-ai chat-bubble d-flex gap-1"
                                        >
                                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }}>•</motion.span>
                                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>•</motion.span>
                                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}>•</motion.span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="chat-input-area" onSubmit={handleSendMessage}>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="chat-input"
                                        placeholder="Haz una pregunta sobre LineUp..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                    <button className="btn btn-link text-neon-cyan position-absolute end-0 top-50 translate-middle-y me-2" type="submit">
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>

                {/* Grid de Características */}
                <div className="row g-4 pt-5 text-center">
                    <div className="col-md-4 feature-box">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="d-flex flex-column align-items-center"
                        >
                            <div className="feature-icon-wrapper">
                                <i className="fa-solid fa-brain h2 text-neon-cyan feature-icon mb-0"></i>
                            </div>
                            <h5 className="text-white fw-bold mb-3">IA Predictiva</h5>
                            <p className="text-white-50 small">Anticípate a la demanda y ajusta tus recursos automáticamente.</p>
                        </motion.div>
                    </div>

                    <div className="col-md-4 feature-box">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="d-flex flex-column align-items-center"
                        >
                            <div className="feature-icon-wrapper">
                                <i className="fa-solid fa-bolt h2 text-neon-purple feature-icon mb-0"></i>
                            </div>
                            <h5 className="text-white fw-bold mb-3">Ultra Velocidad</h5>
                            <p className="text-white-50 small">Sincronización total en todos tus dispositivos en tiempo real.</p>
                        </motion.div>
                    </div>

                    <div className="col-md-4 feature-box">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="d-flex flex-column align-items-center"
                        >
                            <div className="feature-icon-wrapper">
                                <i className="fa-solid fa-shield-halved h2 text-neon-cyan feature-icon mb-0"></i>
                            </div>
                            <h5 className="text-white fw-bold mb-3">Seguridad Total</h5>
                            <p className="text-white-50 small">Tus datos y los de tus clientes protegidos con encriptación de grado militar.</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
