import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const Clientes = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store, dispatch } = useGlobalReducer();

    function getClients() {
        fetch(`${backendUrl}/api/clients`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                dispatch({ type: "set_clients_list", payload: data });
            })
            .catch((error) => {
                console.error("Error cargando clientes:", error);
            });
    }

    function deleteClient(id) {
        fetch(`${backendUrl}/api/clients/${id}`, { method: "DELETE" })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("No se pudo borrar el cliente");
                }
                getClients();
            })
            .catch((error) => {
                console.error("Error borrando cliente:", error);
                alert("No se pudo borrar el cliente");
            });
    }

    useEffect(() => {
        getClients();
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
                                Clientes
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Gestión completa de clientes registrados en la plataforma.
                            </p>
                        </div>

                        <Link to="/add_client">
                            <button className="btn-export">
                                <i className="bi bi-plus-circle"></i>
                                Nuevo cliente
                            </button>
                        </Link>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    Total de clientes
                                </div>
                                <div className="stat-value">{store.clients.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-people"></i>
                                        Registros activos
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-card">
                        <div className="table-card-header">
                            <h6>Listado completo</h6>
                        </div>

                        <div className="p-3">
                            {store.clients.length === 0 ? (
                                <div className="text-muted p-2">
                                    No hay clientes cargados.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Dirección</th>
                                                <th>Creado</th>
                                                <th className="text-end">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store.clients.map((client) => (
                                                <tr key={client.id}>
                                                    <td>{client.id}</td>
                                                    <td className="fw-semibold">{client.full_name}</td>
                                                    <td>{client.email}</td>
                                                    <td>{client.address || "No especificada"}</td>
                                                    <td>
                                                        {client.created_at
                                                            ? new Date(client.created_at).toLocaleDateString()
                                                            : "-"}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                                                            <Link to={`/clients/${client.id}`}>
                                                                <button className="btn-page">
                                                                    Ver
                                                                </button>
                                                            </Link>

                                                            <Link to={`/clients/edit/${client.id}`}>
                                                                <button className="btn-details">
                                                                    Editar
                                                                </button>
                                                            </Link>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteClient(client.id)}
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