import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientSidebar } from "../components/ClientSidebar";
import { calculateDistanceInKm } from "../utils/distance";
import "../components/lineup-shared.css"

export const ClientHome = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const loggedClient = JSON.parse(localStorage.getItem("loggedClient"));
    const clientLat = loggedClient?.lat;
    const clientLng = loggedClient?.lng;
    const MAX_DISTANCE_KM = 10;

    const [sucursales, setSucursales]             = useState([]);
    const [establecimientos, setEstablecimientos] = useState([]);
    const [myTickets, setMyTickets]               = useState([]);
    const [loading, setLoading]                   = useState(true);
    const [error, setError]                       = useState("");
    const [tipos, setTipos]                       = useState([]);
    const [tipoSeleccionado, setTipoSeleccionado] = useState("todos");

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");
                const token = localStorage.getItem("tokenClient");

                const [sucursalesResp, establecimientosResp, ticketsResp, tiposResp] = await Promise.all([
                    fetch(`${backendUrl}/api/sucursal`),
                    fetch(`${backendUrl}/api/establecimientos`),
                    fetch(`${backendUrl}/api/clients/me/tickets`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${backendUrl}/api/tipos`)
                ]);

                if (!sucursalesResp.ok)       throw new Error("No se pudieron cargar las sucursales");
                if (!establecimientosResp.ok) throw new Error("No se pudieron cargar los establecimientos");
                if (!ticketsResp.ok)          throw new Error("No se pudieron cargar los tickets del cliente");

                const sucursalesData       = await sucursalesResp.json();
                const establecimientosData = await establecimientosResp.json();
                const ticketsData          = await ticketsResp.json();
                const tiposData            = tiposResp.ok ? await tiposResp.json() : [];

                setSucursales(sucursalesData);
                setEstablecimientos(establecimientosData);
                setMyTickets(ticketsData);
                setTipos(tiposData);
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
            const distanceKm = calculateDistanceInKm(clientLat, clientLng, sucursal.lat, sucursal.lng);
            return { ...sucursal, distanceKm };
        });
    }, [sucursales, clientLat, clientLng]);

    const sucursalesFiltradas = useMemo(() => {
        if (clientLat == null || clientLng == null) return sucursalesConDistancia;
        return sucursalesConDistancia.filter(
            (s) => s.distanceKm != null && s.distanceKm <= MAX_DISTANCE_KM
        );
    }, [sucursalesConDistancia, clientLat, clientLng]);

    const sucursalesAgrupadas = useMemo(() => {
        const resultado = {};
        sucursalesFiltradas.forEach((sucursal) => {
            const establecimiento      = establecimientos.find((est) => est.id === sucursal.id_establecimiento);
            const tipoNombre           = establecimiento?.tipo_nombre || "Sin tipo";
            const establecimientoNombre = establecimiento?.nombre    || "Establecimiento sin nombre";

            if (!resultado[tipoNombre]) resultado[tipoNombre] = {};
            if (!resultado[tipoNombre][establecimientoNombre]) resultado[tipoNombre][establecimientoNombre] = [];
            resultado[tipoNombre][establecimientoNombre].push(sucursal);
        });

        Object.keys(resultado).forEach((tipo) => {
            Object.keys(resultado[tipo]).forEach((estNombre) => {
                resultado[tipo][estNombre].sort((a, b) => {
                    if (a.distanceKm == null) return 1;
                    if (b.distanceKm == null) return -1;
                    return a.distanceKm - b.distanceKm;
                });
            });
        });
        return resultado;
    }, [sucursalesFiltradas, establecimientos]);

    const sucursalesFiltradasPorTipo = useMemo(() => {
        if (tipoSeleccionado === "todos") return sucursalesAgrupadas;
        const resultado = {};
        Object.entries(sucursalesAgrupadas).forEach(([tipo, ests]) => {
            if (tipo === tipoSeleccionado) resultado[tipo] = ests;
        });
        return resultado;
    }, [sucursalesAgrupadas, tipoSeleccionado]);

    const hasActiveTicketInSucursal = (sucursalId) =>
        myTickets.some(
            (t) => t.id_sucursal === sucursalId && (t.estado === "esperando" || t.estado === "en_atencion")
        );

    const handleJoinQueue = async (sucursalId) => {
        const token = localStorage.getItem("tokenClient");
        try {
            const resp = await fetch(`${backendUrl}/api/sucursal/${sucursalId}/join`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.msg || "No fue posible unirse a la fila");
            navigate("/client/tickets");
        } catch (error) {
            alert(error.message);
        }
    };

    const activeTicketsCount = myTickets.filter(
        (t) => t.estado === "esperando" || t.estado === "en_atencion"
    ).length;

    return (
        <div className="container-fluid px-0">
            <ClientSidebar />

            <main className="main">
                <div className="page-body">

                    {/* Fila principal */}
                    <div className="row g-3 mb-4 align-items-stretch">
                        
                        <div className="col-lg-4">
                            
                            <h3 className="fw-bold mb-1">
                                Bienvenido, {loggedClient?.full_name || "Cliente"} 👋
                            </h3>
                            <p className="text-muted mb-3" style={{ fontSize: ".9rem" }}>
                                Encontrá filas cercanas y unite rápidamente.
                            </p>

                            <div className="d-flex justify-content-between gap-2">
                                
                                <div className="stat-card flex-grow-1">
                                    <div className="stat-label">
                                        <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                        Sucursales
                                    </div>
                                    <div className="stat-value">{sucursalesFiltradas.length}</div>
                                    <span className="stat-badge">
                                        <i className="bi bi-geo-alt"></i>
                                        Radio de {MAX_DISTANCE_KM} km
                                    </span>
                                </div>

                                <div className="stat-card flex-grow-1">
                                    <div className="stat-label">
                                        <span className="stat-dot" style={{ background: "#8b5cf6" }}></span>
                                        Establecimientos
                                    </div>
                                    <div className="stat-value">{establecimientos.length}</div>
                                    <span className="stat-badge">
                                        <i className="bi bi-shop"></i>
                                        Tipos variados
                                    </span>
                                </div>

                                <div className="stat-card flex-grow-1">
                                    <div className="stat-label">
                                        <span className="stat-dot" style={{ background: "#ec4899" }}></span>
                                        Tickets activos
                                    </div>
                                    <div className="stat-value">{activeTicketsCount}</div>
                                    <span className="stat-badge">
                                        <i className="bi bi-ticket-detailed"></i>
                                        En seguimiento
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div className="col-lg-8">
                            <div className="promo-banner">
                                <img
                                    src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2670&auto=format&fit=crop"
                                    alt="banner"
                                    className="promo-banner-img"
                                />
                                <div className="promo-banner-overlay">
                                    <h4 className="promo-banner-title">¿Tienes un establecimiento?</h4>
                                    <p className="promo-banner-text">Regístralo en LineUp y aumenta tu ticket promedio conectando con más clientes.</p>
                                    <a href="mailto:contacto@lineup.app" className="promo-banner-btn">Quiero registrarme</a>
                                </div>
                            </div>
                        </div>

                    </div>

                    <hr className="my-5" />

                    {/* Cerca de mí + pills */}
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                        <h5 className="fw-bold mb-0">Cerca de mí</h5>
                        <div className="d-flex gap-2 flex-wrap">
                            <button
                                className={`pill-filter ${tipoSeleccionado === "todos" ? "active" : ""}`}
                                onClick={() => setTipoSeleccionado("todos")}
                            >
                                Todos
                            </button>
                            {tipos.map((tipo) => (
                                <button
                                    key={tipo.id}
                                    className={`pill-filter ${tipoSeleccionado === tipo.nombre ? "active" : ""}`}
                                    onClick={() => setTipoSeleccionado(tipo.nombre)}
                                >
                                    {tipo.nombre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="table-card">
                            <div className="table-card-header"><h6>Cargando sucursales...</h6></div>
                            <div className="p-4 text-muted">Esperá un momento mientras cargamos la información.</div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="table-card">
                            <div className="table-card-header"><h6>Error</h6></div>
                            <div className="p-4 text-danger">{error}</div>
                        </div>
                    )}

                    {/* Sin resultados */}
                    {!loading && !error && Object.keys(sucursalesFiltradasPorTipo).length === 0 && (
                        <div className="table-card">
                            <div className="table-card-header"><h6>Sin resultados</h6></div>
                            <div className="p-4 text-muted">No hay sucursales dentro del radio seleccionado.</div>
                        </div>
                    )}

                    {/* Cards de sucursales */}
                    {!loading && !error &&
                        Object.entries(sucursalesFiltradasPorTipo).map(([tipo, establecimientosDelTipo]) => (
                            <div key={tipo} className="mb-5">

                                <h6 className="fw-bold mb-3" style={{ fontSize: "1.1rem" }}>{tipo}</h6>

                                {Object.entries(establecimientosDelTipo).map(
                                    ([establecimientoNombre, sucursalesDelEstablecimiento]) => (
                                        <div key={establecimientoNombre} className="row g-3 mb-4">
                                            {sucursalesDelEstablecimiento.map((sucursal) => (
                                                <div className="col-md-6 col-xl-4" key={sucursal.id}>
                                                    <div className="sucursal-card">

                                                        {/* Imagen placeholder */}
                                                        <div className="sucursal-card-img">
                                                            <span className="sucursal-wait-badge">
                                                                <i className="bi bi-clock"></i> ~{sucursal.tiempo_por_cliente} min
                                                            </span>
                                                        </div>

                                                        {/* Info */}
                                                        <div className="sucursal-card-body">
                                                            <p className="sucursal-establecimiento">{establecimientoNombre}</p>
                                                            <h6 className="sucursal-nombre">{sucursal.nombre}</h6>
                                                            <p className="sucursal-address">
                                                                <i className="bi bi-geo-alt"></i>
                                                                {sucursal.address || "Dirección no especificada"}
                                                            </p>
                                                            {sucursal.distanceKm != null && (
                                                                <p className="sucursal-distance">
                                                                    <i className="bi bi-signpost"></i>
                                                                    {sucursal.distanceKm.toFixed(1)} km de distancia
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Footer */}
                                                        <div className="sucursal-card-footer">
                                                            {sucursal.lat && sucursal.lng && (
                                                                <a href={`https://www.google.com/maps?q=${sucursal.lat},${sucursal.lng}`} target="_blank" rel="noreferrer" className="btn-maps" >
                                                                    <i className="bi bi-map"></i> Cómo llegar
                                                                </a>
                                                            )}

                                                            {hasActiveTicketInSucursal(sucursal.id) && (
                                                                <span className="sucursal-live-badge">
                                                                    <span className="sucursal-live-dot"></span>
                                                                    En esta fila
                                                                </span>
                                                            )}

                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}
                            </div>
                        ))
                    }

                </div>
            </main>
        </div>
    );
};