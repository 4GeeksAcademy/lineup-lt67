import React, { useEffect, useMemo, useState } from "react";
import { ClientNavbar } from "../components/ClientNavbar";
import { ClientSidebar } from "../components/ClientSidebar";
import "../components/lineup-shared.css"

export const ClientTickets = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showQrId, setShowQrId] = useState(null);
    const loggedClient = JSON.parse(localStorage.getItem("loggedClient"));

    const loadTickets = async () => {
        const token = localStorage.getItem("tokenClient");

        try {
            setLoading(true);
            setError("");

            const resp = await fetch(`${backendUrl}/api/clients/me/tickets`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudieron cargar los tickets");
            }

            setTickets(data);
        } catch (err) {
            setError(err.message || "Ocurrió un error al cargar los tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

    const handleCancelTicket = async (ticketId) => {
        const token = localStorage.getItem("tokenClient");

        try {
            const resp = await fetch(`${backendUrl}/api/clients/me/tickets/${ticketId}/cancel`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo cancelar el ticket");
            }

            setShowQrId(null);
            await loadTickets();
        } catch (err) {
            alert(err.message || "Ocurrió un error al cancelar el ticket");
        }
    };

    const activeTickets = useMemo(
        () =>
            tickets.filter(
                (ticket) => ticket.estado === "esperando" || ticket.estado === "en_atencion"
            ),
        [tickets]
    );

    const historial = useMemo(
        () =>
            tickets.filter(
                (ticket) => ticket.estado !== "esperando" && ticket.estado !== "en_atencion"
            ),
        [tickets]
    );

    const waitingCount = activeTickets.filter((ticket) => ticket.estado === "esperando").length;
    const attendingCount = activeTickets.filter((ticket) => ticket.estado === "en_atencion").length;

    const renderTicketCard = (ticket, isActiveSection = false) => {
        const isWaiting = ticket.estado === "esperando";
        const isInAttention = ticket.estado === "en_atencion";
        const showQr = showQrId === ticket.id;

        return (
            <div className="col-md-6 col-xl-4" key={ticket.id}>
                <div
                    className="stat-card h-100 d-flex flex-column justify-content-between"
                    style={{ padding: "1.1rem 1.1rem" }}
                >
                    <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0 fw-bold">Ticket #{ticket.id}</h6>

                            <span
                                className={
                                    isWaiting || isInAttention ? "badge-online" : "badge-offline"
                                }
                            >
                                {ticket.estado}
                            </span>
                        </div>

                        <p className="mb-2" style={{ fontSize: ".84rem" }}>
                            <strong>Sucursal ID:</strong> {ticket.id_sucursal}
                        </p>

                        <p className="mb-2" style={{ fontSize: ".84rem" }}>
                            <strong>Posición:</strong> {ticket.posicion}
                        </p>

                        <p className="mb-3 text-muted" style={{ fontSize: ".8rem" }}>
                            <strong>Creado:</strong>{" "}
                            {new Date(ticket.created_at).toLocaleString()}
                        </p>

                        {isInAttention && (
                            <p className="text-warning mb-3" style={{ fontSize: ".82rem" }}>
                                Tu turno ya está en atención y no puede cancelarse desde esta vista.
                            </p>
                        )}

                        {showQr && (
                            <div
                                className="p-3 rounded mb-3"
                                style={{
                                    background: "#f9fafb",
                                    border: "1px solid var(--border)"
                                }}
                            >
                                <h6 className="mb-2">QR del ticket</h6>
                                <p className="mb-1">Acá iría el QR.</p>
                                <p className="mb-0 small text-muted">
                                    Datos: ticket_id={ticket.id}, client_id={ticket.id_cliente}, sucursal_id={ticket.id_sucursal}
                                </p>
                            </div>
                        )}
                    </div>

                    {isActiveSection && (
                        <div className="d-flex gap-2 flex-wrap">
                            {isWaiting && (
                                <button
                                    className="btn-details"
                                    onClick={() => handleCancelTicket(ticket.id)}
                                >
                                    Cancelar ticket
                                </button>
                            )}

                            <button
                                className="btn-page"
                                onClick={() =>
                                    setShowQrId((prev) => (prev === ticket.id ? null : ticket.id))
                                }
                            >
                                {showQr ? "Ocultar QR" : "Mostrar QR"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container-fluid px-0">
            <ClientSidebar />

            <main className="main">
                <div className="page-body">
                    {/* Bienvenido */}
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h3 className="fw-bold mb-5" style={{ marginBottom: "2rem" }}>
                                Bienvenido, {loggedClient?.full_name || "Cliente"} 👋
                            </h3>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Mis tickets
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Seguimiento de tus turnos activos e historial de atención.
                            </p>
                        </div>
                    </div>
                        

                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    Tickets activos
                                </div>
                                <div className="stat-value">{activeTickets.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-ticket-detailed"></i>
                                        En seguimiento
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#8b5cf6" }}></span>
                                    Esperando
                                </div>
                                <div className="stat-value">{waitingCount}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-hourglass-split"></i>
                                        En cola
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#22c55e" }}></span>
                                    En atención
                                </div>
                                <div className="stat-value">{attendingCount}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-check2-circle"></i>
                                        Turno actual
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Cargando tickets...</h6>
                            </div>
                            <div className="p-4 text-muted">
                                Esperá un momento mientras obtenemos tus tickets.
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
                        <>
                            <div className="mb-5">
                                <div className="table-card">
                                    <div className="table-card-header">
                                        <h6>Tickets activos</h6>
                                    </div>

                                    <div className="p-3">
                                        {activeTickets.length === 0 ? (
                                            <div className="text-muted p-2">
                                                No tenés ningún ticket activo en este momento.
                                            </div>
                                        ) : (
                                            <div className="row g-3">
                                                {activeTickets.map((ticket) =>
                                                    renderTicketCard(ticket, true)
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="table-card">
                                    <div className="table-card-header">
                                        <h6>Historial</h6>
                                    </div>

                                    <div className="p-3">
                                        {historial.length === 0 ? (
                                            <div className="text-muted p-2">
                                                Todavía no tenés tickets anteriores.
                                            </div>
                                        ) : (
                                            <div className="row g-3">
                                                {historial.map((ticket) =>
                                                    renderTicketCard(ticket, false)
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};