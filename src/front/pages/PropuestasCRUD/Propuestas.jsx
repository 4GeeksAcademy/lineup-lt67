import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const Propuestas = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [listaPropuestas, setListaPropuestas] = useState([]);
    const [error, setError] = useState("");

    function getPropuestas() {
        fetch(`${backendUrl}/api/propuestas`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                setListaPropuestas(data);
            })
            .catch((err) => {
                setError("No se pudieron cargar las propuestas");
                console.error(err);
            });
    }

    function deletePropuesta(id) {
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
                getPropuestas();
            })
            .catch((err) => {
                alert(err.message || "Ocurrió un error al borrar la propuesta");
            });
    }

    useEffect(() => {
        getPropuestas();
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
                                Propuestas
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Gestión completa de propuestas enviadas por los liners.
                            </p>
                        </div>

                        <Link to="/add_propuestas">
                            <button className="btn-export">
                                <i className="bi bi-plus-circle"></i>
                                Nueva propuesta
                            </button>
                        </Link>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    Total de propuestas
                                </div>
                                <div className="stat-value">{listaPropuestas.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-chat-left-text"></i>
                                        Registros activos
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
                            {listaPropuestas.length === 0 ? (
                                <div className="text-muted p-2">No hay propuestas cargadas.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Servicio</th>
                                                <th>Liner</th>
                                                <th>Precio</th>
                                                <th>Estado</th>
                                                <th>Mensaje</th>
                                                <th className="text-end">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listaPropuestas.map((propuesta) => (
                                                <tr key={propuesta.id}>
                                                    <td>{propuesta.id}</td>
                                                    <td>{propuesta.servicio_id}</td>
                                                    <td>{propuesta.liner_id}</td>
                                                    <td>{propuesta.precio}</td>
                                                    <td>{propuesta.estado}</td>
                                                    <td>{propuesta.mensaje}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                                                            <Link to={`/propuestas/${propuesta.id}`}>
                                                                <button className="btn-page">Ver</button>
                                                            </Link>

                                                            <Link to={`/propuestas/edit/${propuesta.id}`}>
                                                                <button className="btn-details">Editar</button>
                                                            </Link>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deletePropuesta(propuesta.id)}
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