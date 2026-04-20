import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoMenu from "../assets/logo-menu.svg";
import "./lineup-shared.css";

export const EstablecimientoSidebar = ({ sucursales = [] }) => {
    const navigate = useNavigate();

    const establecimiento = JSON.parse(localStorage.getItem("loggedEstablecimiento"));
    const initials = establecimiento?.nombre?.slice(0, 2).toUpperCase() || "ES";

    const [sucursalesOpen, setSucursalesOpen] = useState(false);

    function handleLogout() {
        localStorage.removeItem("loggedEstablecimiento");
        localStorage.removeItem("tokenEstablecimiento");
        navigate("/establecimiento/login");
    }

    return (
        <aside className="sidebar">

            <img className="nav-logo" src={logoMenu} alt="LINE UP" />

            <div className="sidebar-section-label">Navegación</div>

            <a href="#sucursales" className="active">
                <i className="bi bi-grid-1x2-fill"></i>
                <span>Inicio</span>
            </a>

            {/* Dropdown Sucursales */}
            <div className={`sidebar-dropdown-wrap ${sucursalesOpen ? "open" : ""}`}>
                <div
                    className="sidebar-dropdown-trigger"
                    onClick={() => setSucursalesOpen(!sucursalesOpen)}
                >
                    <div className="sidebar-dropdown-left">
                        <i className="bi bi-shop"></i>
                        <span>Sucursales</span>
                    </div>
                    <i className={`bi bi-chevron-${sucursalesOpen ? "up" : "down"} sidebar-chevron`}></i>
                </div>

                {sucursalesOpen && (
                    <div className="sidebar-dropdown-items">
                        {sucursales.map(s => (
                            <div
                                key={s.id}
                                className="sidebar-dropdown-item"
                                onClick={() => navigate(`/establecimiento/sucursal/${s.id}`)}
                            >
                                <span className={`sidebar-dot ${s.fila_activa ? "green" : "gray"}`}></span>
                                {s.nombre}
                            </div>
                        ))}
                        <div
                            className="sidebar-dropdown-item add"
                            onClick={() => navigate(`/sucursal/nueva?id_establecimiento=${establecimiento?.id}&from=dashboard`)}
                        >
                            <i className="bi bi-plus"></i>
                            Agregar sucursal
                        </div>
                    </div>
                )}
            </div>

            <div style={{ flex: 1 }} />
            <hr />

            <div className="sidebar-section-label">Cuenta</div>
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">{initials}</div>
                    <div>
                        <div className="sidebar-user-name">{establecimiento?.nombre}</div>
                        <div className="sidebar-user-role">Establecimiento</div>
                    </div>
                </div>
                <button className="sidebar-logout" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>

        </aside>
    );
};