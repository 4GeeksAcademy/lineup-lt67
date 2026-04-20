import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const LinerForm = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [foto, setFoto] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            liner_nombre: nombre.trim(),
            liner_email: email.trim(),
            liner_password: password,
            liner_foto: foto.trim() || null
        };

        fetch(`${backendUrl}/api/liners`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(async (resp) => {
                const responseData = await resp.json();

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo crear el liner");
                }

                navigate("/liners");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al crear el liner");
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
                                Nuevo liner
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Crear un nuevo liner desde el panel administrativo.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Datos del liner</h6>
                                </div>

                                <div className="p-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nombre completo"
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
                                                placeholder="liner@ejemplo.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Contraseña</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Ingresá una contraseña"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
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
                                                Crear liner
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
                                    <h6>Resumen</h6>
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
                                    ) : null}

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