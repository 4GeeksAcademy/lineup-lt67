import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const TipoEdit = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${backendUrl}/api/tipos/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar el tipo");
                }

                setNombre(data.nombre || "");
                setDescripcion(data.descripcion || "");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar el tipo");
            });
    }, [backendUrl, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const resp = await fetch(`${backendUrl}/api/tipos/${id}`, {
                method: "PUT",
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
                throw new Error(data.msg || "No se pudo editar el tipo");
            }

            navigate("/tipos");
        } catch (err) {
            setError(err.message || "Ocurrió un error al editar el tipo");
        }
    };

    const deleteTipo = async () => {
        try {
            const resp = await fetch(`${backendUrl}/api/tipos/${id}`, {
                method: "DELETE"
            });

            if (!resp.ok) {
                let data = {};
                try {
                    data = await resp.json();
                } catch {
                    data = {};
                }
                throw new Error(data.msg || "No se pudo borrar el tipo");
            }

            navigate("/tipos");
        } catch (err) {
            setError(err.message || "Ocurrió un error al borrar el tipo");
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
                                Editar tipo
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Modificá la categoría desde el panel administrativo.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Datos editables</h6>
                                </div>

                                <div className="p-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
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
                                                value={descripcion}
                                                onChange={(e) => setDescripcion(e.target.value)}
                                            />
                                        </div>

                                        {error && <p className="text-danger small">{error}</p>}

                                        <div className="d-flex gap-2 flex-wrap mt-4">
                                            <button type="submit" className="btn-export">
                                                <i className="bi bi-check-circle"></i>
                                                Guardar cambios
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={deleteTipo}
                                            >
                                                Borrar tipo
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
                                    <h6>Vista previa</h6>
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