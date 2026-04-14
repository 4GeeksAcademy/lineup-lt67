import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const PropuestaEdit = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [idServicio, setIdServicio] = useState("");
    const [idLiner, setIdLiner] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [precio, setPrecio] = useState("");
    const [estado, setEstado] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            mensaje: mensaje,
            precio: precio,
            estado: estado
        };

        fetch(`${backendUrl}/api/propuestas/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(async (resp) => {
                const responseData = await resp.json();

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo editar la propuesta");
                }

                navigate("/propuestas");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al editar la propuesta");
            });
    }

    function deletePropuesta() {
        fetch(`${backendUrl}/api/propuestas/${id}`, { method: "DELETE" })
            .then(async (resp) => {
                if (!resp.ok) {
                    let data = {};
                    try {
                        data = await resp.json();
                    } catch {
                        data = {};
                    }
                    throw new Error(data.msg || "No se pudo borrar la propuesta");
                }

                navigate("/propuestas");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al borrar la propuesta");
            });
    }

    useEffect(() => {
        fetch(`${backendUrl}/api/propuestas/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar la propuesta");
                }

                setIdServicio(data.servicio_id);
                setIdLiner(data.liner_id);
                setMensaje(data.mensaje);
                setPrecio(data.precio);
                setEstado(data.estado);
                setDate(data.created_at);
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar la propuesta");
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
                                Editar propuesta
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Modificá los datos de la propuesta desde el panel administrativo.
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
                                            <label className="form-label">ID Servicio</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={idServicio}
                                                disabled
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">ID Liner</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={idLiner}
                                                disabled
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Mensaje</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={mensaje}
                                                onChange={(e) => setMensaje(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Precio</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={precio}
                                                onChange={(e) => setPrecio(e.target.value)}
                                                required
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
                                                onClick={deletePropuesta}
                                            >
                                                Borrar propuesta
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-page"
                                                onClick={() => navigate("/propuestas")}
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
                                            <div className="stat-label">Servicio</div>
                                            <div>{idServicio || "-"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Liner</div>
                                            <div>{idLiner || "-"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Precio</div>
                                            <div>{precio || "-"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Estado</div>
                                            <div>{estado || "-"}</div>
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