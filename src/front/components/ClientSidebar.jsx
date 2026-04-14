import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../components/lineup-shared.css"

export const ClientSidebar = () => {
    const location = useLocation();

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
        </aside>
    );
};