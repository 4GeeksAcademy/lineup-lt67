import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EstablecimientoDashboard.css"

export const EstablecimientoDashboard = () => {
    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [sucursales, setSucursales] = useState([])
    const [modoEdicion, setModoEdicion] = useState(false)

    const establecimiento = JSON.parse(localStorage.getItem("loggedEstablecimiento"))
    const filasActivas = sucursales.filter(filas => filas.fila_activa).length
    const totalSucursales = sucursales.length
    
    if (!establecimiento) {
        navigate("/establecimiento/login")
        return null
    }
    
    useEffect( () => {
        fetch(`${backendUrl}/api/establecimientos/${establecimiento.id}/sucursales`)
            .then(resp => resp.json())
            .then(data => {
                const ordenadas = [...data].sort((activas, inactivas) => inactivas.fila_activa - activas.fila_activa)
                setSucursales(ordenadas)
            })
                
    }, [])



    function handleLogout() {
        localStorage.removeItem("loggedEstablecimiento")
        localStorage.removeItem("tokenEstablecimiento")
        navigate("/establecimiento/login")
    }

    function handleBorrarSucursal(sucursalId) {
        const confirmar = window.confirm("¿Deseas borrar esta sucursal?")
        if (!confirmar) return

        fetch(`${backendUrl}/api/sucursal/${sucursalId}`, { method: "DELETE" })
            .then(resp => {
                if (resp.ok) {
                    setSucursales(sucursales.filter(s => s.id !== sucursalId))
                }
            })
    }


    return (

        <div className="dashboard">
            <div className="main-col">

                <div className="topbar">
                    
                    <div>
                        <h2 className="page-title">Hola, <span>{establecimiento.nombre}</span></h2>
                        <p className="page-sub">Panel de tu establecimiento</p>
                    </div>

                    <div className="d-flex gap-3">
                        <button className={`btn ${modoEdicion ? "btn-success" : "btn-outline-secondary"} btn-sm`} onClick={ () => setModoEdicion(!modoEdicion)}>
                            { modoEdicion ? "Listo" : "Editar" }
                        </button>

                        <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
                    </div>

                </div>

                <div className="stats">
                    <div className="stat">
                        <div className="stat-label">Total sucursales</div>
                        <div className="stat-val">{ totalSucursales }</div>
                        <div className="stat-sub">registradas</div>
                    </div>
                    <div className="stat">
                        <div className="stat-label">Filas activas</div>
                        <div className="stat-val green">{ filasActivas }</div>
                        <div className="stat-sub">en este momento</div>
                    </div>
                    <div className="stat">
                        <div className="stat-label">Tickets en espera</div>
                        <div className="stat-val">14</div>
                        <div className="stat-sub">hoy</div>
                    </div>
                </div>

                <div className="sucursales-grid">
                    {sucursales.length === 0 ? (
                        <p>No hay sucursales registradas</p>
                    ) : (
                        sucursales.map(s => (
                            <div key={s.id} className={`suc-card ${s.fila_activa ? "activa" : "inactiva"}`} onClick={() => navigate(`/establecimiento/sucursal/${s.id}`)} style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}>
                                <div>
                                    {s.imagen && (
                                        <div style={{ width: "100%", height: "100px", marginBottom: "10px", overflow: "hidden", borderRadius: "8px" }}>
                                            <img src={s.imagen} alt={s.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                    )}
                                    <div className="suc-name">{s.nombre}</div>
                                    <div className="suc-meta">Direccion. {s.address} · {s.tiempo_por_cliente} min/cliente</div>
                                </div>
                                <div className="suc-footer">
                                    <span className={`badge ${s.fila_activa ? "active" : "inactive"}`}>
                                        <span className={`dot ${s.fila_activa ? "green" : "gray"}`} />
                                        {s.fila_activa ? "Fila activa" : "Fila inactiva"}
                                    </span>

                                    {modoEdicion && (
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/establecimiento/sucursal/edit/${s.id}`)
                                            }}>
                                                Editar
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={(e) => {
                                                e.stopPropagation()
                                                handleBorrarSucursal(s.id)
                                            }}>
                                                Borrar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {modoEdicion && (
                        <div className="suc-card suc-add" onClick={() => navigate(`/sucursal/nueva?id_establecimiento=${establecimiento.id}&from=dashboard`)}>
                            <span>+</span>
                            <span>Agregar sucursal</span>
                        </div>
                    )}

                </div>

            </div>

            <div className="side-col">
                <div className="info-card">
                    <div className="info-avatar">HB</div>
                    <div className="info-name page-title"> <span>{establecimiento.nombre}</span></div>
                    <div className="info-sub">Establecimiento</div>
                    <div className="info-row">
                        <span className="info-row-label">Sucursales</span>
                        <span className="info-row-val">{ totalSucursales }</span>
                    </div>
                    <div className="info-row">
                        <span className="info-row-label">Filas activas</span>
                        <span className="info-row-val green">{ filasActivas }</span>
                    </div>
                </div>
            </div>

        </div>
    );
};