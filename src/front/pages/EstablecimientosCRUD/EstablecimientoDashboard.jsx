import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeatMap from "../../components/HeatMap.jsx";
import "../../components/lineup-shared.css";
import logoMenu from "../../assets/logo-footer.svg"
import { EstablecimientoSidebar } from "../../components/EstablecimientoSidebar.jsx";

export const EstablecimientoDashboard = () => {
    const navigate   = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [sucursales, setSucursales]     = useState([]);
    const [modoEdicion, setModoEdicion]   = useState(false);
    const [sucursalesOpen, setSucursalesOpen] = useState(false);

    const establecimiento = JSON.parse(localStorage.getItem("loggedEstablecimiento"));
    const filasActivas    = sucursales.filter(s => s.fila_activa).length;
    const totalSucursales = sucursales.length;

    if (!establecimiento) {
        navigate("/establecimiento/login");
        return null;
    }

    useEffect(() => {
        fetch(`${backendUrl}/api/establecimientos/${establecimiento.id}/sucursales`)
            .then(resp => resp.json())
            .then(data => {
                const ordenadas = [...data].sort((a, b) => b.fila_activa - a.fila_activa);
                setSucursales(ordenadas);
            });
    }, []);

    function handleLogout() {
        localStorage.removeItem("loggedEstablecimiento");
        localStorage.removeItem("tokenEstablecimiento");
        navigate("/establecimiento/login");
    }

    function handleBorrarSucursal(sucursalId) {
        if (!window.confirm("¿Deseas borrar esta sucursal?")) return;
        fetch(`${backendUrl}/api/sucursal/${sucursalId}`, { method: "DELETE" })
            .then(resp => {
                if (resp.ok) setSucursales(sucursales.filter(s => s.id !== sucursalId));
            });
    }

    const initials = establecimiento.nombre?.slice(0, 2).toUpperCase() || "ES";

    return (
        <div className="container-fluid px-0">

            <EstablecimientoSidebar sucursales={sucursales} />

            {/* MAIN */}
            <main className="main">
                <div className="page-body">

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div>
                            <h3 className="fw-bold mb-1">
                                Hola, {establecimiento.nombre} 👋
                            </h3>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Panel de tu establecimiento
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className={`btn btn-md px-3 ${modoEdicion ? "btn-success" : "btn-primary"}`}
                                onClick={() => setModoEdicion(!modoEdicion)}
                            >
                                {modoEdicion ? "Listo" : "Editar Sucursales"}
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    Total sucursales
                                </div>
                                <div className="stat-value">{totalSucursales}</div>
                                <span className="stat-badge">
                                    <i className="bi bi-shop"></i>
                                    Registradas
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#1D9E75" }}></span>
                                    Filas activas
                                </div>
                                <div className="stat-value" style={{ color: "#1D9E75" }}>{filasActivas}</div>
                                <span className="stat-badge">
                                    <i className="bi bi-circle-fill" style={{ fontSize: ".5rem" }}></i>
                                    En este momento
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#ec4899" }}></span>
                                    Tickets en espera
                                </div>
                                <div className="stat-value">14</div>
                                <span className="stat-badge">
                                    <i className="bi bi-ticket-detailed"></i>
                                    Hoy
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sucursales */}
                    <div className="d-flex justify-content-between align-items-center mb-3" id="sucursales">
                        <h5 className="fw-bold mb-0">Sucursales</h5>
                    </div>

                    <div className="sucursales-grid">
                        {sucursales.length === 0 ? (
                            <p className="text-muted">No hay sucursales registradas</p>
                        ) : (
                            sucursales.map(s => (
                                <div
                                    key={s.id}
                                    className={`suc-card ${s.fila_activa ? "activa" : "inactiva"}`}
                                    onClick={() => navigate(`/establecimiento/sucursal/${s.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div>
                                        {s.imagen && (
                                            <div style={{ width: "100%", height: "100px", marginBottom: "10px", overflow: "hidden", borderRadius: "8px" }}>
                                                <img src={s.imagen} alt={s.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            </div>
                                        )}
                                        <div className="suc-name">{s.nombre}</div>
                                        <div className="suc-meta">{s.address} · {s.tiempo_por_cliente} min/cliente</div>
                                    </div>

                                    <div className="suc-footer">
                                        <span className={`badge ${s.fila_activa ? "active" : "inactive"}`}>
                                            <span className={`dot ${s.fila_activa ? "green" : "gray"}`} />
                                            {s.fila_activa ? "Fila activa" : "Fila inactiva"}
                                        </span>

                                        {modoEdicion && (
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/establecimiento/sucursal/edit/${s.id}`); }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={(e) => { e.stopPropagation(); handleBorrarSucursal(s.id); }}
                                                >
                                                    Borrar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        {modoEdicion && (
                            <div
                                className="suc-add"
                                onClick={() => navigate(`/sucursal/nueva?id_establecimiento=${establecimiento.id}&from=dashboard`)}
                            >
                                <span>+</span>
                                <span>Agregar sucursal</span>
                            </div>
                        )}
                    </div>

                    {/* HeatMap */}
                    <div className="mt-5" id="mapa">
                        <h5 className="fw-bold mb-3">Mapa de calor</h5>
                        <HeatMap />
                    </div>

                </div>
            </main>
        </div>
    );
};