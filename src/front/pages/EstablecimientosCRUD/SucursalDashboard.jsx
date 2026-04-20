import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EstablecimientoSidebar } from "../../components/EstablecimientoSidebar";
import { Timer } from "./Timer";
import "../../components/lineup-shared.css";

export const SucursalDashboard = () => {
    const { id }     = useParams();
    const navigate   = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [tickets, setTickets]   = useState([]);
    const [sucursal, setSucursal] = useState(null);
    const [sucursales, setSucursales] = useState([]);

    const establecimiento = JSON.parse(localStorage.getItem("loggedEstablecimiento"));

    useEffect(() => {
        fetch(`${backendUrl}/api/sucursal/${id}/tickets`)
            .then(resp => resp.json())
            .then(data => setTickets(data));

        fetch(`${backendUrl}/api/sucursal/${id}`)
            .then(resp => resp.json())
            .then(data => setSucursal(data));

        if (establecimiento?.id) {
            fetch(`${backendUrl}/api/establecimientos/${establecimiento.id}/sucursales`)
                .then(resp => resp.json())
                .then(data => setSucursales(data));
        }
    }, [id]);

    const enEspera = tickets.filter(t => t.estado === "esperando");
    const llamados  = tickets.filter(t => t.estado === "en_atencion");

    function refetchTickets() {
        fetch(`${backendUrl}/api/sucursal/${id}/tickets`)
            .then(resp => resp.json())
            .then(data => setTickets(data));
    }

    function handleLlamar(ticketId) {
        fetch(`${backendUrl}/api/tickets/${ticketId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: "en_atencion" })
        }).then(() => refetchTickets());
    }

    function handleCancelar(ticketId) {
        fetch(`${backendUrl}/api/tickets/${ticketId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: "cancelado" })
        }).then(() => refetchTickets());
    }

    function handleAtendido(ticketId) {
        fetch(`${backendUrl}/api/tickets/${ticketId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: "atendido" })
        }).then(() => refetchTickets());
    }

    function handleToggleFila() {
        if (sucursal?.fila_activa) {
            if (!window.confirm("¿Deseas desactivar la fila? Se eliminarán todos los tickets activos.")) return;
            Promise.all(tickets.map(t =>
                fetch(`${backendUrl}/api/tickets/${t.id}`, { method: "DELETE" })
            )).then(() => {
                fetch(`${backendUrl}/api/sucursal/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fila_activa: false })
                })
                .then(resp => resp.json())
                .then(data => { setSucursal(data); setTickets([]); });
            });
        } else {
            fetch(`${backendUrl}/api/sucursal/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fila_activa: true })
            })
            .then(resp => resp.json())
            .then(data => setSucursal(data));
        }
    }

    return (
        <div className="container-fluid px-0">

            <EstablecimientoSidebar sucursales={sucursales} />

            <main className="main">
                <div className="page-body">

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <button className="btn-back" onClick={() => navigate(-1)}>
                                <i className="bi bi-chevron-left back-chevron"></i>
                            </button>
                            <div>
                                <p className="sucursal-label">Sucursal</p>
                                <h3 className="fw-bold mb-0">
                                    {sucursal ? sucursal.nombre : "Cargando..."}
                                </h3>
                                {sucursal?.address && (
                                    <p className="sucursal-direccion">{sucursal.address}</p>
                                )}
                            </div>
                        </div>

                        <div className="sucursal-toggle-wrap">
                            <span className="toggle-label">
                                {sucursal?.fila_activa ? "Fila activa" : "Fila inactiva"}
                            </span>
                            <div
                                className={`toggle ${sucursal?.fila_activa ? "on" : "off"}`}
                                onClick={handleToggleFila}
                            >
                                <div className="toggle-thumb" />
                            </div>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#1D9E75" }}></span>
                                    Llamados
                                </div>
                                <div className="stat-value" style={{ color: "#1D9E75" }}>{llamados.length}</div>
                                <span className="stat-badge">
                                    <i className="bi bi-megaphone"></i>
                                    En atención
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    En espera
                                </div>
                                <div className="stat-value">{enEspera.length}</div>
                                <span className="stat-badge">
                                    <i className="bi bi-clock"></i>
                                    Esperando turno
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#8b5cf6" }}></span>
                                    Total tickets
                                </div>
                                <div className="stat-value">{tickets.length}</div>
                                <span className="stat-badge">
                                    <i className="bi bi-ticket-detailed"></i>
                                    Hoy
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Llamados */}
                    <div className="seccion">
                        <p className="seccion-title">Llamados ({llamados.length})</p>
                        <div className="lista">
                            {llamados.length === 0 ? (
                                <div className="empty-row">No hay clientes llamados</div>
                            ) : (
                                llamados.map(t => (
                                    <div key={t.id} className="ticket-row">
                                        <div className="ticket-avatar">#{t.posicion}</div>
                                        <div className="ticket-info">
                                            <p className="ticket-name">Cliente {t.id_cliente}</p>
                                            <p className="ticket-sub">En tiempo de gracia</p>
                                        </div>
                                        <div className="ticket-actions">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleAtendido(t.id)}
                                            >
                                                Atendido
                                            </button>
                                        </div>
                                        <Timer onExpire={() => handleCancelar(t.id)} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* En espera */}
                    <div className="seccion">
                        <p className="seccion-title">En espera ({enEspera.length})</p>
                        <div className="lista">
                            {enEspera.length === 0 ? (
                                <div className="empty-row">No hay clientes en espera</div>
                            ) : (
                                enEspera.map(t => (
                                    <div key={t.id} className="ticket-row">
                                        <div className="ticket-avatar">#{t.posicion}</div>
                                        <div className="ticket-info">
                                            <p className="ticket-name">Cliente {t.id_cliente}</p>
                                            <p className="ticket-sub">Esperando su turno</p>
                                        </div>
                                        <div className="ticket-actions">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleLlamar(t.id)}
                                            >
                                                Llamar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleCancelar(t.id)}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};