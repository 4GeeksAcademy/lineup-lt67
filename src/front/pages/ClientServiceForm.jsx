import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientNavbar } from "../components/ClientNavbar";
import { ClientSidebar } from "../components/ClientSidebar";
import { LocationPicker } from "../components/LocationPicker";
import { calculateDistance, estimateTravelTimeMinutes } from "../utils/mathUtils";
import { calculateDistanceInKm } from "../utils/distance";

export const ClientServiceForm = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [descripcion, setDescripcion] = useState("");
    const [lugar, setLugar] = useState("");
    const [urgencia, setUrgencia] = useState("");
    const [precioPropuesto, setPrecioPropuesto] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [serviceImageUrl, setServiceImageUrl] = useState("");

    const [startLocation, setStartLocation] = useState({
        lat: -31.4201,
        lng: -64.1888,
        address: ""
    });

    const [finishLocation, setFinishLocation] = useState({
        lat: -31.4201,
        lng: -64.1888,
        address: ""
    });

    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState("");

    const [aiTiempo, setAiTiempo] = useState("");
    const [aiPrecio, setAiPrecio] = useState("");
    const [isEstimating, setIsEstimating] = useState(false);
    const [aiError, setAiError] = useState("");
    const [mathDistance, setMathDistance] = useState(null);
    const [mathTime, setMathTime] = useState(null);


    const handleEstimate = async () => {
        if (!descripcion || !urgencia) {
            setAiError("Por favor llená la descripción y la urgencia para estimar.");
            return;
        }

        setIsEstimating(true);
        setAiError("");
        setAiTiempo("");
        setAiPrecio("");
        setMathDistance(null);
        setMathTime(null);

        const distanceKm = calculateDistance(
            startLocation.lat,
            startLocation.lng,
            finishLocation.lat,
            finishLocation.lng
        );

        setMathDistance(distanceKm);
        setMathTime(estimateTravelTimeMinutes(distanceKm));

        const token = localStorage.getItem("tokenClient");

        try {
            const resp = await fetch(`${backendUrl}/api/ai/estimate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    descripcion,
                    urgencia,
                    distancia_km: distanceKm
                })
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo estimar el servicio");
            }

            if (data.tiempo_estimado) setAiTiempo(data.tiempo_estimado);

            if (data.precio_recomendado) {
                setAiPrecio(data.precio_recomendado);
                setPrecioPropuesto(data.precio_recomendado);
            }
        } catch (err) {
            setAiError(err.message || "Ocurrió un error al estimar el servicio");
        } finally {
            setIsEstimating(false);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setUploadingImage(true);
            setError("");

            const resp = await fetch(`${backendUrl}/api/upload/service-image`, {
                method: "POST",
                body: formData
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo subir la imagen");
            }

            setServiceImageUrl(data.image_url);
        } catch (err) {
            setError(err.message || "Ocurrió un error al subir la imagen");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const distanceKm = calculateDistanceInKm(
            startLocation.lat,
            startLocation.lng,
            finishLocation.lat,
            finishLocation.lng
        );

        if (distanceKm != null && distanceKm > 20) {
            setError("La distancia entre el origen y el destino no puede superar los 20 km");
            return;
        }

        const token = localStorage.getItem("tokenClient");

        try {
            const resp = await fetch(`${backendUrl}/api/clients/me/services`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    descripcion,
                    lugar,
                    urgencia,
                    precio_propuesto: precioPropuesto ? Number(precioPropuesto) : null,
                    image_url: serviceImageUrl || null,
                    tiempo_estimado: aiTiempo || null,
                    precio_recomendado: aiPrecio ? Number(aiPrecio) : null,
                    lat_start: startLocation.lat,
                    lng_start: startLocation.lng,
                    address_start: startLocation.address,
                    lat_finish: finishLocation.lat,
                    lng_finish: finishLocation.lng,
                    address_finish: finishLocation.address
                })
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo crear el servicio");
            }

            navigate("/client/services");
        } catch (err) {
            setError(err.message || "Ocurrió un error al crear el servicio");
        }
    };

    return (
        <div className="container-fluid px-0">
            <ClientNavbar />
            <ClientSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Nuevo servicio
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Creá un servicio, definí origen y destino, y obtené una estimación automática.
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
                                            <label className="form-label">Descripción</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
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
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold">Ubicación inicial</label>
                                            <LocationPicker
                                                value={startLocation}
                                                onChange={setStartLocation}
                                                height="300px"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold">Ubicación final</label>
                                            <LocationPicker
                                                value={finishLocation}
                                                onChange={setFinishLocation}
                                                height="300px"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Urgencia</label>
                                            <select
                                                className="form-select"
                                                value={urgencia}
                                                onChange={(e) => setUrgencia(e.target.value)}
                                                required
                                            >
                                                <option value="">Seleccionar urgencia</option>
                                                <option value="baja">Baja</option>
                                                <option value="media">Media</option>
                                                <option value="alta">Alta</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Imagen del servicio</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <button
                                                type="button"
                                                className="btn-page"
                                                onClick={handleImageUpload}
                                                disabled={!selectedFile || uploadingImage}
                                            >
                                                {uploadingImage ? "Subiendo imagen..." : "Subir imagen"}
                                            </button>
                                        </div>

                                        {serviceImageUrl && (
                                            <div className="mb-4">
                                                <p className="small text-success mb-2">
                                                    Imagen subida correctamente
                                                </p>
                                                <img
                                                    src={serviceImageUrl}
                                                    alt="Preview servicio"
                                                    className="img-fluid rounded"
                                                    style={{
                                                        maxHeight: "180px",
                                                        objectFit: "cover",
                                                        border: "1px solid var(--border)"
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <button
                                                type="button"
                                                className="btn-export"
                                                onClick={handleEstimate}
                                                disabled={isEstimating || !descripcion || !urgencia}
                                            >
                                                <i className="bi bi-stars"></i>
                                                {isEstimating
                                                    ? "Estimando..."
                                                    : "Estimar precio y tiempo"}
                                            </button>

                                            {aiError && (
                                                <p className="text-danger small mt-2 mb-0">{aiError}</p>
                                            )}
                                        </div>

                                        {(mathDistance !== null || aiTiempo) && (
                                            <div className="row g-3 mb-4">
                                                {mathDistance !== null && (
                                                    <div className="col-md-6">
                                                        <div className="stat-card">
                                                            <div className="stat-label">
                                                                <span
                                                                    className="stat-dot"
                                                                    style={{ background: "#8b5cf6" }}
                                                                ></span>
                                                                Distancia real
                                                            </div>
                                                            <div className="stat-value" style={{ fontSize: "1.5rem" }}>
                                                                {mathDistance} km
                                                            </div>
                                                            <div>
                                                                <span className="stat-badge">
                                                                    <i className="bi bi-rulers"></i>
                                                                    Cálculo geométrico
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {mathTime !== null && (
                                                    <div className="col-md-6">
                                                        <div className="stat-card">
                                                            <div className="stat-label">
                                                                <span
                                                                    className="stat-dot"
                                                                    style={{ background: "#0d6efd" }}
                                                                ></span>
                                                                Tiempo base
                                                            </div>
                                                            <div className="stat-value" style={{ fontSize: "1.5rem" }}>
                                                                {mathTime} min
                                                            </div>
                                                            <div>
                                                                <span className="stat-badge">
                                                                    <i className="bi bi-stopwatch"></i>
                                                                    Traslado estimado
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {aiTiempo && (
                                            <div className="table-card mb-4">
                                                <div className="table-card-header">
                                                    <h6>Estimación IA</h6>
                                                </div>
                                                <div className="p-3">
                                                    <p className="mb-2">
                                                        <strong>⏳ Tiempo estimado IA:</strong> {aiTiempo}
                                                    </p>
                                                    {aiPrecio && (
                                                        <p className="mb-0 text-success">
                                                            <strong>💰 Precio recomendado IA:</strong> ${aiPrecio}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Precio propuesto {!aiPrecio && "(Opcional)"}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={precioPropuesto}
                                                onChange={(e) => setPrecioPropuesto(e.target.value)}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        {error && <p className="text-danger small">{error}</p>}

                                        <div className="d-flex gap-2 flex-wrap mt-4">
                                            <button type="submit" className="btn-export">
                                                <i className="bi bi-check-circle"></i>
                                                Crear servicio
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
                                    <p className="mb-3 text-muted" style={{ fontSize: ".9rem" }}>
                                        Completá los datos del servicio y, si querés, usá la estimación para definir
                                        mejor precio y tiempo.
                                    </p>

                                    <div className="d-flex flex-column gap-3">
                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">
                                                <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                                Origen
                                            </div>
                                            <div style={{ fontSize: ".9rem", color: "var(--text)" }}>
                                                {startLocation.address || "Sin definir"}
                                            </div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">
                                                <span className="stat-dot" style={{ background: "#22c55e" }}></span>
                                                Destino
                                            </div>
                                            <div style={{ fontSize: ".9rem", color: "var(--text)" }}>
                                                {finishLocation.address || "Sin definir"}
                                            </div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">
                                                <span className="stat-dot" style={{ background: "#f59e0b" }}></span>
                                                Urgencia
                                            </div>
                                            <div style={{ fontSize: ".9rem", color: "var(--text)" }}>
                                                {urgencia || "No seleccionada"}
                                            </div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">
                                                <span className="stat-dot" style={{ background: "#8b5cf6" }}></span>
                                                Precio actual
                                            </div>
                                            <div style={{ fontSize: ".9rem", color: "var(--text)" }}>
                                                {precioPropuesto ? `$${precioPropuesto}` : "Sin definir"}
                                            </div>
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