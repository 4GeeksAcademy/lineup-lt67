import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const EstablecimientoForm = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [nombre, setNombre] = useState("");
    const [tipoId, setTipoId] = useState("");
    const [totalSucursales, setTotalSucursales] = useState(0);
    const [password, setPassword] = useState("");
    const [logoFile, setLogoFile] = useState(null);
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

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const formData = new FormData();
        formData.append("nombre", nombre.trim());
        formData.append("tipo_id", tipoId);
        formData.append("total_sucursales", totalSucursales || 0);
        formData.append("password", password.trim());

        if (logoFile) {
            formData.append("logo", logoFile);
        }

        fetch(`${backendUrl}/api/establecimientos`, {
            method: "POST",
            body: formData,
        })
            .then(async (resp) => {
                if (!resp.ok) {
                    let data = {};
                    try {
                        data = await resp.json();
                    } catch {
                        data = {};
                    }
                    throw new Error(data.msg || "No se pudo crear el establecimiento");
                }

                navigate("/establecimientos");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al crear el establecimiento");
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
                                Nuevo establecimiento
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Crear un nuevo establecimiento y vincularlo a un tipo.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Datos del establecimiento</h6>
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
                                                type="password"
                                                className="form-control"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Logo (Imagen)</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="form-control"
                                                onChange={(e) => setLogoFile(e.target.files[0])}
                                            />
                                        </div>

                                        {error && <p className="text-danger small">{error}</p>}

                                        <div className="d-flex gap-2 flex-wrap mt-4">
                                            <button type="submit" className="btn-export">
                                                <i className="bi bi-check-circle"></i>
                                                Crear establecimiento
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
                                    <h6>Resumen</h6>
                                </div>

                                <div className="p-4">
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

                                    {logoFile && (
                                        <div className="mt-3">
                                            <p className="text-muted small mb-2">Logo seleccionado</p>
                                            <div className="stat-card" style={{ padding: "1rem" }}>
                                                {logoFile.name}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};