import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const Servicios = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [listaServicios, setListaServicios] = useState([]);
    const [error, setError] = useState("");

    function getServicios() {
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
                setError("No se pudieron cargar los servicios");
                console.error(err);
            });
    }

    function deleteServicio(id) {
        fetch(`${backendUrl}/api/servicios/${id}`, { method: "DELETE" })
            .then(async (resp) => {
                if (!resp.ok) {
                    let data = {};
                    try {
                        data = await resp.json();
                    } catch {
                        data = {};
                    }
                    throw new Error(data.msg || "No se pudo borrar el servicio");
                }
                getServicios();
            })
            .catch((err) => {
                alert(err.message || "Ocurrió un error al borrar el servicio");
            });
    }

    useEffect(() => {
        getServicios();
    }, []);

    return (
        <div className="container-fluid px-0">
            <AdminNavbar />
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Servicios
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Gestión completa de servicios creados en la plataforma.
                            </p>
                        </div>

                        <Link to="/add_servicios">
                            <button className="btn-export">
                                <i className="bi bi-plus-circle"></i>
                                Nuevo servicio
                            </button>
                        </Link>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    Total de servicios
                                </div>
                                <div className="stat-value">{listaServicios.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-briefcase"></i>
                                        Registros disponibles
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="table-card mb-4">
                            <div className="table-card-header">
                                <h6>Error</h6>
                            </div>
                            <div className="p-4 text-danger">{error}</div>
                        </div>
                    )}

                    <div className="table-card">
                        <div className="table-card-header">
                            <h6>Listado completo</h6>
                        </div>

                        <div className="p-3">
                            {listaServicios.length === 0 ? (
                                <div className="text-muted p-2">No hay servicios cargados.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Cliente</th>
                                                <th>Descripción</th>
                                                <th>Urgencia</th>
                                                <th>Estado</th>
                                                <th>Origen</th>
                                                <th>Destino</th>
                                                <th className="text-end">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listaServicios.map((servicio) => (
                                                <tr key={servicio.id}>
                                                    <td>{servicio.id}</td>
                                                    <td>{servicio.client_id ?? "-"}</td>
                                                    <td className="fw-semibold">{servicio.descripcion}</td>
                                                    <td>{servicio.urgencia || "-"}</td>
                                                    <td>{servicio.estado || "-"}</td>
                                                    <td>{servicio.address_start || servicio.lugar || "-"}</td>
                                                    <td>{servicio.address_finish || "-"}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                                                            <Link to={`/servicios/${servicio.id}`}>
                                                                <button className="btn-page">Ver</button>
                                                            </Link>

                                                            <Link to={`/servicios/edit/${servicio.id}`}>
                                                                <button className="btn-details">Editar</button>
                                                            </Link>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteServicio(servicio.id)}
                                                            >
                                                                Borrar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};