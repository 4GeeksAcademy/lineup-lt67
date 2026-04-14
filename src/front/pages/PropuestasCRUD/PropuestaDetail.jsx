import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const PropuestaDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [propuesta, setPropuesta] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${backendUrl}/api/propuestas/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar la propuesta");
                }

                setPropuesta(data);
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar la propuesta");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [backendUrl, id]);

    return (
        <div className="container-fluid px-0">
            <AdminNavbar />
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    {loading && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Cargando propuesta...</h6>
                            </div>
                            <div className="p-4 text-muted">Esperá un momento.</div>
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

                    {!loading && !error && propuesta && (
                        <>
                            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                                <div>
                                    <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                        Propuesta #{id}
                                    </h5>
                                    <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                        Vista detallada de la propuesta.
                                    </p>
                                </div>

                                <div className="d-flex gap-2 flex-wrap">
                                    <button
                                        className="btn-details"
                                        onClick={() => navigate(`/propuestas/edit/${id}`)}
                                    >
                                        Editar
                                    </button>

                                    <button className="btn-page" onClick={() => navigate("/propuestas")}>
                                        Volver
                                    </button>
                                </div>
                            </div>

                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Información general</h6>
                                </div>

                                <div className="p-4">
                                    <div className="row g-3">
                                        <div className="col-md-3">
                                            <p className="mb-1 text-muted small">ID Servicio</p>
                                            <p className="mb-0 fw-semibold">{propuesta.servicio_id}</p>
                                        </div>

                                        <div className="col-md-3">
                                            <p className="mb-1 text-muted small">ID Liner</p>
                                            <p className="mb-0 fw-semibold">{propuesta.liner_id}</p>
                                        </div>

                                        <div className="col-md-3">
                                            <p className="mb-1 text-muted small">Precio</p>
                                            <p className="mb-0 fw-semibold">{propuesta.precio}</p>
                                        </div>

                                        <div className="col-md-3">
                                            <p className="mb-1 text-muted small">Estado</p>
                                            <p className="mb-0 fw-semibold">{propuesta.estado}</p>
                                        </div>

                                        <div className="col-12">
                                            <p className="mb-1 text-muted small">Mensaje</p>
                                            <p className="mb-0 fw-semibold">{propuesta.mensaje}</p>
                                        </div>

                                        <div className="col-12">
                                            <p className="mb-1 text-muted small">Fecha de creación</p>
                                            <p className="mb-0 fw-semibold">
                                                {propuesta.created_at ? new Date(propuesta.created_at).toLocaleString() : ""}
                                            </p>
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