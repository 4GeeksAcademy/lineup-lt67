import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LocationPicker } from "../../components/LocationPicker";

export const SucursalForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const idEstablecimiento = searchParams.get("id_establecimiento");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [nombre, setNombre] = useState("");
    const [capacidad, setCapacidad] = useState("");
    const [tiempoPorCliente, setTiempoPorCliente] = useState("");
    const [filaActiva, setFilaActiva] = useState(false);
    const [imagenFile, setImagenFile] = useState(null);
    const [location, setLocation] = useState({
        lat: -31.4201,
        lng: -64.1888,
        address: ""
    });

    function handleSubmit(e) {
        e.preventDefault();

        if (!idEstablecimiento) {
            alert("No se especificó un establecimiento");
            return;
        }

        const formData = new FormData();
        formData.append("id_establecimiento", idEstablecimiento);
        formData.append("nombre", nombre);
        formData.append("capacidad", capacidad);
        formData.append("tiempo_por_cliente", tiempoPorCliente);
        formData.append("fila_activa", filaActiva);
        formData.append("lat", location.lat);
        formData.append("lng", location.lng);
        formData.append("address", location.address)
        
        if (imagenFile) {
            formData.append("imagen", imagenFile);
        }

        fetch(`${backendUrl}/api/sucursal`, {
            method: 'POST',
            body: formData
        })
        .then((resp) => {
            if (resp.ok) navigate(`/establecimiento/dashboard`)
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

                    <div className="mb-4">
                        <label className="form-label fw-bold">Ubicación en el mapa</label>
                        <LocationPicker
                            value={location}
                            onChange={setLocation}
                            height="300px"
                        />
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

                    <div className="mb-3">
                        <label className="form-label">Imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={(e) => setImagenFile(e.target.files[0])}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Crear</button>
                </form>
            </div>
        </div>
    )
}

