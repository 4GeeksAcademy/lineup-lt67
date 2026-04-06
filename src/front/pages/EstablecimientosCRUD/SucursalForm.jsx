import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const SucursalForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const idEstablecimiento = searchParams.get("id_establecimiento");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [nombre, setNombre] = useState("");
    const [gerente, setGerente] = useState("")
    const [direccion, setDireccion] = useState("")

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
            direccion: direccion,
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
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Nueva Sucursal</h3>

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

                    <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <input type="text" className="form-control"
                            value={direccion} onChange={e => setDireccion(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Crear</button>
                    <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                        Volver
                    </button>
                </form>
            </div>
        </div>
    )
}

