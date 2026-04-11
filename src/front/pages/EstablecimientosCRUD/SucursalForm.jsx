import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LocationPicker } from "../../components/LocationPicker";

export const SucursalForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const idEstablecimiento = searchParams.get("id_establecimiento");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [nombre, setNombre] = useState("");
    const [gerente, setGerente] = useState("")
    const [direccion, setDireccion] = useState("")
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

        const data = {
            id_establecimiento: parseInt(idEstablecimiento),
            nombre: nombre,
            nombre_gerente: gerente,
            lat: location.lat,
            lng: location.lng,
            address: location.address,
        };

            fetch(`${backendUrl}/api/sucursal`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            .then((resp) => {
                if (resp.ok) navigate(`/establecimiento/dashboard`)
                    else navigate (`/establecimiento/${idEstablecimiento}/detalle`)
            })
        }
    
    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow" style={{ width: "50%" }}>
                <h3 className="text-center mb-4">Nueva Sucursal</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control" placeholder="Nombre"
                            value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>
                   
                    <div className="mb-3">
                        <label className="form-label">Nombre del gerente</label>
                        <input type="text" className="form-control"
                            value={gerente} onChange={e => setGerente(e.target.value)} />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Ubicación en el mapa</label>
                        <LocationPicker
                            value={location}
                            onChange={setLocation}
                            height="300px"
                        />
                    </div>

                    <div>
                        <button type="submit" className="btn btn-primary w-100 mb-3">
                            Crear
                        </button>
                        
                        <button className="btn btn-outline-danger w-100" onClick={() => navigate(-1)}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

