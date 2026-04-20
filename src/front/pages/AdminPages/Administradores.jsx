import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const Administradores = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store, dispatch } = useGlobalReducer();
    const [error, setError] = useState("");

    function getAdministradores() {
        fetch(`${backendUrl}/api/administrador`)
            .then((response) => {
                if (!response.ok) throw new Error(response.status);
                return response.json();
            })
            .then((data) => {
                dispatch({ type: "set_administradores", payload: data });
            })
            .catch((err) => {
                setError("No se pudieron cargar los administradores");
                console.error(err);
            });
    }

    function deleteAdmin(id) {
        fetch(`${backendUrl}/api/administrador/${id}`, { method: "DELETE" })
            .then(async (resp) => {
                if (!resp.ok) {
                    let data = {};
                    try { data = await resp.json(); } catch { data = {}; }
                    throw new Error(data.msg || "No se pudo borrar el administrador");
                }
                getAdministradores();
            })
            .catch((err) => {
                alert(err.message || "Ocurrió un error al borrar el administrador");
            });
    }

    useEffect(() => {
        getAdministradores();
    }, []);

    return (
        <div className="page-body">
            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                <div>
                    <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>Administradores</h5>
                    <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>Gestión completa de usuarios con permisos administrativos.</p>
                </div>
                <Link to="/add_admin">
                    <button className="btn-export">
                        <i className="bi bi-plus-circle"></i>
                        Nuevo administrador
                    </button>
                </Link>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-lg-4">
                    <div className="stat-card">
                        <div className="stat-label">
                            <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                            Total de administradores
                        </div>
                        <div className="stat-value">{store.administradores.length}</div>
                        <span className="stat-badge">
                            <i className="bi bi-shield-lock"></i>
                            Usuarios del panel
                        </span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="table-card mb-4">
                    <div className="table-card-header"><h6>Error</h6></div>
                    <div className="p-4 text-danger">{error}</div>
                </div>
            )}

            <div className="table-card">
                <div className="table-card-header">
                    <h6>Listado completo</h6>
                </div>
                <div className="p-3">
                    {store.administradores.length === 0 ? (
                        <div className="text-muted p-2">No hay administradores cargados.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store.administradores.map((admin) => (
                                        <tr key={admin.id}>
                                            <td>{admin.id}</td>
                                            <td className="fw-semibold">{admin.name}</td>
                                            <td>{admin.email}</td>
                                            <td>
                                                <div className="d-flex justify-content-end gap-2 flex-wrap">
                                                    <Link to={`/administradores/${admin.id}`}>
                                                        <button className="btn-page">Ver</button>
                                                    </Link>
                                                    <Link to={`/administradores/edit/${admin.id}`}>
                                                        <button className="btn-details">Editar</button>
                                                    </Link>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteAdmin(admin.id)}>
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
    );
};
