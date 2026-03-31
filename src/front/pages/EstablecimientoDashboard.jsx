import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EstablecimientoDashboard.css"

export const EstablecimientoDashboard = () => {
    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const establecimiento = JSON.parse(localStorage.getItem("loggedEstablecimiento"))

    if (!establecimiento) {
        navigate("/establecimiento/login");
        return null;
    }

    function handleLogout() {
        localStorage.removeItem("loggedEstablecimiento");
        localStorage.removeItem("tokenEstablecimiento");
        navigate("/establecimiento/login");
    }


    return (

        <div className="dashboard">
            <div className="main-col">

                <div className="topbar">
                    <div>
                        <h2 className="page-title">Hola, <span>{establecimiento.nombre}</span></h2>
                        <p className="page-sub">Panel de tu establecimiento</p>
                    </div>
                    <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
                </div>

                <div className="stats">
                    <div className="stat">
                        <div className="stat-label">Total sucursales</div>
                        <div className="stat-val">3</div>
                        <div className="stat-sub">registradas</div>
                    </div>
                    <div className="stat">
                        <div className="stat-label">Filas activas</div>
                        <div className="stat-val green">2</div>
                        <div className="stat-sub">en este momento</div>
                    </div>
                    <div className="stat">
                        <div className="stat-label">Tickets en espera</div>
                        <div className="stat-val">14</div>
                        <div className="stat-sub">hoy</div>
                    </div>
                </div>

                <div>
                    <p className="section-title">Tus sucursales</p>
                    <div className="sucursales-grid">

                        <div className="suc-card activa">
                            <div>
                                <div className="suc-name">Sucursal Centro</div>
                                <div className="suc-meta">Cap. 20 · 8 min/cliente</div>
                            </div>
                            <div className="suc-footer">
                                <span className="badge active">
                                    <span className="dot green" />
                                    Fila activa
                                </span>
                                <button className="btn-ver">Ver fila</button>
                            </div>
                        </div>

                        <div className="suc-card inactiva">
                            <div>
                                <div className="suc-name">Sucursal Norte</div>
                                <div className="suc-meta">Cap. 15 · 10 min/cliente</div>
                            </div>
                            <div className="suc-footer">
                                <span className="badge inactive">
                                    <span className="dot gray" />
                                    Fila inactiva
                                </span>
                                <button className="btn-ver">Ver fila</button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <div className="side-col">
                <div className="info-card">
                    <div className="info-avatar">HB</div>
                    <div className="info-name page-title"> <span>{establecimiento.nombre}</span></div>
                    <div className="info-sub">Establecimiento</div>
                    <div className="info-row">
                        <span className="info-row-label">Sucursales</span>
                        <span className="info-row-val">3</span>
                    </div>
                    <div className="info-row">
                        <span className="info-row-label">Filas activas</span>
                        <span className="info-row-val green">2</span>
                    </div>
                </div>
            </div>

        </div>
    );
};