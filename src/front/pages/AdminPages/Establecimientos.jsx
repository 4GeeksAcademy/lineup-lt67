import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const Establecimientos = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");

    function load() {
        fetch(`${backendUrl}/api/establecimientos`)
            .then((response) => {
                if (!response.ok) throw new Error(response.status);
                return response.json();
            })
            .then((data) => setItems(data))
            .catch((error) => {
                console.error(error);
                setError("No se pudieron cargar los establecimientos");
            });
    }

    function eliminar(id) {
        if (!window.confirm("¿Eliminar este establecimiento?")) return;

        fetch(`${backendUrl}/api/establecimientos/${id}`, { method: "DELETE" })
            .then(async (resp) => {
                if (!resp.ok) {
                    let data = {};
                    try {
                        data = await resp.json();
                    } catch {
                        data = {};
                    }
                    throw new Error(data.msg || "No se pudo eliminar el establecimiento");
                }
                load();
            })
            .catch((error) => {
                console.error(error);
                alert(error.message || "Ocurrió un error al eliminar el establecimiento");
            });
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="container-fluid px-0">
             
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Establecimientos
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Gestión completa de establecimientos y acceso a sus sucursales.
                            </p>
                        </div>

                        <Link to="/add_establecimiento">
                            <button className="btn-export">
                                <i className="bi bi-plus-circle"></i>
                                Nuevo establecimiento
                            </button>
                        </Link>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    Total de establecimientos
                                </div>
                                <div className="stat-value">{items.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-shop"></i>
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
                            {items.length === 0 ? (
                                <div className="text-muted p-2">No hay establecimientos cargados.</div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {items.map((e) => (
                                        <div
                                            className="stat-card"
                                            style={{ padding: "1rem 1rem" }}
                                            key={e.id}
                                        >
                                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                                    {e.logo ? (
                                                        <img
                                                            src={e.logo}
                                                            alt={e.nombre}
                                                            style={{
                                                                width: "64px",
                                                                height: "64px",
                                                                objectFit: "contain",
                                                                borderRadius: "12px",
                                                                border: "1px solid var(--border)",
                                                                background: "#fff",
                                                                padding: "6px"
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded"
                                                            style={{
                                                                width: "64px",
                                                                height: "64px",
                                                                background: "#f8fafc",
                                                                border: "1px solid var(--border)",
                                                                color: "var(--text-muted)",
                                                                fontSize: ".75rem"
                                                            }}
                                                        >
                                                            Sin logo
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h6 className="mb-1 fw-bold">{e.nombre}</h6>
                                                        <p className="mb-1 text-muted" style={{ fontSize: ".85rem" }}>
                                                            Tipo: {e.tipo_nombre || "—"}
                                                        </p>
                                                        <p className="mb-0 text-muted" style={{ fontSize: ".82rem" }}>
                                                            Sucursales: {e.total_sucursales ?? 0} · Clave: {e.clave || "—"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-2 flex-wrap">
                                                    <Link to={`/establecimientos/${e.id}/detalle`}>
                                                        <button className="btn-page">Detalle</button>
                                                    </Link>

                                                    <Link to={`/establecimientos/${e.id}`}>
                                                        <button className="btn-details">Editar</button>
                                                    </Link>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => eliminar(e.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};