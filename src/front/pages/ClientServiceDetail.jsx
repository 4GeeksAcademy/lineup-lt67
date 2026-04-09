import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClientNavbar } from "../components/ClientNavbar";

export const ClientServiceDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();

    const [service, setService] = useState(null);
    const [propuestas, setPropuestas] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadData = async () => {
        const token = localStorage.getItem("tokenClient");

        try {
            setLoading(true);
            setError("");

            const [serviceResp, propuestasResp, chatResp] = await Promise.all([
                fetch(`${backendUrl}/api/clients/me/services/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }),
                fetch(`${backendUrl}/api/clients/me/services/${id}/propuestas`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }),
                fetch(`${backendUrl}/api/chats/service/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
            ]);

            const serviceData = await serviceResp.json();
            const propuestasData = await propuestasResp.json();
            const chatData = await chatResp.json()

            if (!serviceResp.ok) {
                throw new Error(serviceData.msg || "No se pudo cargar el servicio");
            }

            if (!propuestasResp.ok) {
                throw new Error(propuestasData.msg || "No se pudieron cargar las propuestas");
            }



            

            setService(serviceData);
            setPropuestas(propuestasData);
            setMessages(chatData);
        } catch (err) {
            setError(err.message || "Ocurrió un error al cargar el detalle");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleAcceptProposal = async (propuestaId) => {
        const token = localStorage.getItem("tokenClient");

        try {
            const resp = await fetch(`${backendUrl}/api/clients/me/propuestas/${propuestaId}/accept`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo aceptar la propuesta");
            }

            await loadData();
        } catch (err) {
            alert(err.message || "Ocurrió un error al aceptar la propuesta");
        }
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

    const handleFinishService = async () => {
        const token = localStorage.getItem("tokenClient");

        try {
            const resp = await fetch(`${backendUrl}/api/clients/me/services/${id}/finish`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo finalizar el servicio");
            }

            await loadData();
        } catch (err) {
            alert(err.message || "Ocurrió un error al finalizar el servicio");
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const resp = await fetch(`${backendUrl}/api/chats/service/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("tokenClient")}`
                },
                body: JSON.stringify({ contenido: newMessage })
            });

            if (!resp.ok) throw new Error("Error al enviar mensaje");

            setNewMessage("");
            await loadData(); // recarga mensajes
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="container-fluid px-0">
            <ClientNavbar />

            <div className="container py-4">
                {loading && <p>Cargando detalle del servicio...</p>}
                {error && <p className="text-danger">{error}</p>}

                {!loading && !error && service && (
                    <>
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h1 className="card-title mb-3">Servicio #{service.id}</h1>

                                <p className="mb-1">
                                    <strong>Descripción:</strong> {service.descripcion}
                                </p>

                                {service.image_url && (
                                    <div className="mb-3">
                                        <img
                                            src={service.image_url}
                                            alt="Imagen del servicio"
                                            className="img-fluid rounded"
                                            style={{ maxHeight: "320px", objectFit: "cover" }}
                                        />
                                    </div>
                                )}

                                <p className="mb-1">
                                    <strong>Origen:</strong> {service.address_start || "No especificado"}
                                </p>
                                <p className="mb-1">
                                    <strong>Destino:</strong> {service.address_finish || "No especificado"}
                                </p>
                                <p className="mb-1">
                                    <strong>Urgencia:</strong> {service.urgencia}
                                </p>
                                <p className="mb-1">
                                    <strong>Precio propuesto:</strong>{" "}
                                    {service.precio_propuesto ?? "No especificado"}
                                </p>
                                <p className="mb-1">
                                    <strong>Estado:</strong> {service.estado}
                                </p>
                                <p className="mb-0">
                                    <strong>Creado:</strong>{" "}
                                    {new Date(service.created_at).toLocaleString()}
                                </p>

                                <div className="mt-3 d-flex gap-2 flex-wrap">
                                    {service.estado === "en_proceso" && (
                                        <button className="btn btn-success" onClick={handleFinishService}>
                                            Finalizar servicio
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {service.estado === "en_proceso" && (
                            <div className="card mt-4 shadow-sm">
                                <div className="card-body">
                                    <h3>Chat con el liner</h3>

                                    <div className="border rounded p-3 mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                        {messages.length === 0 ? (
                                            <p className="text-muted">No hay mensajes aún</p>
                                        ) : (
                                            messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`mb-2 d-flex ${msg.sender_type === "client" ? "justify-content-end" : "justify-content-start"}`}
                                                >
                                                    <div className={`p-2 rounded ${msg.sender_type === "client" ? "bg-primary text-white" : "bg-light"}`}>
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
                                        <button className="btn btn-primary" onClick={handleSendMessage}>
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="mb-3">Propuestas recibidas</h2>

                            {propuestas.length === 0 ? (
                                <div className="alert alert-secondary">
                                    Todavía no recibiste propuestas para este servicio.
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {propuestas.map((propuesta) => (
                                        <div className="col-md-6 col-lg-4" key={propuesta.id}>
                                            <div className="card h-100 shadow-sm">
                                                <div className="card-body">
                                                    <h5 className="card-title">
                                                        Propuesta #{propuesta.id}
                                                    </h5>

                                                    <p className="mb-1">
                                                        <strong>Liner ID:</strong> {propuesta.liner_id}
                                                    </p>
                                                    <p className="mb-1">
                                                        <strong>Tipo:</strong> {getProposalLabel(propuesta)}
                                                    </p>
                                                    <p className="mb-1">
                                                        <strong>Precio:</strong> {propuesta.precio}
                                                    </p>
                                                    <p className="mb-1">
                                                        <strong>Mensaje:</strong>{" "}
                                                        {propuesta.mensaje || "Sin mensaje"}
                                                    </p>
                                                    <p className="mb-3">
                                                        <strong>Estado:</strong> {propuesta.estado}
                                                    </p>

                                                    {service.estado === "abierto" && propuesta.estado === "pendiente" && (
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => handleAcceptProposal(propuesta.id)}
                                                        >
                                                            Aceptar propuesta
                                                        </button>
                                                    )}

                                                    {propuesta.estado === "aceptada" && (
                                                        <span className="badge text-bg-success">
                                                            Propuesta elegida
                                                        </span>
                                                    )}

                                                    {propuesta.estado === "rechazada" && (
                                                        <span className="badge text-bg-secondary">
                                                            Propuesta rechazada
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};