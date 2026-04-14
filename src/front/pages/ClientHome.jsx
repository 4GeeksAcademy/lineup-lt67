import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientNavbar } from "../components/ClientNavbar";
import { ClientSidebar } from "../components/ClientSidebar";
import { calculateDistanceInKm } from "../utils/distance";
import "../components/lineup-shared.css"

export const ClientHome = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const loggedClient = JSON.parse(localStorage.getItem("loggedClient"));
    const clientLat = loggedClient?.lat;
    const clientLng = loggedClient?.lng;
    const MAX_DISTANCE_KM = 10;

    const [sucursales, setSucursales] = useState([]);
    const [establecimientos, setEstablecimientos] = useState([]);
    const [myTickets, setMyTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("tokenClient");

                const [sucursalesResp, establecimientosResp, ticketsResp] = await Promise.all([
                    fetch(`${backendUrl}/api/sucursal`),
                    fetch(`${backendUrl}/api/establecimientos`),
                    fetch(`${backendUrl}/api/clients/me/tickets`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ]);

                if (!sucursalesResp.ok) throw new Error("No se pudieron cargar las sucursales");
                if (!establecimientosResp.ok) throw new Error("No se pudieron cargar los establecimientos");
                if (!ticketsResp.ok) throw new Error("No se pudieron cargar los tickets del cliente");

                const sucursalesData = await sucursalesResp.json();
                const establecimientosData = await establecimientosResp.json();
                const ticketsData = await ticketsResp.json();

                setSucursales(sucursalesData);
                setEstablecimientos(establecimientosData);
                setMyTickets(ticketsData);
            } catch (err) {
                setError(err.message || "Ocurrió un error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [backendUrl]);

    const sucursalesConDistancia = useMemo(() => {
        return sucursales.map((sucursal) => {
            const distanceKm = calculateDistanceInKm(
                clientLat,
                clientLng,
                sucursal.lat,
                sucursal.lng
            );

            return {
                ...sucursal,
                distanceKm
            };
        });
    }, [sucursales, clientLat, clientLng]);

    const sucursalesFiltradas = useMemo(() => {
        if (clientLat == null || clientLng == null) {
            return sucursalesConDistancia;
        }

        return sucursalesConDistancia.filter((sucursal) => {
            if (sucursal.distanceKm == null) return false;
            return sucursal.distanceKm <= MAX_DISTANCE_KM;
        });
    }, [sucursalesConDistancia, clientLat, clientLng]);

    const sucursalesAgrupadas = useMemo(() => {
        const resultado = {};

        sucursalesFiltradas.forEach((sucursal) => {
            const establecimiento = establecimientos.find(
                (est) => est.id === sucursal.id_establecimiento
            );

            const tipoNombre = establecimiento?.tipo_nombre || "Sin tipo";
            const establecimientoNombre = establecimiento?.nombre || "Establecimiento sin nombre";

            if (!resultado[tipoNombre]) {
                resultado[tipoNombre] = {};
            }

            if (!resultado[tipoNombre][establecimientoNombre]) {
                resultado[tipoNombre][establecimientoNombre] = [];
            }

            resultado[tipoNombre][establecimientoNombre].push(sucursal);
        });

        Object.keys(resultado).forEach((tipo) => {
            Object.keys(resultado[tipo]).forEach((establecimientoNombre) => {
                resultado[tipo][establecimientoNombre].sort((a, b) => {
                    if (a.distanceKm == null) return 1;
                    if (b.distanceKm == null) return -1;
                    return a.distanceKm - b.distanceKm;
                });
            });
        });

        return resultado;
    }, [sucursalesFiltradas, establecimientos]);

    const hasActiveTicketInSucursal = (sucursalId) => {
        return myTickets.some(
            (ticket) =>
                ticket.id_sucursal === sucursalId &&
                (ticket.estado === "esperando" || ticket.estado === "en_atencion")
        );
    };

    const handleJoinQueue = async (sucursalId) => {
        const token = localStorage.getItem("tokenClient");

        try {
            const resp = await fetch(`${backendUrl}/api/sucursal/${sucursalId}/join`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No fue posible unirse a la fila");
            }

            navigate("/client/tickets");
        } catch (error) {
            alert(error.message);
        }
    };

    const activeTicketsCount = myTickets.filter(
        (ticket) => ticket.estado === "esperando" || ticket.estado === "en_atencion"
    ).length;

    return (
        <div className="container-fluid px-0">
            <ClientNavbar />
            <ClientSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Sucursales disponibles
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Encontrá filas cercanas y unite rápidamente.
                            </p>
                        </div>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    Sucursales visibles
                                </div>
                                <div className="stat-value">{sucursalesFiltradas.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-geo-alt"></i>
                                        Radio de {MAX_DISTANCE_KM} km
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#8b5cf6" }}></span>
                                    Establecimientos
                                </div>
                                <div className="stat-value">{establecimientos.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-shop"></i>
                                        Tipos variados
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#ec4899" }}></span>
                                    Tickets activos
                                </div>
                                <div className="stat-value">{activeTicketsCount}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-ticket-detailed"></i>
                                        En seguimiento
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {clientLat != null && clientLng != null && (
                        <div className="mb-4">
                            <button className="btn-filter" type="button">
                                <i className="bi bi-funnel"></i>
                                Mostrando sucursales dentro de {MAX_DISTANCE_KM} km
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Cargando sucursales...</h6>
                            </div>
                            <div className="p-4 text-muted">Esperá un momento mientras cargamos la información.</div>
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

                    {!loading && !error && Object.keys(sucursalesAgrupadas).length === 0 && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Sin resultados</h6>
                            </div>
                            <div className="p-4 text-muted">
                                No hay sucursales dentro del radio seleccionado.
                            </div>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        Object.entries(sucursalesAgrupadas).map(([tipo, establecimientosDelTipo]) => (
                            <div key={tipo} className="mb-5">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h6 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>
                                        {tipo}
                                    </h6>
                                </div>

                                {Object.entries(establecimientosDelTipo).map(
                                    ([establecimientoNombre, sucursalesDelEstablecimiento]) => (
                                        <div key={establecimientoNombre} className="table-card mb-4">
                                            <div className="table-card-header">
                                                <h6>{establecimientoNombre}</h6>
                                            </div>

                                            <div className="p-3">
                                                <div className="row g-3">
                                                    {sucursalesDelEstablecimiento.map((sucursal) => (
                                                        <div className="col-md-6 col-xl-4" key={sucursal.id}>
                                                            <div
                                                                className="stat-card h-100 d-flex flex-column justify-content-between"
                                                                style={{ padding: "1.1rem 1.1rem" }}
                                                            >
                                                                <div>
                                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                                        <h6 className="mb-0 fw-bold">
                                                                            {sucursal.nombre}
                                                                        </h6>
                                                                        <span
                                                                            className={
                                                                                sucursal.fila_activa
                                                                                    ? "badge-online"
                                                                                    : "badge-offline"
                                                                            }
                                                                        >
                                                                            {sucursal.fila_activa ? "Activa" : "Inactiva"}
                                                                        </span>
                                                                    </div>

                                                                    <p className="text-muted mb-2" style={{ fontSize: ".85rem" }}>
                                                                        {sucursal.address || "Dirección no especificada"}
                                                                    </p>

                                                                    {sucursal.distanceKm != null && (
                                                                        <p className="mb-2" style={{ fontSize: ".84rem" }}>
                                                                            <strong>Distancia:</strong>{" "}
                                                                            {sucursal.distanceKm.toFixed(1)} km
                                                                        </p>
                                                                    )}

                                                                    <p className="mb-1" style={{ fontSize: ".84rem" }}>
                                                                        <strong>Capacidad:</strong>{" "}
                                                                        {sucursal.capacidad ?? "No especificada"}
                                                                    </p>

                                                                    <p className="mb-3" style={{ fontSize: ".84rem" }}>
                                                                        <strong>Tiempo por cliente:</strong>{" "}
                                                                        {sucursal.tiempo_por_cliente} min
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    {!sucursal.fila_activa ? (
                                                                        <button className="btn-details w-100" disabled>
                                                                            Fila inactiva
                                                                        </button>
                                                                    ) : hasActiveTicketInSucursal(sucursal.id) ? (
                                                                        <button className="btn-details w-100" disabled>
                                                                            Ya estás en esta fila
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="btn-details w-100"
                                                                            onClick={() => handleJoinQueue(sucursal.id)}
                                                                        >
                                                                            Unirme a la fila
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                </div>
            </main>
        </div>
    );
};