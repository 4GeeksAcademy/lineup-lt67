import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AI_RESPONSES = [
    "LineUp reduce el tiempo de espera en un 40% mediante algoritmos predictivos de flujo.",
    "Nuestra IA aprende de tus horas pico para sugerir personal adicional y evitar cuellos de botella.",
    "Puedes gestionar múltiples sucursales con sincronización en milisegundos desde cualquier dispositivo."
];

const featureData = [
  { icon: "🧠", title: "IA Predictiva", text: "Anticípate a la demanda y ajusta tus recursos de forma inteligente con Machine Learning." },
  { icon: "⚡", title: "Ultra Velocidad", text: "Sincronización total en todos tus dispositivos en tiempo real sin latencias." },
  { icon: "🛡️", title: "Seguridad Total", text: "Tus datos resguardados bajo estándares paramétricos de encriptación militar." }
];

export default function ChatDemo() {
    const [messages, setMessages] = useState([
        { id: 1, text: "¡Hola! ¿Cómo puede LineUp ayudar a mi negocio tecnológico?", sender: "ai" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messages.length > 1 || isTyping) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        const newUserMsg = { id: Date.now(), text: inputValue, sender: "user" };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);
        setTimeout(() => {
            const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
            const newAiMsg = { id: Date.now() + 1, text: randomResponse, sender: "ai" };
            setMessages(prev => [...prev, newAiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
      <section className="chat-demo-sec" id="demo" style={{ background: "var(--white)", minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 0" }}>
        <div className="container" style={{maxWidth: "1200px", margin: "0 auto", padding: "0 1rem", width: "100%"}}>
           
           <div className="text-center" style={{marginBottom: "3rem", textAlign: "center"}}>
              <motion.h2 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="feat-title-caps"
                 style={{fontSize: 'clamp(3rem, 6vw, 70px)', margin: '0', color: 'var(--dark)'}}
              >
                  EL <span style={{fontFamily: 'var(--font-script)', color: 'var(--blue)', textTransform: 'none', fontSize: 'clamp(4rem, 8vw, 90px)'}}>Poder</span> DE LINEUP
              </motion.h2>
              <p style={{ color: 'var(--dark)', opacity: 0.8, fontSize: '1.1rem', margin: '15px auto 0', maxWidth: '750px', lineHeight: '1.6'}}>
                  Descubre el arsenal de herramientas premium diseñadas meticulosamente para revolucionar la operatividad de tus servicios.
              </p>
           </div>
           
           <div style={{display: 'flex', flexWrap: 'wrap', gap: '50px', alignItems: 'center'}}>
               
               {/* Left Column: Features List */}
               <div style={{flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  {featureData.map((feat, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2, type: "spring", bounce: 0.4 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02, x: 10, boxShadow: "0 20px 40px rgba(26,54,255,0.06)", borderColor: "rgba(26,54,255,0.2)" }}
                        style={{
                          background: 'var(--white)',
                          padding: '24px',
                          borderRadius: '24px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '24px',
                          border: '1px solid rgba(23,36,71,0.08)',
                          cursor: 'pointer',
                          transition: 'border-color 0.4s'
                        }}
                      >
                         <div style={{
                           width: '55px', height: '55px', background: 'var(--blue)', 
                           borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontSize: '1.5rem', flexShrink: 0, boxShadow: '0 10px 20px rgba(26,54,255,0.2)'
                         }}>
                            {feat.icon}
                         </div>
                         <div>
                            <h4 style={{fontFamily: "var(--font-caps)", color: "var(--dark)", fontSize: "1.5rem", margin: '0 0 8px 0', letterSpacing: '0.5px'}}>{feat.title}</h4>
                            <p style={{margin: 0, fontSize: '0.95rem', color: 'var(--dark)', opacity: 0.7, lineHeight: '1.5'}}>{feat.text}</p>
                         </div>
                      </motion.div>
                  ))}
               </div>

               {/* Right Column: High-End Chat Window */}
               <motion.div 
                   style={{
                     flex: '1 1 500px', 
                     background: 'rgba(255,255,255,0.9)', 
                     backdropFilter: 'blur(30px)',
                     borderRadius: '30px', 
                     padding: '24px', 
                     boxShadow: '0 30px 60px rgba(26,54,255,0.08), 0 0 0 1px rgba(255,255,255,1) inset', 
                     border: '1px solid rgba(26,54,255,0.08)'
                   }}
                   initial={{ opacity: 0, scale: 0.95, y: 30 }}
                   whileInView={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ delay: 0.3, type: "spring", bounce: 0.3, duration: 0.8 }}
                   viewport={{ once: true }}
               >
                   {/* Chat Header */}
                   <div style={{background: 'linear-gradient(90deg, var(--dark), #0f172a)', color: 'var(--white)', padding: '18px 24px', borderRadius: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}}>
                       <div style={{position: 'relative'}}>
                           <motion.div 
                              animate={{ scale: [1, 1.2, 1] }} 
                              transition={{ repeat: Infinity, duration: 2 }}
                              style={{position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', background: '#00f3ff', borderRadius: '50%', boxShadow: '0 0 10px #00f3ff', zIndex: 2}}
                           />
                           <div style={{width: '45px', height: '45px', background: 'var(--blue)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'}}>✨</div>
                       </div>

                       <div style={{flex: 1}}>
                         <h6 style={{margin: 0, fontFamily: 'var(--font-caps)', letterSpacing: '2px', color: 'var(--white)', fontSize: '1.2rem', lineHeight: '1.2'}}>Asistente de Inteligencia</h6>
                         <span style={{fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", fontWeight: 'bold'}}>Sistema Óptimo en Línea</span>
                       </div>
                   </div>
                   
                   {/* Chat Scroll Area */}
                   <div style={{height: '350px', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px'}} className="custom-scroll">
                      <AnimatePresence initial={false}>
                          {messages.map((msg) => (
                              <motion.div
                                  key={msg.id}
                                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  style={{
                                      padding: '16px 22px',
                                      borderRadius: '24px',
                                      marginBottom: '16px',
                                      maxWidth: '85%',
                                      background: msg.sender === "user" ? "linear-gradient(135deg, var(--blue), #4f46e5)" : "#f1f5f9",
                                      color: msg.sender === "user" ? "var(--white)" : "var(--dark)",
                                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                      marginLeft: msg.sender === "user" ? "auto" : "0",
                                      fontSize: '1rem',
                                      lineHeight: '1.6',
                                      boxShadow: msg.sender === "user" ? "0 10px 20px rgba(26,54,255,0.2)" : "0 5px 15px rgba(0,0,0,0.03)",
                                      borderBottomRightRadius: msg.sender === "user" ? "4px" : "24px",
                                      borderBottomLeftRadius: msg.sender === "ai" ? "4px" : "24px",
                                  }}
                              >
                                  {msg.text}
                              </motion.div>
                          ))}
                          {isTyping && (
                              <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  style={{
                                      background: "#f1f5f9",
                                      padding: '16px 22px',
                                      borderRadius: '24px',
                                      borderBottomLeftRadius: '4px',
                                      maxWidth: '80%',
                                      color: "var(--dark)",
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      width: 'fit-content',
                                      boxShadow: "0 5px 15px rgba(0,0,0,0.03)"
                                  }}
                              >
                                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{width: '6px', height: '6px', background: 'var(--blue)', borderRadius: '50%'}} />
                                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} style={{width: '6px', height: '6px', background: 'var(--blue)', borderRadius: '50%'}} />
                                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} style={{width: '6px', height: '6px', background: 'var(--blue)', borderRadius: '50%'}} />
                              </motion.div>
                          )}
                      </AnimatePresence>
                      <div ref={messagesEndRef} />
                   </div>
                   
                   {/* Input Area */}
                   <form onSubmit={handleSendMessage} style={{display: 'flex', gap: '12px'}}>
                      <input 
                          type="text" 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Consulta con nuestra IA..."
                          style={{
                              flex: 1, 
                              padding: '16px 24px', 
                              border: '2px solid rgba(0,0,0,0.05)', 
                              borderRadius: '100px', 
                              outline: 'none', 
                              background: '#f8fafc', 
                              fontFamily: 'inherit', 
                              fontSize: '1rem',
                              transition: 'all 0.3s',
                              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                          }}
                          onFocus={(e) => {
                              e.target.style.borderColor = 'rgba(26,54,255,0.3)';
                              e.target.style.background = '#ffffff';
                              e.target.style.boxShadow = '0 0 0 4px rgba(26,54,255,0.1)';
                          }}
                          onBlur={(e) => {
                              e.target.style.borderColor = 'rgba(0,0,0,0.05)';
                              e.target.style.background = '#f8fafc';
                              e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)';
                          }}
                      />
                      <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(26,54,255,0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        type="submit" 
                        className="btn-blue" 
                        style={{padding: '0 28px', borderRadius: '100px', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                      >
                          <span style={{fontSize: "1.4rem", transform: "rotate(45deg)", display: "inline-block", marginTop: "-4px"}}>✈</span>
                      </motion.button>
                   </form>
               </motion.div>
               
           </div>
        </div>
      </section>
    )
}
