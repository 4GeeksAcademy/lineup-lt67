import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const AdminDetail = () => {

    const { id } = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    const [admin, setAdmin] = useState(null)

    useEffect(() => {
        fetch(`${backendUrl}/api/administrador/${id}`)
        .then((resp) => resp.json())
        .then((data) => setAdmin(data))
    }, [])

    if (!admin) return <h4 className="text-center mt-4">Cargando...</h4>

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow position-relative" style={{ width: "22rem" }}>
                <button
                    onClick={() => navigate('/administradores')}
                    className="btn-close position-absolute top-0 end-0 m-2"
                />
                <h3 className="text-center mb-4">Detalle administrador</h3>

                <p><strong>ID:</strong> {admin.id}</p>
                <p><strong>Nombre:</strong> {admin.name}</p>
                <p><strong>Email:</strong> {admin.email}</p>

                <button
                    onClick={() => navigate(`/administradores/edit/${id}`)}
                    className="btn btn-primary w-100 mt-3">
                    Editar
                </button>
            </div>
        </div>
    )
}