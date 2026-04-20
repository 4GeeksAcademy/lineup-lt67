import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const TipoDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const navigate = useNavigate();

    const [tipo, setTipo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${backendUrl}/api/tipos/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar el tipo");
                }

                setTipo(data);
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar el tipo");
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
                                <h6>Cargando tipo...</h6>
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

                    {!loading && !error && tipo && (
                        <>
                            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                                <div>
                                    <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                        Tipo #{tipo.id}
                                    </h5>
                                    <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                        Detalle completo de la categoría.
                                    </p>
                                </div>

                                <div className="d-flex gap-2 flex-wrap">
                                    <button
                                        className="btn-details"
                                        onClick={() => navigate(`/tipos/edit/${tipo.id}`)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn-page"
                                        onClick={() => navigate("/tipos")}
                                    >
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
                                        <div className="col-md-4">
                                            <p className="mb-1 text-muted small">ID</p>
                                            <p className="mb-0 fw-semibold">{tipo.id}</p>
                                        </div>

                                        <div className="col-md-8">
                                            <p className="mb-1 text-muted small">Nombre</p>
                                            <p className="mb-0 fw-semibold">{tipo.nombre}</p>
                                        </div>

                                        <div className="col-12">
                                            <p className="mb-1 text-muted small">Descripción</p>
                                            <p className="mb-0 fw-semibold">
                                                {tipo.descripcion || "Sin descripción"}
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