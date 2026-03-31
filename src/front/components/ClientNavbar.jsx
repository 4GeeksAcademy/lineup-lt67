import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ClientNavbar = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const loggedClient = JSON.parse(localStorage.getItem("loggedClient"));

    const handleLogout = () => {
        localStorage.removeItem("tokenClient");
        localStorage.removeItem("loggedClient");
        dispatch({ type: "set_auth_client", payload: false });
        navigate("/client/login");
    };

    return (
        <nav className="navbar bg-light border-bottom px-4">
            <Link to="/client/home" className="navbar-brand mb-0 h1 text-decoration-none text-dark">
                LineUp
            </Link>

            <div className="d-flex align-items-center gap-2 flex-wrap">
                <Link to="/client/home">
                    <button className="btn btn-outline-secondary">Inicio</button>
                </Link>

                <Link to="/client/tickets">
                    <button className="btn btn-outline-primary">Mis tickets</button>
                </Link>

                <span className="fw-semibold ms-2">
                    {loggedClient?.full_name || "Cliente"}
                </span>

                <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
};