import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LinerNavbar } from "../components/LinerNavbar";
import { LinerSidebar } from "../components/LinerSidebar";

export const LinerChat = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const chatContainerRef = useRef(null);

    const liner = JSON.parse(localStorage.getItem("linerData"));

    const handleLogout = () => {
        dispatch({ type: "set_auth_liner", payload: false });
        dispatch({ type: "set_liner_data", payload: null });
        localStorage.removeItem("linerToken");
        localStorage.removeItem("linerData");
        navigate("/liner/login");
    };

    const loadMessages = async () => {
        const token = localStorage.getItem("linerToken");

        try {
            const resp = await fetch(`${backendUrl}/api/chats/service/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudieron cargar los mensajes");
            }

            setMessages(data);
        } catch (err) {
            setError(err.message || "Error al cargar el chat");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("linerToken");

        socket.auth = { token };
        socket.connect();

        const handleConnect = () => {
            socket.emit("join_service_chat", {
                service_id: Number(id),
                auth: { token }
            });
        };

        const handleNewMessage = (message) => {
            setMessages((prev) => {
                const alreadyExists = prev.some((msg) => msg.id === message.id);
                if (alreadyExists) return prev;
                return [...prev, message];
            });
        };

        socket.on("connect", handleConnect);
        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("new_message", handleNewMessage);
            socket.disconnect();
        };
    }, [id]);

    useEffect(() => {
        loadMessages();
    }, [id]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    /*
    useEffect(() => {
        const intervalId = setInterval(() => {
            loadMessages();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [id]);
    */

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const token = localStorage.getItem("linerToken");

        socket.emit("send_message", {
            service_id: Number(id),
            contenido: newMessage,
            auth: { token }
        });

        setNewMessage("");
    };

    return (
        <div className="container-fluid px-0">
            <LinerNavbar liner={liner} onLogout={handleLogout} />
            <LinerSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Chat del servicio #{id}
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Comunicación en tiempo real con el cliente.
                            </p>
                        </div>

                        <Link to="/liner/home" className="btn-page" style={{ textDecoration: "none" }}>
                            Volver al panel
                        </Link>
                    </div>

                    {loading && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Cargando mensajes...</h6>
                            </div>
                            <div className="p-4 text-muted">
                                Esperá un momento mientras cargamos la conversación.
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Error</h6>
                            </div>
                            <div className="p-4 text-danger">{error}</div>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Conversación</h6>
                            </div>

                            <div className="p-4">
                                <div
                                    ref={chatContainerRef}
                                    className="border rounded p-3 mb-3"
                                    style={{
                                        height: "350px",
                                        overflowY: "auto",
                                        background: "#f9fafb",
                                        borderColor: "var(--border)"
                                    }}
                                >
                                    {messages.length === 0 ? (
                                        <p className="text-muted mb-0">No hay mensajes todavía.</p>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`mb-2 d-flex ${
                                                    msg.sender_type === "liner"
                                                        ? "justify-content-end"
                                                        : "justify-content-start"
                                                }`}
                                            >
                                                <div
                                                    className={`p-2 rounded ${
                                                        msg.sender_type === "liner"
                                                            ? "bg-warning text-dark"
                                                            : "bg-light"
                                                    }`}
                                                    style={{
                                                        maxWidth: "75%",
                                                        fontSize: ".9rem"
                                                    }}
                                                >
                                                    {msg.contenido}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="d-flex gap-2 align-items-start">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Escribí un mensaje..."
                                    />
                                    <button className="btn-export" onClick={handleSendMessage}>
                                        <i className="bi bi-send"></i>
                                        Enviar
                                    </button>
                                    <button className="btn-page" onClick={loadMessages}>
                                        Actualizar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};