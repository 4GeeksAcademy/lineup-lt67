import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


export const SucursalEdit = () => {

    const { id } = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    const [nombre, setNombre] = useState("")
    const [capacidad, setCapacidad] = useState("")
    const [tiempoPorCliente, setTiempoPorCliente] = useState("")
    const [filaActiva, setFilaActiva] = useState(false)
    const [idEstablecimiento, setIdEstablecimiento] = useState(null)
    const [location, setLocation] = useState({});

    useEffect(() => {
        fetch(`${backendUrl}/api/sucursal/${id}`)
        .then((resp) => resp.json())
        .then((data) => {
            setNombre(data.nombre)
            setCapacidad(data.capacidad)
            setTiempoPorCliente(data.tiempo_por_cliente)
            setFilaActiva(data.fila_activa)
            setIdEstablecimiento(data.id_establecimiento)
            setLocation({
                lat: data.lat ?? -31.4201,
                lng: data.lng ?? -64.1888
            });
        })
    }, [])

    function handleSubmit(e) {
        e.preventDefault()

        const data = {
            nombre: nombre,
            capacidad: parseInt(capacidad),
            tiempo_por_cliente: parseInt(tiempoPorCliente),
            fila_activa: filaActiva
        }

        fetch(`${backendUrl}/api/sucursal/${id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then((resp) => {
            if (resp.ok) navigate(`/establecimiento/dashboard`)
        })
    }

    function deleteSucursal() {
        fetch(`${backendUrl}/api/sucursal/${id}`, { method: 'DELETE' })
        .then((resp) => {
            if (resp.ok) navigate(`/establecimiento/dashboard`)
        })
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow position-relative" style={{ width: "22rem" }}>
                <button
                    onClick={() => navigate(`/establecimiento/dashboard`)}
                    className="btn-close position-absolute top-0 end-0 m-2"
                />
                <h3 className="text-center mb-4">Editar Sucursal</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control"
                            value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Capacidad</label>
                        <input type="number" className="form-control"
                            value={capacidad} onChange={(e) => setCapacidad(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tiempo por cliente (min)</label>
                        <input type="number" className="form-control"
                            value={tiempoPorCliente} onChange={(e) => setTiempoPorCliente(e.target.value)} required />
                    </div>

                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="filaActiva"
                            checked={filaActiva} onChange={(e) => setFilaActiva(e.target.checked)} />
                        <label className="form-check-label" htmlFor="filaActiva">Fila activa</label>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-2">Guardar cambios</button>
                </form>
                <button onClick={deleteSucursal} className="btn btn-danger w-100">
                    Borrar sucursal
                </button>
            </div>
        </div>
    )
}