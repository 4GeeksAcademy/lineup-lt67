import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../components/lineup-shared.css"
import useGlobalReducer from "../hooks/useGlobalReducer";
import logoMenu from "../assets/logo-footer.svg";

export const ClientSidebar = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();
    const loggedClient = JSON.parse(localStorage.getItem("loggedClient"));

    const handleLogout = () => {
        localStorage.removeItem("tokenClient");
        localStorage.removeItem("loggedClient");
        dispatch({ type: "set_auth_client", payload: false });
        navigate("/client/login");
    };
    
    const navItems = [
        {
            to: "/client/home",
            label: "Inicio",
            icon: "bi-grid-1x2-fill",
            isActive: location.pathname === "/client/home",
        },
        {
            to: "/client/tickets",
            label: "Mis tickets",
            icon: "bi-ticket-detailed",
            isActive: location.pathname === "/client/tickets",
        },
        {
            to: "/client/services",
            label: "Servicios",
            icon: "bi-briefcase",
            isActive:
                location.pathname === "/client/services" ||
                (
                    location.pathname.startsWith("/client/services/") &&
                    location.pathname !== "/client/services/new"
                ),
        },
        {
            to: "/client/services/new",
            label: "Nuevo servicio",
            icon: "bi-plus-circle",
            isActive: location.pathname === "/client/services/new",
        },
    ];

    return (
        <aside className="sidebar">

            <img className="nav-logo" src={logoMenu} alt="LINE UP" />

            <div className="sidebar-section-label">Navigation</div>
            {navItems.map((item) => (
                <Link
                    key={item.to}
                    to={item.to}
                    className={item.isActive ? "active" : ""}
                >
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.label}</span>
                </Link>
            ))}

            <div style={{ flex: 1 }} />

            <hr />

            <div className="sidebar-section-label">User Account</div>
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {loggedClient?.profile_image_url
                            ? <img src={loggedClient.profile_image_url} alt="avatar" />
                            : loggedClient?.full_name?.charAt(0)?.toUpperCase() || "C"
                        }
                    </div>
                    <div>
                        <div className="sidebar-user-name">{loggedClient?.full_name || "Cliente"}</div>
                        <div className="sidebar-user-role">Cliente</div>
                    </div>
                </div>
                <button className="sidebar-logout" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
};