import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const EstablecimientoDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [nombre, setNombre] = useState("");
    const [tipoNombre, setTipoNombre] = useState("");
    const [totalSucursales, setTotalSucursales] = useState("");
    const [clave, setClave] = useState("");
    const [logo, setLogo] = useState("");
    const [sucursales, setSucursales] = useState([]);
    const [error, setError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${backendUrl}/api/establecimientos/${id}`)
            .then((resp) => {
                if (!resp.ok) throw new Error("No se pudo cargar el establecimiento");
                return resp.json();
            })
            .then((data) => {
                setNombre(data.nombre || "");
                setTipoNombre(data.tipo_nombre || "—");
                setTotalSucursales(
                    data.total_sucursales != null ? String(data.total_sucursales) : ""
                );
                setClave(data.clave || "");
                setLogo(data.logo || "");
            })
            .catch((err) => {
                console.error(err);
                setError("No se pudo cargar el establecimiento");
                setNombre("");
                setTipoNombre("—");
                setTotalSucursales("");
                setClave("");
                setLogo("");
            });

        fetch(`${backendUrl}/api/establecimientos/${id}/sucursales`)
            .then((resp) => {
                if (!resp.ok) throw new Error("No se pudieron cargar las sucursales");
                return resp.json();
            })
            .then((data) => setSucursales(data))
            .catch((err) => {
                console.error(err);
                setSucursales([]);
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
                                Establecimiento {nombre || `#${id}`}
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Detalle del establecimiento y administración de sus sucursales.
                            </p>
                        </div>

                        <div className="d-flex gap-2 flex-wrap">
                            <button
                                className="btn-details"
                                onClick={() => navigate(`/establecimientos/${id}`)}
                            >
                                Editar
                            </button>

                            <button
                                className="btn-page"
                                onClick={() => navigate("/establecimientos")}
                            >
                                Volver
                            </button>
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

                    <div className="row g-4 mb-4">
                        <div className="col-lg-8">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Información general</h6>
                                </div>

                                <div className="p-4">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <p className="mb-1 text-muted small">Nombre</p>
                                            <p className="mb-0 fw-semibold">{nombre || "—"}</p>
                                        </div>

                                        <div className="col-md-6">
                                            <p className="mb-1 text-muted small">Tipo</p>
                                            <p className="mb-0 fw-semibold">{tipoNombre}</p>
                                        </div>

                                        <div className="col-md-6">
                                            <p className="mb-1 text-muted small">Total sucursales</p>
                                            <p className="mb-0 fw-semibold">{totalSucursales || "0"}</p>
                                        </div>

                                        <div className="col-md-6">
                                            <p className="mb-1 text-muted small">Clave</p>
                                            <p className="mb-0 fw-semibold">{clave || "—"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Logo</h6>
                                </div>

                                <div className="p-4">
                                    {logo ? (
                                        <img
                                            src={logo}
                                            alt={nombre}
                                            className="img-fluid rounded"
                                            style={{
                                                width: "100%",
                                                maxHeight: "240px",
                                                objectFit: "contain",
                                                border: "1px solid var(--border)",
                                                background: "#fff",
                                                padding: "10px"
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded"
                                            style={{
                                                height: "220px",
                                                background: "#f8fafc",
                                                border: "1px solid var(--border)",
                                                color: "var(--text-muted)"
                                            }}
                                        >
                                            Sin logo
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-card">
                        <div className="table-card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Sucursales</h6>

                            <Link to={`/sucursal/adm/nueva?id_establecimiento=${id}`}>
                                <button className="btn-export">
                                    <i className="bi bi-plus-circle"></i>
                                    Nueva sucursal
                                </button>
                            </Link>
                        </div>

                        <div className="p-3">
                            {sucursales.length === 0 ? (
                                <div className="text-muted p-2">No hay sucursales.</div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {sucursales.map((s) => (
                                        <div
                                            className="stat-card"
                                            style={{ padding: "1rem" }}
                                            key={s.id}
                                        >
                                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                                    {s.imagen ? (
                                                        <img
                                                            src={s.imagen}
                                                            alt={s.nombre}
                                                            style={{
                                                                width: "70px",
                                                                height: "70px",
                                                                objectFit: "cover",
                                                                borderRadius: "12px",
                                                                border: "1px solid var(--border)"
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                width: "70px",
                                                                height: "70px",
                                                                backgroundColor: "#e9ecef",
                                                                borderRadius: "12px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "#6b7280",
                                                                fontSize: ".75rem"
                                                            }}
                                                        >
                                                            Sin img
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h6 className="mb-1 fw-bold">{s.nombre}</h6>
                                                        <p className="mb-1 text-muted" style={{ fontSize: ".84rem" }}>
                                                            Capacidad: {s.capacidad ?? "—"} · Tiempo por cliente: {s.tiempo_por_cliente ?? "—"} min
                                                        </p>
                                                        <p className="mb-0 text-muted" style={{ fontSize: ".82rem" }}>
                                                            Fila activa: {s.fila_activa ? "Sí" : "No"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-2">
                                                    <Link to={`/sucursal/adm/edit/${s.id}`}>
                                                        <button className="btn-details">Editar</button>
                                                    </Link>
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