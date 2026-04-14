import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const ServicioDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [servicio, setServicio] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${backendUrl}/api/servicios/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar el servicio");
                }

                setServicio(data);
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar el servicio");
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
                                <h6>Cargando servicio...</h6>
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

                    {!loading && !error && servicio && (
                        <>
                            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                                <div>
                                    <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                        Servicio #{servicio.id}
                                    </h5>
                                    <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                        Vista detallada del servicio.
                                    </p>
                                </div>

                                <div className="d-flex gap-2 flex-wrap">
                                    <button
                                        className="btn-details"
                                        onClick={() => navigate(`/servicios/edit/${servicio.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button className="btn-page" onClick={() => navigate("/servicios")}>
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
                                                    <p className="mb-0 fw-semibold">{servicio.id}</p>
                                                </div>

                                                <div className="col-md-4">
                                                    <p className="mb-1 text-muted small">Cliente</p>
                                                    <p className="mb-0 fw-semibold">{servicio.client_id ?? "-"}</p>
                                                </div>

                                                <div className="col-md-4">
                                                    <p className="mb-1 text-muted small">Estado</p>
                                                    <p className="mb-0 fw-semibold">{servicio.estado || "-"}</p>
                                                </div>

                                                <div className="col-12">
                                                    <p className="mb-1 text-muted small">Descripción</p>
                                                    <p className="mb-0 fw-semibold">{servicio.descripcion}</p>
                                                </div>

                                                <div className="col-md-6">
                                                    <p className="mb-1 text-muted small">Lugar</p>
                                                    <p className="mb-0 fw-semibold">{servicio.lugar || "-"}</p>
                                                </div>

                                                <div className="col-md-6">
                                                    <p className="mb-1 text-muted small">Urgencia</p>
                                                    <p className="mb-0 fw-semibold">{servicio.urgencia || "-"}</p>
                                                </div>

                                                <div className="col-md-4">
                                                    <p className="mb-1 text-muted small">Precio propuesto</p>
                                                    <p className="mb-0 fw-semibold">{servicio.precio_propuesto ?? "-"}</p>
                                                </div>

                                                <div className="col-md-4">
                                                    <p className="mb-1 text-muted small">Precio recomendado</p>
                                                    <p className="mb-0 fw-semibold">{servicio.precio_recomendado ?? "-"}</p>
                                                </div>

                                                <div className="col-md-4">
                                                    <p className="mb-1 text-muted small">Tiempo estimado</p>
                                                    <p className="mb-0 fw-semibold">{servicio.tiempo_estimado || "-"}</p>
                                                </div>

                                                <div className="col-12">
                                                    <p className="mb-1 text-muted small">Origen</p>
                                                    <p className="mb-0 fw-semibold">
                                                        {servicio.address_start || "-"} ({servicio.lat_start ?? "-"}, {servicio.lng_start ?? "-"})
                                                    </p>
                                                </div>

                                                <div className="col-12">
                                                    <p className="mb-1 text-muted small">Destino</p>
                                                    <p className="mb-0 fw-semibold">
                                                        {servicio.address_finish || "-"} ({servicio.lat_finish ?? "-"}, {servicio.lng_finish ?? "-"})
                                                    </p>
                                                </div>

                                                <div className="col-12">
                                                    <p className="mb-1 text-muted small">Creado</p>
                                                    <p className="mb-0 fw-semibold">
                                                        {servicio.created_at ? new Date(servicio.created_at).toLocaleString() : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4">
                                    <div className="table-card">
                                        <div className="table-card-header">
                                            <h6>Imagen</h6>
                                        </div>

                                        <div className="p-4">
                                            {servicio.image_url ? (
                                                <img
                                                    src={servicio.image_url}
                                                    alt="Servicio"
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
                                                    Sin imagen
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