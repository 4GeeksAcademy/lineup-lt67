import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useParams, Link } from "react-router-dom";

export const LinerChat = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams(); // service id

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const chatContainerRef = useRef(null);

    const loadMessages = async () => {
        const token = localStorage.getItem("linerToken");

        try {
            const resp = await fetch(`${backendUrl}/api/chats/service/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
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
            setMessages((prev) => [...prev, message]);
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

    /* useEffect(() => {
        const intervalId = setInterval(() => {
            loadMessages();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [id]); */

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
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Chat del servicio #{id}</h2>
                <Link to="/liner/home" className="btn btn-outline-secondary">
                    Volver
                </Link>
            </div>

            {loading && <p>Cargando mensajes...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div
                            ref={chatContainerRef}
                            className="border rounded p-3 mb-3"
                            style={{ height: "350px", overflowY: "auto" }}
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
                                            style={{ maxWidth: "75%" }}
                                        >
                                            {msg.contenido}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribí un mensaje..."
                            />
                            <button
                                className="btn btn-warning"
                                onClick={handleSendMessage}
                            >
                                Enviar
                            </button>
                        </div>

                        <div className="mt-3">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={loadMessages}
                            >
                                Actualizar mensajes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};