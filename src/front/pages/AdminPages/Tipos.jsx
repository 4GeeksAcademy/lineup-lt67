import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const Tipos = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [tipos, setTipos] = useState([]);
    const [error, setError] = useState("");

    const getTipos = async () => {
        try {
            setError("");

            const resp = await fetch(`${backendUrl}/api/tipos`);
            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudieron cargar los tipos");
            }

            setTipos(data);
        } catch (err) {
            setError(err.message || "Ocurrió un error al cargar los tipos");
        }
    };

    const deleteTipo = async (id) => {
        try {
            const resp = await fetch(`${backendUrl}/api/tipos/${id}`, {
                method: "DELETE"
            });

            if (!resp.ok) {
                let data = {};
                try {
                    data = await resp.json();
                } catch {
                    data = {};
                }
                throw new Error(data.msg || "No se pudo borrar el tipo");
            }

            await getTipos();
        } catch (err) {
            alert(err.message || "Ocurrió un error al borrar el tipo");
        }
    };

    useEffect(() => {
        getTipos();
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
                                Tipos
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Gestión de categorías para establecimientos.
                            </p>
                        </div>

                        <Link to="/add_tipo">
                            <button className="btn-export">
                                <i className="bi bi-plus-circle"></i>
                                Nuevo tipo
                            </button>
                        </Link>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    Total de tipos
                                </div>
                                <div className="stat-value">{tipos.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-tags"></i>
                                        Categorías registradas
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
                            {tipos.length === 0 ? (
                                <div className="text-muted p-2">
                                    No hay tipos cargados.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Descripción</th>
                                                <th className="text-end">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tipos.map((tipo) => (
                                                <tr key={tipo.id}>
                                                    <td>{tipo.id}</td>
                                                    <td className="fw-semibold">{tipo.nombre}</td>
                                                    <td>{tipo.descripcion || "Sin descripción"}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                                                            <Link to={`/tipos/${tipo.id}`}>
                                                                <button className="btn-page">
                                                                    Ver
                                                                </button>
                                                            </Link>

                                                            <Link to={`/tipos/edit/${tipo.id}`}>
                                                                <button className="btn-details">
                                                                    Editar
                                                                </button>
                                                            </Link>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteTipo(tipo.id)}
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