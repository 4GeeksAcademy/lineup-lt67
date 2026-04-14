import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const ServicioEdit = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [servicioId, setServicioId] = useState("");
    const [idCliente, setIdCliente] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [lugar, setLugar] = useState("");
    const [urgencia, setUrgencia] = useState("");
    const [estado, setEstado] = useState("");
    const [date, setDate] = useState("");

    const [precioPropuesto, setPrecioPropuesto] = useState("");
    const [precioRecomendado, setPrecioRecomendado] = useState("");
    const [tiempoEstimado, setTiempoEstimado] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [addressStart, setAddressStart] = useState("");
    const [latStart, setLatStart] = useState("");
    const [lngStart, setLngStart] = useState("");

    const [addressFinish, setAddressFinish] = useState("");
    const [latFinish, setLatFinish] = useState("");
    const [lngFinish, setLngFinish] = useState("");

    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            descripcion: descripcion.trim(),
            lugar: lugar.trim() || null,
            urgencia,
            estado,
            precio_propuesto: precioPropuesto !== "" ? Number(precioPropuesto) : null,
            precio_recomendado: precioRecomendado !== "" ? Number(precioRecomendado) : null,
            tiempo_estimado: tiempoEstimado.trim() || null,
            image_url: imageUrl.trim() || null,
            address_start: addressStart.trim() || null,
            lat_start: latStart !== "" ? Number(latStart) : null,
            lng_start: lngStart !== "" ? Number(lngStart) : null,
            address_finish: addressFinish.trim() || null,
            lat_finish: latFinish !== "" ? Number(latFinish) : null,
            lng_finish: lngFinish !== "" ? Number(lngFinish) : null
        };

        fetch(`${backendUrl}/api/servicios/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(async (resp) => {
                const responseData = await resp.json();

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo editar el servicio");
                }

                navigate("/servicios");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al editar el servicio");
            });
    }

    function deleteServicio() {
        fetch(`${backendUrl}/api/servicios/${id}`, { method: "DELETE" })
            .then(async (resp) => {
                if (!resp.ok) {
                    let data = {};
                    try {
                        data = await resp.json();
                    } catch {
                        data = {};
                    }
                    throw new Error(data.msg || "No se pudo borrar el servicio");
                }

                navigate("/servicios");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al borrar el servicio");
            });
    }

    useEffect(() => {
        fetch(`${backendUrl}/api/servicios/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar el servicio");
                }

                setServicioId(data.id || "");
                setIdCliente(data.client_id || "");
                setDescripcion(data.descripcion || "");
                setLugar(data.lugar || "");
                setUrgencia(data.urgencia || "");
                setEstado(data.estado || "");
                setDate(data.created_at || "");

                setPrecioPropuesto(data.precio_propuesto ?? "");
                setPrecioRecomendado(data.precio_recomendado ?? "");
                setTiempoEstimado(data.tiempo_estimado || "");
                setImageUrl(data.image_url || "");

                setAddressStart(data.address_start || "");
                setLatStart(data.lat_start ?? "");
                setLngStart(data.lng_start ?? "");

                setAddressFinish(data.address_finish || "");
                setLatFinish(data.lat_finish ?? "");
                setLngFinish(data.lng_finish ?? "");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar el servicio");
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
                                Editar servicio
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Modificá los datos del servicio desde el panel administrativo.
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
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">ID servicio</label>
                                                <input type="text" className="form-control" value={servicioId} disabled />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">ID cliente</label>
                                                <input type="text" className="form-control" value={idCliente} disabled />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Descripción</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={descripcion}
                                                onChange={(e) => setDescripcion(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Lugar</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={lugar}
                                                onChange={(e) => setLugar(e.target.value)}
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Urgencia</label>
                                                <select className="form-select" value={urgencia} onChange={(e) => setUrgencia(e.target.value)}>
                                                    <option value="">Elegí una opción</option>
                                                    <option value="baja">Baja</option>
                                                    <option value="media">Media</option>
                                                    <option value="alta">Alta</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Estado</label>
                                                <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
                                                    <option value="">Elegí una opción</option>
                                                    <option value="abierto">Abierto</option>
                                                    <option value="en_proceso">En proceso</option>
                                                    <option value="finalizado">Finalizado</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Precio propuesto</label>
                                                <input type="number" className="form-control" value={precioPropuesto} onChange={(e) => setPrecioPropuesto(e.target.value)} />
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Precio recomendado</label>
                                                <input type="number" className="form-control" value={precioRecomendado} onChange={(e) => setPrecioRecomendado(e.target.value)} />
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Tiempo estimado</label>
                                                <input type="text" className="form-control" value={tiempoEstimado} onChange={(e) => setTiempoEstimado(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">URL imagen</label>
                                            <input type="text" className="form-control" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                                        </div>

                                        <hr />
                                        <h6 className="mb-3">Origen</h6>

                                        <div className="mb-3">
                                            <label className="form-label">Dirección origen</label>
                                            <input type="text" className="form-control" value={addressStart} onChange={(e) => setAddressStart(e.target.value)} />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Latitud origen</label>
                                                <input type="number" step="any" className="form-control" value={latStart} onChange={(e) => setLatStart(e.target.value)} />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Longitud origen</label>
                                                <input type="number" step="any" className="form-control" value={lngStart} onChange={(e) => setLngStart(e.target.value)} />
                                            </div>
                                        </div>

                                        <hr />
                                        <h6 className="mb-3">Destino</h6>

                                        <div className="mb-3">
                                            <label className="form-label">Dirección destino</label>
                                            <input type="text" className="form-control" value={addressFinish} onChange={(e) => setAddressFinish(e.target.value)} />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Latitud destino</label>
                                                <input type="number" step="any" className="form-control" value={latFinish} onChange={(e) => setLatFinish(e.target.value)} />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Longitud destino</label>
                                                <input type="number" step="any" className="form-control" value={lngFinish} onChange={(e) => setLngFinish(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Fecha de creación</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={date ? new Date(date).toLocaleString() : ""}
                                                disabled
                                            />
                                        </div>

                                        {error && <p className="text-danger small">{error}</p>}

                                        <div className="d-flex gap-2 flex-wrap mt-4">
                                            <button type="submit" className="btn-export">
                                                <i className="bi bi-check-circle"></i>
                                                Guardar cambios
                                            </button>

                                            <button type="button" className="btn btn-outline-danger" onClick={deleteServicio}>
                                                Borrar servicio
                                            </button>

                                            <button type="button" className="btn-page" onClick={() => navigate("/servicios")}>
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
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="Preview servicio"
                                            className="img-fluid rounded mb-3"
                                            style={{
                                                width: "100%",
                                                maxHeight: "220px",
                                                objectFit: "cover",
                                                border: "1px solid var(--border)"
                                            }}
                                        />
                                    ) : null}

                                    <div className="d-flex flex-column gap-3">
                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Descripción</div>
                                            <div>{descripcion || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Estado</div>
                                            <div>{estado || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Origen</div>
                                            <div>{addressStart || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Destino</div>
                                            <div>{addressFinish || "Sin definir"}</div>
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