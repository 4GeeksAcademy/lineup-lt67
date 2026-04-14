import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LocationPicker } from "../../components/LocationPicker";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const SucursalEditADM = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [gerente, setGerente] = useState("");
    const [location, setLocation] = useState({
        lat: -31.4201,
        lng: -64.1888,
        address: ""
    });
    const [idEstablecimiento, setIdEstablecimiento] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${backendUrl}/api/sucursal/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar la sucursal");
                }

                setNombre(data.nombre || "");
                setGerente(data.nombre_gerente || "");
                setIdEstablecimiento(data.id_establecimiento ?? null);
                setLocation({
                    lat: data.lat ?? -31.4201,
                    lng: data.lng ?? -64.1888,
                    address: data.address ?? ""
                });
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar la sucursal");
            });
    }, [backendUrl, id]);

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            nombre: nombre,
            nombre_gerente: gerente,
            lat: location.lat,
            lng: location.lng,
            address: location.address
        };

        fetch(`${backendUrl}/api/sucursal/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(async (resp) => {
                let responseData = {};
                try {
                    responseData = await resp.json();
                } catch {
                    responseData = {};
                }

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo actualizar la sucursal");
                }

                if (idEstablecimiento) {
                    navigate(`/establecimientos/${idEstablecimiento}/detalle`);
                } else {
                    navigate(-1);
                }
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al actualizar la sucursal");
            });
    }

    function handleDelete() {
        fetch(`${backendUrl}/api/sucursal/${id}`, {
            method: "DELETE"
        })
            .then(async (resp) => {
                let responseData = {};
                try {
                    responseData = await resp.json();
                } catch {
                    responseData = {};
                }

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo borrar la sucursal");
                }

                if (idEstablecimiento) {
                    navigate(`/establecimientos/${idEstablecimiento}/detalle`);
                } else {
                    navigate("/establecimientos");
                }
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al borrar la sucursal");
            });
    }

    return (
        <div className="container-fluid px-0">
            <AdminNavbar />
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Editar sucursal
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Modificá los datos de la sucursal desde el flujo de establecimientos.
                            </p>
                        </div>
                    </div>

                    <style>{`
                        .location-wrapper .row.g-3 { display: none; }
                        .location-wrapper .d-flex.gap-2 { display: none; }
                        .location-wrapper label:nth-of-type(2) { display: none; }
                    `}</style>

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
                                            <label className="form-label">Nombre del gerente</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={gerente}
                                                onChange={(e) => setGerente(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-4 location-wrapper">
                                            <label className="form-label fw-bold">Ubicación en el mapa</label>
                                            <LocationPicker
                                                value={location}
                                                onChange={setLocation}
                                                height="300px"
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
                                                className="btn btn-outline-danger"
                                                onClick={handleDelete}
                                            >
                                                Borrar sucursal
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-page"
                                                onClick={() => navigate(-1)}
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
                                    <div className="d-flex flex-column gap-3">
                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Nombre</div>
                                            <div>{nombre || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Gerente</div>
                                            <div>{gerente || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Dirección</div>
                                            <div>{location.address || "Sin definir"}</div>
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