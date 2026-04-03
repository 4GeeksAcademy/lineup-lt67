import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientNavbar } from "../components/ClientNavbar";

export const ClientServiceForm = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [descripcion, setDescripcion] = useState("");
    const [lugar, setLugar] = useState("");
    const [urgencia, setUrgencia] = useState("");
    const [precioPropuesto, setPrecioPropuesto] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const token = localStorage.getItem("tokenClient");

        try {
            const resp = await fetch(`${backendUrl}/api/clients/me/services`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    descripcion,
                    lugar,
                    urgencia,
                    precio_propuesto: precioPropuesto ? Number(precioPropuesto) : null
                })
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo crear el servicio");
            }

            navigate("/client/services");
        } catch (err) {
            setError(err.message || "Ocurrió un error al crear el servicio");
        }
    };

    return (
        <div className="container-fluid px-0">
            <ClientNavbar />

            <div className="container py-4">
                <h1 className="mb-4">Nuevo servicio</h1>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Lugar</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={lugar}
                                    onChange={(e) => setLugar(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Urgencia</label>
                                <select
                                    className="form-select"
                                    value={urgencia}
                                    onChange={(e) => setUrgencia(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccionar urgencia</option>
                                    <option value="baja">Baja</option>
                                    <option value="media">Media</option>
                                    <option value="alta">Alta</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Precio propuesto</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={precioPropuesto}
                                    onChange={(e) => setPrecioPropuesto(e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            {error && <p className="text-danger small">{error}</p>}

                            <button type="submit" className="btn btn-primary">
                                Crear servicio
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};