import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const TipoForm = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        const data = {
            nombre: nombre,
            descripcion: descripcion
        };

        fetch(`${backendUrl}/api/tipos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((resp) => {
                if (resp.ok) navigate("/tipos");
            });
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Crear nuevo tipo</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre del tipo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descripcion</label>
                        <textarea
                            className="form-control"
                            placeholder="Descripcion (opcional)"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Crear
                    </button>
                </form>
            </div>
        </div>
    );
};
