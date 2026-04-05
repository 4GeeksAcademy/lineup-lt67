import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export const SucursalDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [tickets, setTickets] = useState([])
    const [sucursal, setSucursal] = useState([])

    const estadoLabel = {
        "esperando": "En espera",
        "en_atencion": "Llamado",
        "atendido": "Atendido",
        "cancelado": "Cancelado"
    }

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

    return (
        <div className="container mt-4">
            <h2>Sucursal {sucursal.nombre}</h2>
        </div>
    );
};