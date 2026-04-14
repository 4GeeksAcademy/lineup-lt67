import React from "react";
import { Link, useLocation } from "react-router-dom";

export const AdminSidebar = () => {
    const location = useLocation();

    const navItems = [
        {
            to: "/administradores",
            label: "Administradores",
            icon: "bi-shield-lock",
            isActive:
                location.pathname === "/administradores" ||
                location.pathname.startsWith("/administradores/")
        },
        {
            to: "/clients",
            label: "Clientes",
            icon: "bi-people",
            isActive:
                location.pathname === "/clients" ||
                location.pathname.startsWith("/clients/")
        },
        {
            to: "/liners",
            label: "Liners",
            icon: "bi-person-badge",
            isActive:
                location.pathname === "/liners" ||
                location.pathname.startsWith("/liners/")
        },
        {
            to: "/servicios",
            label: "Servicios",
            icon: "bi-briefcase",
            isActive:
                location.pathname === "/servicios" ||
                location.pathname.startsWith("/servicios/")
        },
        {
            to: "/tickets",
            label: "Tickets",
            icon: "bi-ticket-detailed",
            isActive:
                location.pathname === "/tickets" ||
                location.pathname.startsWith("/tickets/")
        },
        {
            to: "/propuestas",
            label: "Propuestas",
            icon: "bi-chat-left-text",
            isActive:
                location.pathname === "/propuestas" ||
                location.pathname.startsWith("/propuestas/")
        },
        {
            to: "/tipos",
            label: "Tipos",
            icon: "bi-tags",
            isActive:
                location.pathname === "/tipos" ||
                location.pathname.startsWith("/tipos/")
        },
        {
            to: "/establecimientos",
            label: "Establecimientos",
            icon: "bi-shop",
            isActive:
                location.pathname === "/establecimientos" ||
                location.pathname.startsWith("/establecimientos/")
        }
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