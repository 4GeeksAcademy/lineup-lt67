import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const Liners = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store, dispatch } = useGlobalReducer();
    const [error, setError] = useState("");

    function getLiners() {
        fetch(`${backendUrl}/api/liners`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                dispatch({ type: "set_liners_list", payload: data });
            })
            .catch((err) => {
                setError("No se pudieron cargar los liners");
                console.error(err);
            });
    }

    function deleteLiner(id) {
        fetch(`${backendUrl}/api/liners/${id}`, { method: "DELETE" })
            .then(async (resp) => {
                if (!resp.ok) {
                    let data = {};
                    try {
                        data = await resp.json();
                    } catch {
                        data = {};
                    }
                    throw new Error(data.msg || "No se pudo borrar el liner");
                }
                getLiners();
            })
            .catch((err) => {
                alert(err.message || "Ocurrió un error al borrar el liner");
            });
    }

    useEffect(() => {
        getLiners();
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
                                Liners
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Gestión completa de liners registrados en la plataforma.
                            </p>
                        </div>

                        <Link to="/add_liner">
                            <button className="btn-export">
                                <i className="bi bi-plus-circle"></i>
                                Nuevo liner
                            </button>
                        </Link>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    Total de liners
                                </div>
                                <div className="stat-value">{store.liners.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-person-badge"></i>
                                        Usuarios activos
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
                            {store.liners.length === 0 ? (
                                <div className="text-muted p-2">No hay liners cargados.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Foto</th>
                                                <th className="text-end">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store.liners.map((liner) => (
                                                <tr key={liner.id}>
                                                    <td>{liner.id}</td>
                                                    <td className="fw-semibold">{liner.nombre}</td>
                                                    <td>{liner.email}</td>
                                                    <td>{liner.foto ? "Sí" : "No"}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                                                            <Link to={`/liners/${liner.id}`}>
                                                                <button className="btn-page">Ver</button>
                                                            </Link>

                                                            <Link to={`/liners/edit/${liner.id}`}>
                                                                <button className="btn-details">Editar</button>
                                                            </Link>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteLiner(liner.id)}
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