import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logoMenu from "../assets/logo-menu.svg";
import "../components/lineup-shared.css";

export const AdminLayout = () => {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("tokenAdmin");
        localStorage.removeItem("loggedAdmin");
        navigate("/admin/login");
    }

    return (
        <div className="container-fluid px-0">

            {/* SIDEBAR */}
            <aside className="sidebar">

                <img className="nav-logo" src={logoMenu} alt="LINE UP" />

                <div className="sidebar-section-label">Módulos</div>

                <NavLink to="/clients" className={({ isActive }) => isActive ? "active" : ""}>
                    <i className="bi bi-people"></i>
                    <span>Clientes</span>
                </NavLink>

                <NavLink to="/liners" className={({ isActive }) => isActive ? "active" : ""}>
                    <i className="bi bi-person-badge"></i>
                    <span>Liners</span>
                </NavLink>

                <div className="sidebar-section-label">Organización</div>

                <NavLink to="/establecimientos" className={({ isActive }) => isActive ? "active" : ""}>
                    <i className="bi bi-shop"></i>
                    <span>Establecimientos</span>
                </NavLink>

                <NavLink to="/administradores" className={({ isActive }) => isActive ? "active" : ""}>
                    <i className="bi bi-shield-lock"></i>
                    <span>Administradores</span>
                </NavLink>

                <NavLink to="/tipos" className={({ isActive }) => isActive ? "active" : ""}>
                    <i className="bi bi-tags"></i>
                    <span>Tipos</span>
                </NavLink>

                <div style={{ flex: 1 }} />
                <hr />

                <div className="sidebar-section-label">Cuenta</div>
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">A</div>
                        <div>
                            <div className="sidebar-user-name">Administrador</div>
                            <div className="sidebar-user-role">Panel interno</div>
                        </div>
                    </div>
                    <button className="sidebar-logout" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>

            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="main">
                <Outlet />
            </main>

        </div>
    );
};