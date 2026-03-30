import React, { useEffect, useState } from "react";

export const ClientTickets = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showQr, setShowQr] = useState(false);

    const loggedClient = JSON.parse(localStorage.getItem("loggedClient"));

    const loadTickets = async () => {
        const token = localStorage.getItem("tokenClient");

        try {
            setLoading(true);
            setError("");

            const resp = await fetch(`${backendUrl}/api/clients/me/tickets`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
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
            const resp = await fetch(`${backendUrl}/api/tickets/${ticketId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ estado: "cancelado" })
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo cancelar el ticket");
            }

            setShowQr(false);
            await loadTickets();
        } catch (err) {
            alert(err.message || "Ocurrió un error al cancelar el ticket");
        }
    };

    const ticketActual = tickets.find(
        (ticket) => ticket.estado === "esperando" || ticket.estado === "en_atencion"
    );

    const historial = tickets.filter(
        (ticket) => ticket.estado !== "esperando" && ticket.estado !== "en_atencion"
    );

    return (
        <div className="container-fluid px-0">
            <nav className="navbar bg-light border-bottom px-4">
                <span className="navbar-brand mb-0 h1">LineUp</span>

                <div className="d-flex align-items-center gap-3">
                    <span className="fw-semibold">
                        {loggedClient?.full_name || "Cliente"}
                    </span>
                </div>
            </nav>

            <div className="container py-4">
                <h1 className="mb-4">Mis tickets</h1>

                {loading && <p>Cargando tickets...</p>}
                {error && <p className="text-danger">{error}</p>}

                {!loading && !error && (
                    <>
                        <div className="mb-5">
                            <h2 className="mb-3">Ticket actual</h2>

                            {!ticketActual ? (
                                <div className="alert alert-secondary">
                                    No tenés ningún ticket activo en este momento.
                                </div>
                            ) : (
                                <div className="card shadow-sm border-primary">
                                    <div className="card-body">
                                        <h5 className="card-title">Ticket #{ticketActual.id}</h5>
                                        <p className="card-text mb-1">
                                            <strong>Sucursal ID:</strong> {ticketActual.id_sucursal}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Estado:</strong> {ticketActual.estado}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Posición:</strong> {ticketActual.posicion}
                                        </p>
                                        <p className="card-text mb-3">
                                            <strong>Creado:</strong>{" "}
                                            {new Date(ticketActual.created_at).toLocaleString()}
                                        </p>

                                        <div className="d-flex gap-2 flex-wrap">
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleCancelTicket(ticketActual.id)}
                                            >
                                                Cancelar ticket
                                            </button>

                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => setShowQr(!showQr)}
                                            >
                                                {showQr ? "Ocultar QR" : "Mostrar QR"}
                                            </button>
                                        </div>

                                        {showQr && (
                                            <div className="mt-4 p-3 border rounded bg-light">
                                                <h6 className="mb-2">QR del ticket</h6>
                                                <p className="mb-1">
                                                    Aca iria el QR.
                                                </p>
                                                <p className="mb-0 small text-muted">
                                                    Datos del ticket: ticket_id={ticketActual.id}, client_id={ticketActual.id_cliente}, sucursal_id={ticketActual.id_sucursal}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="mb-3">Historial</h2>

                            {historial.length === 0 ? (
                                <div className="alert alert-light border">
                                    Todavía no tenés tickets anteriores.
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {historial.map((ticket) => (
                                        <div className="col-md-6 col-lg-4" key={ticket.id}>
                                            <div className="card h-100 shadow-sm">
                                                <div className="card-body">
                                                    <h5 className="card-title">Ticket #{ticket.id}</h5>
                                                    <p className="card-text mb-1">
                                                        <strong>Sucursal ID:</strong> {ticket.id_sucursal}
                                                    </p>
                                                    <p className="card-text mb-1">
                                                        <strong>Estado:</strong> {ticket.estado}
                                                    </p>
                                                    <p className="card-text mb-1">
                                                        <strong>Posición:</strong> {ticket.posicion}
                                                    </p>
                                                    <p className="card-text mb-0">
                                                        <strong>Creado:</strong>{" "}
                                                        {new Date(ticket.created_at).toLocaleString()}
                                                    </p>
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