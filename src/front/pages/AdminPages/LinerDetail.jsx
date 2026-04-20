import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const LinerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [liner, setLiner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${backendUrl}/api/liners/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar el liner");
                }

                setLiner(data);
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar el liner");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [backendUrl, id]);

    return (
        <div className="container-fluid px-0">
             
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    {loading && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Cargando liner...</h6>
                            </div>
                            <div className="p-4 text-muted">
                                Esperá un momento mientras cargamos la información.
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Error</h6>
                            </div>
                            <div className="p-4 text-danger">{error}</div>
                        </div>
                    )}

                    {!loading && !error && liner && (
                        <>
                            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                                <div>
                                    <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                        Liner #{liner.id}
                                    </h5>
                                    <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                        Vista detallada del liner registrado en el sistema.
                                    </p>
                                </div>

                                <div className="d-flex gap-2 flex-wrap">
                                    <button
                                        className="btn-details"
                                        onClick={() => navigate(`/liners/edit/${liner.id}`)}
                                    >
                                        Editar
                                    </button>

                                    <button className="btn-page" onClick={() => navigate("/liners")}>
                                        Volver
                                    </button>
                                </div>
                            </div>

                            <div className="row g-4">
                                <div className="col-lg-8">
                                    <div className="table-card">
                                        <div className="table-card-header">
                                            <h6>Información general</h6>
                                        </div>

                                        <div className="p-4">
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <p className="mb-1 text-muted small">ID</p>
                                                    <p className="mb-0 fw-semibold">{liner.id}</p>
                                                </div>

                                                <div className="col-md-4">
                                                    <p className="mb-1 text-muted small">Nombre</p>
                                                    <p className="mb-0 fw-semibold">{liner.nombre}</p>
                                                </div>

                                                <div className="col-md-4">
                                                    <p className="mb-1 text-muted small">Email</p>
                                                    <p className="mb-0 fw-semibold">{liner.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4">
                                    <div className="table-card">
                                        <div className="table-card-header">
                                            <h6>Foto</h6>
                                        </div>

                                        <div className="p-4">
                                            {liner.foto ? (
                                                <img
                                                    src={liner.foto}
                                                    alt="Foto del liner"
                                                    className="img-fluid rounded"
                                                    style={{
                                                        width: "100%",
                                                        maxHeight: "260px",
                                                        objectFit: "cover",
                                                        border: "1px solid var(--border)"
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded"
                                                    style={{
                                                        height: "220px",
                                                        background: "#f8fafc",
                                                        border: "1px solid var(--border)",
                                                        color: "var(--text-muted)"
                                                    }}
                                                >
                                                    Sin foto cargada
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};