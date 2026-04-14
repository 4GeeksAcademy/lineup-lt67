import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const PropuestaForm = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [listaServicios, setListaServicios] = useState([]);
    const [listaLiners, setListaLiners] = useState([]);
    const [idServicio, setIdServicio] = useState("");
    const [idLiner, setIdLiner] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [precio, setPrecio] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            servicio_id: idServicio,
            liner_id: idLiner,
            mensaje: mensaje,
            precio: precio
        };

        fetch(`${backendUrl}/api/propuestas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(async (resp) => {
                const responseData = await resp.json();

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo crear la propuesta");
                }

                navigate("/propuestas");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al crear la propuesta");
            });
    }

    useEffect(() => {
        fetch(`${backendUrl}/api/servicios`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                setListaServicios(data);
            })
            .catch((err) => {
                console.error(err);
            });

        fetch(`${backendUrl}/api/liners`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                setListaLiners(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [backendUrl]);

    return (
        <div className="container-fluid px-0">
            <AdminNavbar />
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Nueva propuesta
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Crear una nueva propuesta manualmente desde el panel administrativo.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Datos de la propuesta</h6>
                                </div>

                                <div className="p-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Servicio</label>
                                            <select
                                                className="form-select"
                                                value={idServicio}
                                                onChange={(e) => setIdServicio(e.target.value)}
                                                required
                                            >
                                                <option value="">Seleccione el servicio</option>
                                                {listaServicios.map((servicio) => (
                                                    <option value={servicio.id} key={servicio.id}>
                                                        {servicio.id}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Liner</label>
                                            <select
                                                className="form-select"
                                                value={idLiner}
                                                onChange={(e) => setIdLiner(e.target.value)}
                                                required
                                            >
                                                <option value="">Seleccione el liner</option>
                                                {listaLiners.map((liner) => (
                                                    <option value={liner.id} key={liner.id}>
                                                        {liner.nombre}
                                                    </option>
                                                ))}
                                            </select>
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
                                                value="pendiente"
                                                disabled
                                            />
                                        </div>

                                        {error && <p className="text-danger small">{error}</p>}

                                        <div className="d-flex gap-2 flex-wrap mt-4">
                                            <button type="submit" className="btn-export">
                                                <i className="bi bi-check-circle"></i>
                                                Crear propuesta
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
                                    <h6>Resumen</h6>
                                </div>

                                <div className="p-4">
                                    <div className="d-flex flex-column gap-3">
                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Servicio</div>
                                            <div>{idServicio || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Liner</div>
                                            <div>{idLiner || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Precio</div>
                                            <div>{precio || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Estado</div>
                                            <div>pendiente</div>
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