import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const LinerDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [liner, setLiner] = useState(null);

    useEffect(() => {
        fetch(`${backendUrl}/api/liners/${id}`)
        .then((resp) => resp.json())
        .then((data) => setLiner(data));
    }, [id]);

    if (!liner) return <p className="text-center mt-4">Cargando...</p>;

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow" style={{ maxWidth: "30rem", margin: "0 auto" }}>
                <h3 className="text-center mb-4">Detalle del Liner</h3>

                {liner.foto && (
                    <div className="text-center mb-3">
                        <img src={liner.foto} alt="foto liner"
                            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
                    </div>
                )}

                <p><strong>ID:</strong> {liner.id}</p>
                <p><strong>Nombre:</strong> {liner.nombre}</p>
                <p><strong>Email:</strong> {liner.email}</p>

                <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-secondary" onClick={() => navigate('/liners')}>
                        Volver
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate(`/liners/edit/${id}`)}>
                        Editar
                    </button>
                </div>
            </div>
        </div>
    );
};