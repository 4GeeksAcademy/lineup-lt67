import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const TicketDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const navigate = useNavigate();

    const [idCliente, setIdCliente] = useState("");
    const [idSucursal, setIdSucursal] = useState("");
    const [estado, setEstado] = useState("");
    const [posicion, setPosicion] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${backendUrl}/api/tickets/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar el ticket");
                }

                setIdCliente(data.id_cliente);
                setIdSucursal(data.id_sucursal);
                setEstado(data.estado);
                setPosicion(data.posicion);
                setDate(data.created_at);
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar el ticket");
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
                                <h6>Cargando ticket...</h6>
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

                    {!loading && !error && (
                        <>
                            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                                <div>
                                    <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                        Ticket #{id}
                                    </h5>
                                    <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                        Vista detallada del ticket.
                                    </p>
                                </div>

                                <div className="d-flex gap-2 flex-wrap">
                                    <button
                                        className="btn-details"
                                        onClick={() => navigate(`/tickets/edit/${id}`)}
                                    >
                                        Editar
                                    </button>

                                    <button className="btn-page" onClick={() => navigate("/tickets")}>
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
                                            <p className="mb-1 text-muted small">ID Cliente</p>
                                            <p className="mb-0 fw-semibold">{idCliente}</p>
                                        </div>

                                        <div className="col-md-3">
                                            <p className="mb-1 text-muted small">ID Sucursal</p>
                                            <p className="mb-0 fw-semibold">{idSucursal}</p>
                                        </div>

                                        <div className="col-md-3">
                                            <p className="mb-1 text-muted small">Estado</p>
                                            <p className="mb-0 fw-semibold">{estado}</p>
                                        </div>

                                        <div className="col-md-3">
                                            <p className="mb-1 text-muted small">Posición</p>
                                            <p className="mb-0 fw-semibold">{posicion}</p>
                                        </div>

                                        <div className="col-12">
                                            <p className="mb-1 text-muted small">Fecha de creación</p>
                                            <p className="mb-0 fw-semibold">
                                                {date ? new Date(date).toLocaleString() : ""}
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