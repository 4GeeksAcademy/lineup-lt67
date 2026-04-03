import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientNavbar } from "../components/ClientNavbar";

export const ClientServiceForm = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [descripcion, setDescripcion] = useState("");
    const [lugar, setLugar] = useState("");
    const [urgencia, setUrgencia] = useState("");
    const [precioPropuesto, setPrecioPropuesto] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [serviceImageUrl, setServiceImageUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState("");


    const [aiTiempo, setAiTiempo] = useState("");
    const [aiPrecio, setAiPrecio] = useState("");
    const [isEstimating, setIsEstimating] = useState(false);
    const [aiError, setAiError] = useState("");

    const handleEstimate = async () => {
        if (!descripcion || !urgencia) {
            setAiError("Por favor llena la descripción y la urgencia para estimar.");
            return;
        }
        
        setIsEstimating(true);
        setAiError("");
        setAiTiempo("");
        setAiPrecio("");

        const token = localStorage.getItem("tokenClient");

        try {
            const resp = await fetch(`${backendUrl}/api/ai/estimate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ descripcion, urgencia })
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

            <div className="container py-4">
                <h1 className="mb-4">Nuevo servicio</h1>

                <div className="card shadow-sm">
                    <div className="card-body">
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

                            <div className="mb-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary w-100"
                                    onClick={handleImageUpload}
                                    disabled={!selectedFile || uploadingImage}
                                >
                                    {uploadingImage ? "Subiendo imagen..." : "Subir imagen"}
                                </button>
                            </div>

                            {serviceImageUrl && (
                                <div className="mb-3 text-center">
                                    <p className="small text-success mb-2">Imagen subida correctamente</p>
                                    <img
                                        src={serviceImageUrl}
                                        alt="Preview servicio"
                                        className="img-fluid rounded"
                                        style={{ maxHeight: "180px", objectFit: "cover" }}
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-info w-100 fw-bold"
                                    onClick={handleEstimate}
                                    disabled={isEstimating || !descripcion || !urgencia}
                                >
                                    {isEstimating ? "Pensando..." : "✨ Estimar precio y tiempo (IA)"}
                                </button>
                                {aiError && <p className="text-danger small mt-2">{aiError}</p>}
                                {aiTiempo && (
                                    <div className="alert alert-info mt-3 mb-0">
                                        <p className="mb-1"><strong>⏳ Tiempo estimado IA:</strong> {aiTiempo}</p>
                                        {aiPrecio && <p className="mb-0"><strong>💰 Precio recomendado IA:</strong> ${aiPrecio}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Precio propuesto {!aiPrecio && "(Opcional)"}</label>
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

                            <button type="submit" className="btn btn-primary">
                                Crear servicio
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};