import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LocationPicker } from "../../components/LocationPicker";

export const SucursalEdit = () => {
    const { id } = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    const [nombre, setNombre] = useState("")
    const [gerente, setGerente] = useState("")
    const [location, setLocation] = useState({ lat: -31.4201, lng: -64.1888, address: "" })

    useEffect(() => {
        fetch(`${backendUrl}/api/sucursal/${id}`)
        .then(resp => resp.json())
        .then(data => {
            setNombre(data.nombre)
            setGerente(data.nombre_gerente || "")
            setLocation({
                lat: data.lat ?? -31.4201,
                lng: data.lng ?? -64.1888,
                address: data.address ?? ""
            })
        })
    }, [])

    function handleSubmit(e) {
        e.preventDefault()

        const data = {
            nombre: nombre,
            nombre_gerente: gerente,
            lat: location.lat,
            lng: location.lng,
            address: location.address
        }

        fetch(`${backendUrl}/api/sucursal/${id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(resp => {
            if (resp.ok) navigate(`/establecimiento/dashboard`)
        })
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow position-relative" style={{ width: "50%" }}>
                <button onClick={() => navigate(-1)} className="btn-close position-absolute top-0 end-0 m-2" />
                <h3 className="text-center mb-4">Editar Sucursal</h3>

                <style>{`
                    .location-wrapper .row.g-3 { display: none; }
                    .location-wrapper .d-flex.gap-2 { display: none; }
                    .location-wrapper label:nth-of-type(2) { display: none; }
                `}</style>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control"
                            value={nombre} onChange={e => setNombre(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Nombre del gerente</label>
                        <input type="text" className="form-control"
                            value={gerente} onChange={e => setGerente(e.target.value)} />
                    </div>

                    <div className="mb-4 location-wrapper">
                        <label className="form-label fw-bold">Ubicación en el mapa</label>
                        <LocationPicker
                            value={location}
                            onChange={setLocation}
                            height="300px"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-2">Guardar cambios</button>
                    <button type="button" className="btn btn-outline-danger w-100" onClick={() => navigate(-1)}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    )
}