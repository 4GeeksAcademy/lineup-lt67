import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const LinerEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [foto, setFoto] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${backendUrl}/api/liners/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar el liner");
                }

                setNombre(data.nombre || "");
                setEmail(data.email || "");
                setFoto(data.foto || "");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar el liner");
            });
    }, [backendUrl, id]);

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            liner_nombre: nombre.trim(),
            liner_email: email.trim(),
            liner_foto: foto.trim() || null
        };

        fetch(`${backendUrl}/api/liners/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(async (resp) => {
                const responseData = await resp.json();

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo editar el liner");
                }

                navigate("/liners");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al editar el liner");
            });
    }

    function deleteLiner() {
        fetch(`${backendUrl}/api/liners/${id}`, { method: "DELETE" })
            .then(async (resp) => {
                if (!resp.ok) {
                    let data = {};
                    try {
                        data = await resp.json();
                    } catch {
                        data = {};
                    }
                    throw new Error(data.msg || "No se pudo borrar el liner");
                }

                navigate("/liners");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al borrar el liner");
            });
    }

    return (
        <div className="container-fluid px-0">
             
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Editar liner
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Modificá los datos del liner desde el panel administrativo.
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
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Foto (URL, opcional)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="https://..."
                                                value={foto}
                                                onChange={(e) => setFoto(e.target.value)}
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
                                                onClick={deleteLiner}
                                            >
                                                Borrar liner
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-page"
                                                onClick={() => navigate("/liners")}
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
                                    {foto ? (
                                        <img
                                            src={foto}
                                            alt="Preview liner"
                                            className="img-fluid rounded mb-3"
                                            style={{
                                                width: "100%",
                                                maxHeight: "220px",
                                                objectFit: "cover",
                                                border: "1px solid var(--border)"
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded mb-3"
                                            style={{
                                                height: "200px",
                                                background: "#f8fafc",
                                                border: "1px solid var(--border)",
                                                color: "var(--text-muted)"
                                            }}
                                        >
                                            Sin imagen
                                        </div>
                                    )}

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
                                                <span className="stat-dot" style={{ background: "#22c55e" }}></span>
                                                Email
                                            </div>
                                            <div style={{ fontSize: ".9rem", color: "var(--text)" }}>
                                                {email || "Sin definir"}
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