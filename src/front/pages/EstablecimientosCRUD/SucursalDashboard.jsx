import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./SucursalDashboard.css";
import { Timer } from "./Timer";

export const SucursalDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [tickets, setTickets] = useState([])
    const [sucursal, setSucursal] = useState([null])

    useEffect(() => {
        fetch(`${backendUrl}/api/sucursal/${id}/tickets`)
            .then(resp => resp.json())
            .then(data => setTickets(data))
    }, [])

    useEffect(() => {
        fetch(`${backendUrl}/api/sucursal/${id}`)
            .then(resp => resp.json())
            .then(data => setSucursal(data))
    }, [])

    const enEspera = tickets.filter(ticket => ticket.estado === "esperando")
    const llamados = tickets.filter(ticket => ticket.estado === "en_atencion")

    console.log(tickets)

    function handleLlamar(ticketId) {
        fetch(`${backendUrl}/api/tickets/${ticketId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: "en_atencion" })
        })
        .then(resp => resp.json())
        .then(() => {
            fetch(`${backendUrl}/api/sucursal/${id}/tickets`)
                .then(resp => resp.json())
                .then(data => setTickets(data))
        })
    }

    function handleCancelar(ticketId) {
        fetch(`${backendUrl}/api/tickets/${ticketId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: "cancelado" })
        })
        .then(resp => resp.json())
        .then(() => {
            fetch(`${backendUrl}/api/sucursal/${id}/tickets`)
                .then(resp => resp.json())
                .then(data => setTickets(data))
        })
    }

    function handleAtendido(ticketId) {
        fetch(`${backendUrl}/api/tickets/${ticketId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: "atendido" })
        })
        .then(resp => resp.json())
        .then(() => {
            fetch(`${backendUrl}/api/sucursal/${id}/tickets`)
                .then(resp => resp.json())
                .then(data => setTickets(data))
        })
    }

    return (
        <div className="sucursal-page">

            <div className="sucursal-header">

                <button className="btn-back" onClick={() => navigate(-1)}>
                    <i className="bi bi-chevron-left back-chevron"></i>
                    <div className="back-text d-flex flex-direction-column">
                        <span className="back-label">Sucursal</span>
                        <span className="back-name">{sucursal ? sucursal.nombre : ""}</span>
                    </div>
                </button>

                <div className="sucursal-toggle-wrap">
                    <span className="toggle-label">{sucursal?.fila_activa ? "Fila activa" : "Fila inactiva"}</span>
                    <div className={`toggle ${sucursal?.fila_activa ? "on" : "off"}`}>
                        <div className="toggle-thumb" />
                    </div>
                </div>
            </div>

            <div className="seccion">
                <p className="seccion-title">Llamados ({llamados.length})</p>
                <div className="lista">
                    {llamados.length === 0 ? (
                        <div className="empty-row">No hay clientes llamados</div>
                    ) : (
                        llamados.map(t => (
                            <div key={t.id} className="ticket-row">
                                <div className="ticket-avatar">
                                    #{t.posicion}
                                </div>
                                <div className="ticket-info">
                                    <p className="ticket-name">Cliente {t.id_cliente}</p>
                                    <p className="ticket-sub">En tiempo de gracia</p>
                                </div>
                                <div className="ticket-actions">
                                    <button className="btn btn-success btn-sm" onClick={() => handleAtendido(t.id)}>Atendido</button>
                                </div>
                                <Timer onExpire={() => handleCancelar(t.id)} />
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="seccion">
                <p className="seccion-title">En espera ({enEspera.length})</p>
                <div className="lista">
                    {enEspera.length === 0 ? (
                        <div className="empty-row">No hay clientes en espera</div>
                    ) : (
                        enEspera.map(t => (
                            <div key={t.id} className="ticket-row">
                                <div className="ticket-avatar">
                                    #{t.posicion}
                                </div>
                                <div className="ticket-info">
                                    <p className="ticket-name">Cliente {t.id_cliente}</p>
                                    <p className="ticket-sub">Esperando su turno</p>
                                </div>
                                <div className="ticket-actions">
                                    <button className="btn btn-primary" onClick={ () => handleLlamar(t.id) }>Llamar</button>
                                    <button className="btn btn-danger btn-sm" onClick={ () => handleCancelar(t.id) }>Cancelar</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};