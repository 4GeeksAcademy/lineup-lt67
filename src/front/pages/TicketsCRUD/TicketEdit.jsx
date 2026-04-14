import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const TicketEdit = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [idCliente, setIdCliente] = useState("");
    const [idSucursal, setIdSucursal] = useState("");
    const [estado, setEstado] = useState("");
    const [posicion, setPosicion] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            estado: estado
        };

        fetch(`${backendUrl}/api/tickets/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(async (resp) => {
                const responseData = await resp.json();

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo editar el ticket");
                }

                navigate("/tickets");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al editar el ticket");
            });
    }

    function deleteTicket() {
        fetch(`${backendUrl}/api/tickets/${id}`, { method: "DELETE" })
            .then(async (resp) => {
                if (!resp.ok) {
                    let data = {};
                    try {
                        data = await resp.json();
                    } catch {
                        data = {};
                    }
                    throw new Error(data.msg || "No se pudo borrar el ticket");
                }

                navigate("/tickets");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al borrar el ticket");
            });
    }

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
            });
    }, [backendUrl, id]);

    return (
        <div className="container-fluid px-0">
            <AdminNavbar />
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Editar ticket
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Modificá el estado del ticket desde el panel administrativo.
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
                                            <label className="form-label">ID Cliente</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={idCliente}
                                                disabled
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">ID Sucursal</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={idSucursal}
                                                disabled
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Estado</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={estado}
                                                onChange={(e) => setEstado(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Posición</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={posicion}
                                                disabled
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Fecha de creación</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={date ? new Date(date).toLocaleString() : ""}
                                                disabled
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
                                                onClick={deleteTicket}
                                            >
                                                Borrar ticket
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-page"
                                                onClick={() => navigate("/tickets")}
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
                                            <div className="stat-label">Cliente</div>
                                            <div>{idCliente || "-"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Sucursal</div>
                                            <div>{idSucursal || "-"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Estado</div>
                                            <div>{estado || "-"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Posición</div>
                                            <div>{posicion || "-"}</div>
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