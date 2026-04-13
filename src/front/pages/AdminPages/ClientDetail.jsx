import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const ClientDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${backendUrl}/api/clients/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar el cliente");
                }

                setClient(data);
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar el cliente");
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
                                <h6>Cargando cliente...</h6>
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

                    {!loading && !error && client && (
                        <>
                            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                                <div>
                                    <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                        Cliente #{client.id}
                                    </h5>
                                    <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                        Vista detallada del cliente registrado en el sistema.
                                    </p>
                                </div>

                                <div className="d-flex gap-2 flex-wrap">
                                    <button
                                        className="btn-details"
                                        onClick={() => navigate(`/clients/edit/${client.id}`)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn-page"
                                        onClick={() => navigate("/clients")}
                                    >
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
                                                <div className="col-md-6">
                                                    <p className="mb-1 text-muted small">Nombre completo</p>
                                                    <p className="mb-0 fw-semibold">{client.full_name}</p>
                                                </div>

                                                <div className="col-md-6">
                                                    <p className="mb-1 text-muted small">Email</p>
                                                    <p className="mb-0 fw-semibold">{client.email}</p>
                                                </div>

                                                <div className="col-md-6">
                                                    <p className="mb-1 text-muted small">Dirección</p>
                                                    <p className="mb-0 fw-semibold">
                                                        {client.address || "No especificada"}
                                                    </p>
                                                </div>

                                                <div className="col-md-3">
                                                    <p className="mb-1 text-muted small">Latitud</p>
                                                    <p className="mb-0 fw-semibold">
                                                        {client.lat ?? "-"}
                                                    </p>
                                                </div>

                                                <div className="col-md-3">
                                                    <p className="mb-1 text-muted small">Longitud</p>
                                                    <p className="mb-0 fw-semibold">
                                                        {client.lng ?? "-"}
                                                    </p>
                                                </div>

                                                <div className="col-12">
                                                    <p className="mb-1 text-muted small">Fecha de creación</p>
                                                    <p className="mb-0 fw-semibold">
                                                        {client.created_at
                                                            ? new Date(client.created_at).toLocaleString()
                                                            : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4">
                                    <div className="table-card">
                                        <div className="table-card-header">
                                            <h6>Perfil</h6>
                                        </div>

                                        <div className="p-4">
                                            {client.profile_image_url ? (
                                                <img
                                                    src={client.profile_image_url}
                                                    alt="Perfil del cliente"
                                                    className="img-fluid rounded mb-3"
                                                    style={{
                                                        width: "100%",
                                                        maxHeight: "260px",
                                                        objectFit: "cover",
                                                        border: "1px solid var(--border)"
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded mb-3"
                                                    style={{
                                                        height: "220px",
                                                        background: "#f8fafc",
                                                        border: "1px solid var(--border)",
                                                        color: "var(--text-muted)"
                                                    }}
                                                >
                                                    Sin imagen de perfil
                                                </div>
                                            )}

                                            <div className="stat-card" style={{ padding: "1rem" }}>
                                                <div className="stat-label">
                                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                                    ID de cliente
                                                </div>
                                                <div style={{ fontSize: "1rem", fontWeight: 600 }}>
                                                    {client.id}
                                                </div>
                                            </div>
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