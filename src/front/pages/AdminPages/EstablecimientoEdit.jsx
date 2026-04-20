import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const EstablecimientoEdit = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [tipoId, setTipoId] = useState("");
    const [totalSucursales, setTotalSucursales] = useState(0);
    const [password, setPassword] = useState("");
    const [logo, setLogo] = useState("");
    const [tipos, setTipos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${backendUrl}/api/tipos`)
            .then((r) => {
                if (!r.ok) throw new Error("No se pudieron cargar los tipos");
                return r.json();
            })
            .then((data) => setTipos(data))
            .catch((err) => {
                console.error(err);
                setTipos([]);
            });
    }, [backendUrl]);

    useEffect(() => {
        fetch(`${backendUrl}/api/establecimientos/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar el establecimiento");
                }

                setNombre(data.nombre || "");
                setTipoId(data.tipo_id != null ? String(data.tipo_id) : "");
                setTotalSucursales(data.total_sucursales ?? 0);
                setPassword(data.password || "");
                setLogo(data.logo || "");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar el establecimiento");
            });
    }, [backendUrl, id]);

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            nombre: nombre.trim(),
            tipo_id: Number(tipoId),
            total_sucursales: Number(totalSucursales) || 0,
            password: password.trim(),
            logo: logo.trim() || null,
        };

        fetch(`${backendUrl}/api/establecimientos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then(async (resp) => {
                let responseData = {};
                try {
                    responseData = await resp.json();
                } catch {
                    responseData = {};
                }

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo guardar el establecimiento");
                }

                navigate("/establecimientos");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al guardar el establecimiento");
            });
    }

    function borrar() {
        fetch(`${backendUrl}/api/establecimientos/${id}`, { method: "DELETE" })
            .then(async (resp) => {
                let responseData = {};
                try {
                    responseData = await resp.json();
                } catch {
                    responseData = {};
                }

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo borrar el establecimiento");
                }

                navigate("/establecimientos");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al borrar el establecimiento");
            });
    }

    return (
        <div className="container-fluid px-0">
             
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Editar establecimiento
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Modificá los datos del establecimiento desde el panel administrativo.
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
                                            <label className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Tipo</label>
                                            <select
                                                className="form-select"
                                                value={tipoId}
                                                onChange={(e) => setTipoId(e.target.value)}
                                                required
                                            >
                                                <option value="">Selecciona un tipo</option>
                                                {tipos.map((t) => (
                                                    <option key={t.id} value={t.id}>
                                                        {t.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Total sucursales</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min={0}
                                                value={totalSucursales}
                                                onChange={(e) => setTotalSucursales(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Password</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Logo (URL)</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                placeholder="https://..."
                                                value={logo}
                                                onChange={(e) => setLogo(e.target.value)}
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
                                                onClick={borrar}
                                                className="btn btn-outline-danger"
                                            >
                                                Borrar establecimiento
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-page"
                                                onClick={() => navigate("/establecimientos")}
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
                                    {logo ? (
                                        <img
                                            src={logo}
                                            alt={nombre || "Logo establecimiento"}
                                            className="img-fluid rounded mb-3"
                                            style={{
                                                width: "100%",
                                                maxHeight: "220px",
                                                objectFit: "contain",
                                                border: "1px solid var(--border)",
                                                background: "#fff",
                                                padding: "10px"
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded mb-3"
                                            style={{
                                                height: "200px",
                                                background: "#f8fafc",
                                                border: "1px solid var(--border)",
                                                color: "var(--text-muted)"
                                            }}
                                        >
                                            Sin logo
                                        </div>
                                    )}

                                    <div className="d-flex flex-column gap-3">
                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Nombre</div>
                                            <div>{nombre || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Tipo</div>
                                            <div>{tipoId || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Sucursales</div>
                                            <div>{totalSucursales || 0}</div>
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