import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../components/lineup-shared.css"

export const LinerSidebar = () => {
    const location = useLocation();

    const navItems = [
        {
            to: "/liner/home",
            label: "Inicio",
            icon: "bi-grid-1x2-fill",
            isActive:
                location.pathname === "/liner/home" ||
                location.pathname.startsWith("/liner/services/")
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