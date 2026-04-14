import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const ServicioForm = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [listaClientes, setListaClientes] = useState([]);

    const [idCliente, setIdCliente] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [lugar, setLugar] = useState("");
    const [urgencia, setUrgencia] = useState("");
    const [estado, setEstado] = useState("");

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
            client_id: idCliente ? Number(idCliente) : null,
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

        fetch(`${backendUrl}/api/servicios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(async (resp) => {
                const responseData = await resp.json();

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo crear el servicio");
                }

                navigate("/servicios");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al crear el servicio");
            });
    }

    useEffect(() => {
        fetch(`${backendUrl}/api/clients`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                setListaClientes(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [backendUrl]);

    return (
        <div className="container-fluid px-0">
            <AdminNavbar />
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Nuevo servicio
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Crear un nuevo servicio manualmente desde el panel administrativo.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Datos del servicio</h6>
                                </div>

                                <div className="p-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Cliente</label>
                                            <select
                                                className="form-select"
                                                value={idCliente}
                                                onChange={(e) => setIdCliente(e.target.value)}
                                                required
                                            >
                                                <option value="">Seleccione cliente</option>
                                                {listaClientes.map((cliente) => (
                                                    <option value={cliente.id} key={cliente.id}>
                                                        {cliente.full_name}
                                                    </option>
                                                ))}
                                            </select>
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
                                                <select
                                                    className="form-select"
                                                    value={urgencia}
                                                    onChange={(e) => setUrgencia(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Elige una opción</option>
                                                    <option value="baja">Baja</option>
                                                    <option value="media">Media</option>
                                                    <option value="alta">Alta</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Estado</label>
                                                <select
                                                    className="form-select"
                                                    value={estado}
                                                    onChange={(e) => setEstado(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Elige una opción</option>
                                                    <option value="abierto">Abierto</option>
                                                    <option value="en_proceso">En proceso</option>
                                                    <option value="finalizado">Finalizado</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Precio propuesto</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={precioPropuesto}
                                                    onChange={(e) => setPrecioPropuesto(e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Precio recomendado</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={precioRecomendado}
                                                    onChange={(e) => setPrecioRecomendado(e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Tiempo estimado</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={tiempoEstimado}
                                                    onChange={(e) => setTiempoEstimado(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">URL imagen</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                            />
                                        </div>

                                        <hr />

                                        <h6 className="mb-3">Origen</h6>

                                        <div className="mb-3">
                                            <label className="form-label">Dirección origen</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={addressStart}
                                                onChange={(e) => setAddressStart(e.target.value)}
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Latitud origen</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    className="form-control"
                                                    value={latStart}
                                                    onChange={(e) => setLatStart(e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Longitud origen</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    className="form-control"
                                                    value={lngStart}
                                                    onChange={(e) => setLngStart(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <hr />

                                        <h6 className="mb-3">Destino</h6>

                                        <div className="mb-3">
                                            <label className="form-label">Dirección destino</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={addressFinish}
                                                onChange={(e) => setAddressFinish(e.target.value)}
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Latitud destino</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    className="form-control"
                                                    value={latFinish}
                                                    onChange={(e) => setLatFinish(e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Longitud destino</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    className="form-control"
                                                    value={lngFinish}
                                                    onChange={(e) => setLngFinish(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {error && <p className="text-danger small">{error}</p>}

                                        <div className="d-flex gap-2 flex-wrap mt-4">
                                            <button type="submit" className="btn-export">
                                                <i className="bi bi-check-circle"></i>
                                                Crear servicio
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-page"
                                                onClick={() => navigate("/servicios")}
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
                                            <div className="stat-label">Descripción</div>
                                            <div>{descripcion || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Urgencia</div>
                                            <div>{urgencia || "Sin definir"}</div>
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