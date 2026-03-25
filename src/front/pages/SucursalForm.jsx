import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const SucursalForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const idEstablecimiento = searchParams.get("id_establecimiento");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [nombre, setNombre] = useState("");
    const [capacidad, setCapacidad] = useState("");
    const [tiempoPorCliente, setTiempoPorCliente] = useState("");
    const [filaActiva, setFilaActiva] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        const data = {
            id_establecimiento: parseInt(idEstablecimiento),
            nombre: nombre,
            capacidad: parseInt(capacidad),
            tiempo_por_cliente: parseInt(tiempoPorCliente),
            fila_activa: filaActiva
        }

        fetch(`${backendUrl}/api/sucursal`, {
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(data)
        })
        .then((resp) => {
            if (resp.ok) navigate(`/establecimientos/${idEstablecimiento}/detalle`)
        })
    }
    
    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Nueva Sucursal</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control" placeholder="Nombre"
                            value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Capacidad</label>
                        <input type="number" className="form-control" placeholder="Capacidad"
                            value={capacidad} onChange={(e) => setCapacidad(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tiempo por cliente (min)</label>
                        <input type="number" className="form-control" placeholder="Minutos"
                            value={tiempoPorCliente} onChange={(e) => setTiempoPorCliente(e.target.value)} required />
                    </div>

                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="filaActiva"
                            checked={filaActiva} onChange={(e) => setFilaActiva(e.target.checked)} />
                        <label className="form-check-label" htmlFor="filaActiva">Fila activa</label>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Crear</button>
                </form>
            </div>
        </div>
    )
}

