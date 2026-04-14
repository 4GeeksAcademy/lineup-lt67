import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const TipoForm = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const resp = await fetch(`${backendUrl}/api/tipos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    descripcion: descripcion.trim() || null
                })
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo crear el tipo");
            }

            navigate("/tipos");
        } catch (err) {
            setError(err.message || "Ocurrió un error al crear el tipo");
        }
    };

    return (
        <div className="container-fluid px-0">
            <AdminNavbar />
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Nuevo tipo
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Crear una nueva categoría para establecimientos.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Datos del tipo</h6>
                                </div>

                                <div className="p-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ej: Farmacia"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Descripción</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                placeholder="Descripción breve del tipo"
                                                value={descripcion}
                                                onChange={(e) => setDescripcion(e.target.value)}
                                            />
                                        </div>

                                        {error && <p className="text-danger small">{error}</p>}

                                        <div className="d-flex gap-2 flex-wrap mt-4">
                                            <button type="submit" className="btn-export">
                                                <i className="bi bi-check-circle"></i>
                                                Crear tipo
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-page"
                                                onClick={() => navigate("/tipos")}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Resumen</h6>
                                </div>

                                <div className="p-4">
                                    <div className="d-flex flex-column gap-3">
                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">
                                                <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                                Nombre
                                            </div>
                                            <div style={{ fontSize: ".9rem", color: "var(--text)" }}>
                                                {nombre || "Sin definir"}
                                            </div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">
                                                <span className="stat-dot" style={{ background: "#8b5cf6" }}></span>
                                                Descripción
                                            </div>
                                            <div style={{ fontSize: ".9rem", color: "var(--text)" }}>
                                                {descripcion || "Sin descripción"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};