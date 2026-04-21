import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logoMenu from "../assets/logo-menu.svg";
import "./lineup-shared.css";

export const LinerSidebar = () => {
    const location = useLocation();
    const navigate  = useNavigate();
    const { dispatch } = useGlobalReducer();

    const liner    = JSON.parse(localStorage.getItem("linerData"));
    const initials = liner?.liner_nombre?.slice(0, 2).toUpperCase() || "LN";

    function handleLogout() {
        dispatch({ type: "set_auth_liner", payload: false });
        dispatch({ type: "set_liner_data", payload: null });
        localStorage.removeItem("linerToken");
        localStorage.removeItem("linerData");
        navigate("/liner/login");
    }

    return (
        <aside className="sidebar">

            <img className="nav-logo mb-5" src={logoMenu} alt="LINE UP" />

            <div className="sidebar-section-label">Navegación</div>

            <Link
                to="/liner/home"
                className={location.pathname === "/liner/home" ? "active" : ""}
            >
                <i className="bi bi-grid-1x2-fill"></i>
                <span>Inicio</span>
            </Link>

            <Link
                to="/liner/home#servicios"
                className={location.hash === "#servicios" ? "active" : ""}
                onClick={() => document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })}
            >
                <i className="bi bi-briefcase"></i>
                <span>Servicios</span>
            </Link>

            <Link
                to="/liner/home#postulaciones"
                className={location.hash === "#postulaciones" ? "active" : ""}
                onClick={() => document.getElementById("postulaciones")?.scrollIntoView({ behavior: "smooth" })}
            >
                <i className="bi bi-send"></i>
                <span>Mis postulaciones</span>
            </Link>

            <div style={{ flex: 1 }} />
            <hr />

            <div className="sidebar-section-label">Cuenta</div>
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">{initials}</div>
                    <div>
                        <div className="sidebar-user-name">{liner?.liner_nombre || "Liner"}</div>
                        <div className="sidebar-user-role">Liner</div>
                    </div>
                </div>
                <button className="sidebar-logout" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>

        </aside>
    );
};