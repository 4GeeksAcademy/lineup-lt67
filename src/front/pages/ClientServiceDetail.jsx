import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import { ClientNavbar } from "../components/ClientNavbar";
import { ClientSidebar } from "../components/ClientSidebar";
import "../components/lineup-shared.css"

export const ClientServiceDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();

    const [service, setService] = useState(null);
    const [propuestas, setPropuestas] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const chatContainerRef = useRef(null);

    const loadServiceData = async () => {
        const token = localStorage.getItem("tokenClient");

        try {
            setLoading(true);
            setError("");

            const [serviceResp, propuestasResp] = await Promise.all([
                fetch(`${backendUrl}/api/clients/me/services/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),
                fetch(`${backendUrl}/api/clients/me/services/${id}/propuestas`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            const serviceData = await serviceResp.json();
            const propuestasData = await propuestasResp.json();

            if (!serviceResp.ok) {
                throw new Error(serviceData.msg || "No se pudo cargar el servicio");
            }

            if (!propuestasResp.ok) {
                throw new Error(propuestasData.msg || "No se pudieron cargar las propuestas");
            }

            setService(serviceData);
            setPropuestas(propuestasData);
        } catch (err) {
            setError(err.message || "Ocurrió un error al cargar el detalle");
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async () => {
        const token = localStorage.getItem("tokenClient");

        try {
            const chatResp = await fetch(`${backendUrl}/api/chats/service/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const chatData = await chatResp.json();

            if (!chatResp.ok) {
                throw new Error(chatData.msg || "No se pudieron cargar los mensajes");
            }

            setMessages(chatData);
        } catch (err) {
            console.error("Error cargando mensajes:", err);
        }
    };

    useEffect(() => {
        loadServiceData();
        loadMessages();
    }, [id]);

    useEffect(() => {
        if (!service || service.estado !== "en_proceso") return;

        const token = localStorage.getItem("tokenClient");

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
    }, [service?.estado, id]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    /*
    useEffect(() => {
        if (!service || service.estado !== "en_proceso") return;

        const intervalId = setInterval(() => {
            loadMessages();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [service?.estado, id]);
    */

    const handleAcceptProposal = async (propuestaId) => {
        const token = localStorage.getItem("tokenClient");

        try {
            const resp = await fetch(`${backendUrl}/api/clients/me/propuestas/${propuestaId}/accept`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo aceptar la propuesta");
            }

            await loadServiceData();
            await loadMessages();
        } catch (err) {
            alert(err.message || "Ocurrió un error al aceptar la propuesta");
        }
    };

    const handleFinishService = async () => {
        const token = localStorage.getItem("tokenClient");

        try {
            const resp = await fetch(`${backendUrl}/api/clients/me/services/${id}/finish`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo finalizar el servicio");
            }

            await loadServiceData();
        } catch (err) {
            alert(err.message || "Ocurrió un error al finalizar el servicio");
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const token = localStorage.getItem("tokenClient");

        socket.emit("send_message", {
            service_id: Number(id),
            contenido: newMessage,
            auth: { token }
        });

        setNewMessage("");
    };

    const getProposalLabel = (propuesta) => {
        if (!service) return "";

        if (service.precio_propuesto == null) {
            return "Propuesta recibida";
        }

        if (Number(propuesta.precio) === Number(service.precio_propuesto)) {
            return "Acepta tu precio";
        }

        return "Contraoferta";
    };

    const acceptedProposal = propuestas.find((propuesta) => propuesta.estado === "aceptada");

    return (
        <div className="container-fluid px-0">
            <ClientNavbar />
            <ClientSidebar />

            <main className="main">
                <div className="page-body">
                    {loading && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Cargando servicio...</h6>
                            </div>
                            <div className="p-4 text-muted">
                                Esperá un momento mientras cargamos el detalle del servicio.
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

                    {!loading && !error && service && (
                        <>
                            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                                <div>
                                    <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                        Servicio #{service.id}
                                    </h5>
                                    <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                        Seguimiento completo del servicio, propuestas y chat.
                                    </p>
                                </div>

                                <div>
                                    <span
                                        className={
                                            service.estado === "abierto"
                                                ? "badge-online"
                                                : service.estado === "en_proceso"
                                                ? "badge-online"
                                                : "badge-offline"
                                        }
                                    >
                                        {service.estado === "abierto"
                                            ? "Abierto"
                                            : service.estado === "en_proceso"
                                            ? "En curso"
                                            : service.estado}
                                    </span>
                                </div>
                            </div>

                            <div className="row g-4 mb-4">
                                <div className="col-lg-8">
                                    <div className="table-card h-100">
                                        <div className="table-card-header">
                                            <h6>Detalle del servicio</h6>
                                        </div>

                                        <div className="p-4">
                                            {service.image_url && (
                                                <div className="mb-4">
                                                    <img
                                                        src={service.image_url}
                                                        alt="Imagen del servicio"
                                                        className="img-fluid rounded"
                                                        style={{
                                                            width: "100%",
                                                            maxHeight: "320px",
                                                            objectFit: "cover",
                                                            border: "1px solid var(--border)"
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <p className="mb-2">
                                                <strong>Descripción:</strong> {service.descripcion}
                                            </p>
                                            <p className="mb-2 text-muted">
                                                <strong>Origen:</strong> {service.address_start || "No especificado"}
                                            </p>
                                            <p className="mb-2 text-muted">
                                                <strong>Destino:</strong> {service.address_finish || "No especificado"}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Urgencia:</strong> {service.urgencia}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Precio propuesto:</strong>{" "}
                                                {service.precio_propuesto ?? "No especificado"}
                                            </p>

                                            {service.tiempo_estimado && (
                                                <p className="mb-2 text-primary">
                                                    <strong>⏳ Tiempo estimado IA:</strong> {service.tiempo_estimado}
                                                </p>
                                            )}

                                            {service.precio_recomendado && (
                                                <p className="mb-2 text-success">
                                                    <strong>💰 Precio recomendado IA:</strong> ${service.precio_recomendado}
                                                </p>
                                            )}

                                            <p className="mb-0 text-muted" style={{ fontSize: ".85rem" }}>
                                                <strong>Creado:</strong>{" "}
                                                {new Date(service.created_at).toLocaleString()}
                                            </p>

                                            <div className="mt-4 d-flex gap-2 flex-wrap">
                                                {service.estado === "en_proceso" && (
                                                    <button className="btn-export" onClick={handleFinishService}>
                                                        <i className="bi bi-check-circle"></i>
                                                        Finalizar servicio
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4">
                                    <div className="table-card h-100">
                                        <div className="table-card-header">
                                            <h6>Liner asignado</h6>
                                        </div>

                                        <div className="p-4">
                                            {!acceptedProposal ? (
                                                <div className="text-muted">
                                                    Todavía no aceptaste ninguna propuesta.
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="d-flex align-items-center gap-3 mb-3">
                                                        <div
                                                            className="user-avatar"
                                                            style={{ width: "42px", height: "42px" }}
                                                        >
                                                            L
                                                            <div className="dot"></div>
                                                        </div>

                                                        <div>
                                                            <div className="user-name">
                                                                Liner #{acceptedProposal.liner_id}
                                                            </div>
                                                            <div className="user-role">Propuesta aceptada</div>
                                                        </div>
                                                    </div>

                                                    <p className="mb-2">
                                                        <strong>Precio acordado:</strong> ${acceptedProposal.precio}
                                                    </p>
                                                    <p className="mb-0">
                                                        <strong>Mensaje:</strong>{" "}
                                                        {acceptedProposal.mensaje || "Sin mensaje"}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {service.estado === "en_proceso" && (
                                <div className="table-card mb-4">
                                    <div className="table-card-header">
                                        <h6>Chat con el liner</h6>
                                    </div>

                                    <div className="p-4">
                                        <div
                                            ref={chatContainerRef}
                                            className="border rounded p-3 mb-3"
                                            style={{
                                                height: "320px",
                                                overflowY: "auto",
                                                background: "#f9fafb",
                                                borderColor: "var(--border)"
                                            }}
                                        >
                                            {messages.length === 0 ? (
                                                <p className="text-muted mb-0">No hay mensajes aún.</p>
                                            ) : (
                                                messages.map((msg) => (
                                                    <div
                                                        key={msg.id}
                                                        className={`mb-2 d-flex ${
                                                            msg.sender_type === "client"
                                                                ? "justify-content-end"
                                                                : "justify-content-start"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`p-2 rounded ${
                                                                msg.sender_type === "client"
                                                                    ? "bg-primary text-white"
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

                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Propuestas recibidas</h6>
                                </div>

                                <div className="p-3">
                                    {propuestas.length === 0 ? (
                                        <div className="text-muted p-2">
                                            Todavía no recibiste propuestas para este servicio.
                                        </div>
                                    ) : (
                                        <div className="row g-3">
                                            {propuestas.map((propuesta) => (
                                                <div className="col-md-6 col-xl-4" key={propuesta.id}>
                                                    <div
                                                        className="stat-card h-100 d-flex flex-column justify-content-between"
                                                        style={{ padding: "1.1rem 1.1rem" }}
                                                    >
                                                        <div>
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <h6 className="mb-0 fw-bold">
                                                                    Propuesta #{propuesta.id}
                                                                </h6>

                                                                {propuesta.estado === "aceptada" ? (
                                                                    <span className="badge-online">Aceptada</span>
                                                                ) : propuesta.estado === "rechazada" ? (
                                                                    <span className="badge-offline">Rechazada</span>
                                                                ) : (
                                                                    <span className="btn-filter" style={{ cursor: "default" }}>
                                                                        Pendiente
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="mb-2" style={{ fontSize: ".84rem" }}>
                                                                <strong>Liner ID:</strong> {propuesta.liner_id}
                                                            </p>

                                                            <p className="mb-2" style={{ fontSize: ".84rem" }}>
                                                                <strong>Tipo:</strong> {getProposalLabel(propuesta)}
                                                            </p>

                                                            <p className="mb-2" style={{ fontSize: ".84rem" }}>
                                                                <strong>Precio:</strong> ${propuesta.precio}
                                                            </p>

                                                            <p className="mb-3 text-muted" style={{ fontSize: ".84rem" }}>
                                                                <strong>Mensaje:</strong>{" "}
                                                                {propuesta.mensaje || "Sin mensaje"}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            {service.estado === "abierto" && propuesta.estado === "pendiente" && (
                                                                <button
                                                                    className="btn-details w-100"
                                                                    onClick={() => handleAcceptProposal(propuesta.id)}
                                                                >
                                                                    Aceptar propuesta
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};