import React, { useEffect, useMemo, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { calculateDistance, estimateTravelTimeMinutes } from "../utils/mathUtils";
import { calculateDistanceInKm } from "../utils/distance";
import { LinerNavbar } from "../components/LinerNavbar";
import { LinerSidebar } from "../components/LinerSidebar";

export const LinerHome = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const MAX_DISTANCE_KM = 10;

    const [serviciosAbiertos, setServiciosAbiertos] = useState([]);
    const [misPropuestas, setMisPropuestas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [imagenExpandidaId, setImagenExpandidaId] = useState(null);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [precioPropuesto, setPrecioPropuesto] = useState("");
    const [mensajeExtra, setMensajeExtra] = useState("");
    const [linerLocation, setLinerLocation] = useState(null);

    const liner = store.linerData || JSON.parse(localStorage.getItem("linerData"));

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLinerLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.log("Geolocalización denegada o no disponible:", error),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    useEffect(() => {
        if (!liner) {
            navigate("/liner/login");
            return;
        }

        const fetchData = async () => {
            try {
                const resServicios = await fetch(`${backendUrl}/api/servicios`);
                const dataServicios = await resServicios.json();

                const resPropuestas = await fetch(
                    `${backendUrl}/api/propuestas?liner_id=${liner.id}`
                );
                const dataPropuestas = await resPropuestas.json();

                if (resServicios.ok && resPropuestas.ok) {
                    const misPropuestasIds = dataPropuestas.map((p) => p.servicio_id);

                    const abiertos = dataServicios
                        .filter((s) => s.estado === "abierto" && !misPropuestasIds.includes(s.id))
                        .map((servicio) => {
                            const distanceKm = calculateDistanceInKm(
                                liner?.lat,
                                liner?.lng,
                                servicio.lat_start,
                                servicio.lng_start
                            );

                            return {
                                ...servicio,
                                distanceKm
                            };
                        });

                    const serviciosFiltrados =
                        liner?.lat != null && liner?.lng != null
                            ? abiertos.filter((servicio) => {
                                  if (servicio.distanceKm == null) return false;
                                  return servicio.distanceKm <= MAX_DISTANCE_KM;
                              })
                            : abiertos;

                    serviciosFiltrados.sort((a, b) => {
                        if (a.distanceKm == null) return 1;
                        if (b.distanceKm == null) return -1;
                        return a.distanceKm - b.distanceKm;
                    });

                    setServiciosAbiertos(serviciosFiltrados);
                    setMisPropuestas(dataPropuestas);
                }
            } catch (error) {
                console.error("Error cargando los datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [liner, navigate, backendUrl]);

    const handleLogout = () => {
        dispatch({ type: "set_auth_liner", payload: false });
        dispatch({ type: "set_liner_data", payload: null });
        localStorage.removeItem("linerToken");
        localStorage.removeItem("linerData");
        navigate("/liner/login");
    };

    const handlePostularse = async (e) => {
        e.preventDefault();

        try {
            const resp = await fetch(`${backendUrl}/api/propuestas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    servicio_id: servicioSeleccionado.id,
                    liner_id: liner.id,
                    precio: parseFloat(precioPropuesto),
                    mensaje: mensajeExtra
                })
            });

            if (resp.ok) {
                const nuevaPropuesta = await resp.json();

                setMisPropuestas([...misPropuestas, nuevaPropuesta]);
                setServiciosAbiertos(
                    serviciosAbiertos.filter((s) => s.id !== servicioSeleccionado.id)
                );

                setServicioSeleccionado(null);
                setPrecioPropuesto("");
                setMensajeExtra("");
                alert("Te has postulado exitosamente al servicio.");
            } else {
                const errorData = await resp.json();
                alert(`Error: ${errorData.msg}`);
            }
        } catch (error) {
            console.error("Error al postularse", error);
            alert("No se pudo completar la postulación");
        }
    };

    const propuestasActivas = useMemo(
        () =>
            misPropuestas.filter(
                (propuesta) =>
                    propuesta.estado === "aceptada" &&
                    propuesta.servicio_estado !== "finalizado"
            ),
        [misPropuestas]
    );

    const propuestasPendientes = useMemo(
        () => misPropuestas.filter((propuesta) => propuesta.estado === "pendiente"),
        [misPropuestas]
    );

    const renderEstadoPropuesta = (propuesta) => {
        let badgeClass = "btn-filter";
        let label = propuesta.estado;

        if (propuesta.estado === "aceptada") {
            if (propuesta.servicio_estado === "finalizado") {
                badgeClass = "badge-offline";
                label = "Finalizado";
            } else {
                badgeClass = "badge-online";
                label = "Activo";
            }
        } else if (propuesta.estado === "rechazada") {
            badgeClass = "badge-offline";
            label = "Rechazada";
        } else if (propuesta.estado === "pendiente") {
            badgeClass = "btn-filter";
            label = "Pendiente";
        }

        return <span className={badgeClass}>{label}</span>;
    };

    if (loading) {
        return (
            <div className="container-fluid px-0">
                <LinerNavbar liner={liner} onLogout={handleLogout} />
                <LinerSidebar />

                <main className="main">
                    <div className="page-body">
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Cargando panel del liner...</h6>
                            </div>
                            <div className="p-4 text-muted">
                                Esperá un momento mientras cargamos tus servicios y postulaciones.
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0">
            <LinerNavbar liner={liner} onLogout={handleLogout} />
            <LinerSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Panel de Liner
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Revisá servicios cercanos y gestioná tus postulaciones activas.
                            </p>
                        </div>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    Servicios disponibles
                                </div>
                                <div className="stat-value">{serviciosAbiertos.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-geo-alt"></i>
                                        Dentro de {MAX_DISTANCE_KM} km
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#f59e0b" }}></span>
                                    Propuestas pendientes
                                </div>
                                <div className="stat-value">{propuestasPendientes.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-hourglass-split"></i>
                                        Esperando respuesta
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#22c55e" }}></span>
                                    Servicios activos
                                </div>
                                <div className="stat-value">{propuestasActivas.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-chat-dots"></i>
                                        Con chat habilitado
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-7">
                            <div className="table-card mb-4">
                                <div className="table-card-header">
                                    <h6>Servicios disponibles</h6>
                                </div>

                                <div className="p-3">
                                    {serviciosAbiertos.length === 0 ? (
                                        <div className="text-muted p-2">
                                            No hay servicios nuevos disponibles en este momento.
                                        </div>
                                    ) : (
                                        <div className="row g-3">
                                            {serviciosAbiertos.map((servicio) => {
                                                const liveDistance =
                                                    linerLocation && servicio.lat_start && servicio.lng_start
                                                        ? calculateDistance(
                                                              linerLocation.lat,
                                                              linerLocation.lng,
                                                              servicio.lat_start,
                                                              servicio.lng_start
                                                          )
                                                        : null;

                                                const liveTime =
                                                    liveDistance != null
                                                        ? estimateTravelTimeMinutes(liveDistance)
                                                        : null;

                                                return (
                                                    <div className="col-12" key={servicio.id}>
                                                        <div
                                                            className="stat-card h-100"
                                                            style={{ padding: "1.1rem 1.1rem" }}
                                                        >
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <h6 className="mb-0 fw-bold">
                                                                    {servicio.descripcion}
                                                                </h6>
                                                                <span className="badge-online">Abierto</span>
                                                            </div>

                                                            {servicio.image_url && (
                                                                <div className="mb-3">
                                                                    <img
                                                                        src={servicio.image_url}
                                                                        alt="Servicio"
                                                                        className="img-fluid rounded mb-2"
                                                                        style={{
                                                                            maxHeight: "160px",
                                                                            width: "100%",
                                                                            objectFit: "cover",
                                                                            border: "1px solid var(--border)"
                                                                        }}
                                                                    />

                                                                    <button
                                                                        className="btn-page"
                                                                        onClick={() =>
                                                                            setImagenExpandidaId(
                                                                                imagenExpandidaId === servicio.id
                                                                                    ? null
                                                                                    : servicio.id
                                                                            )
                                                                        }
                                                                    >
                                                                        {imagenExpandidaId === servicio.id
                                                                            ? "Ocultar imagen"
                                                                            : "Ver imagen"}
                                                                    </button>

                                                                    {imagenExpandidaId === servicio.id && (
                                                                        <div className="mt-3">
                                                                            <img
                                                                                src={servicio.image_url}
                                                                                alt="Servicio ampliado"
                                                                                className="img-fluid rounded"
                                                                                style={{
                                                                                    maxHeight: "360px",
                                                                                    width: "100%",
                                                                                    objectFit: "contain",
                                                                                    border: "1px solid var(--border)"
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <p className="mb-2 text-muted" style={{ fontSize: ".84rem" }}>
                                                                <strong>Origen:</strong>{" "}
                                                                {servicio.address_start || "No especificado"}
                                                            </p>

                                                            <p className="mb-2 text-muted" style={{ fontSize: ".84rem" }}>
                                                                <strong>Destino:</strong>{" "}
                                                                {servicio.address_finish || "No especificado"}
                                                            </p>

                                                            {servicio.distanceKm != null && (
                                                                <p className="mb-2" style={{ fontSize: ".84rem" }}>
                                                                    <strong>Distancia guardada al origen:</strong>{" "}
                                                                    {servicio.distanceKm.toFixed(1)} km
                                                                </p>
                                                            )}

                                                            <p className="mb-2" style={{ fontSize: ".84rem" }}>
                                                                <strong>Urgencia:</strong> {servicio.urgencia}
                                                            </p>

                                                            <p className="mb-2" style={{ fontSize: ".84rem" }}>
                                                                <strong>Presupuesto del cliente:</strong> $
                                                                {servicio.precio_propuesto}
                                                            </p>

                                                            {liveDistance != null && (
                                                                <div
                                                                    className="p-3 rounded mb-3"
                                                                    style={{
                                                                        background: "#f9fafb",
                                                                        border: "1px solid var(--border)"
                                                                    }}
                                                                >
                                                                    <p className="mb-1 text-dark" style={{ fontSize: ".84rem" }}>
                                                                        <strong>Distancia en tiempo real:</strong>{" "}
                                                                        {liveDistance} km
                                                                    </p>
                                                                    <p className="mb-0 text-muted" style={{ fontSize: ".82rem" }}>
                                                                        <strong>Tiempo estimado de traslado:</strong>{" "}
                                                                        ~{liveTime} min
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <button
                                                                className="btn-export"
                                                                onClick={() => setServicioSeleccionado(servicio)}
                                                            >
                                                                <i className="bi bi-send-plus"></i>
                                                                Ofrecer mis servicios
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {servicioSeleccionado && (
                                <div className="table-card">
                                    <div className="table-card-header">
                                        <h6>
                                            Postularse al servicio: {servicioSeleccionado.descripcion}
                                        </h6>
                                    </div>

                                    <div className="p-4">
                                        <form onSubmit={handlePostularse}>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Tu precio ofertado ($)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={precioPropuesto}
                                                    onChange={(e) => setPrecioPropuesto(e.target.value)}
                                                    placeholder={`El cliente sugirió $${servicioSeleccionado.precio_propuesto}`}
                                                    required
                                                    min="1"
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Mensaje al cliente (opcional)
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    placeholder="Ej: Tengo experiencia y puedo ir de inmediato."
                                                    value={mensajeExtra}
                                                    onChange={(e) => setMensajeExtra(e.target.value)}
                                                ></textarea>
                                            </div>

                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    type="button"
                                                    className="btn-page"
                                                    onClick={() => setServicioSeleccionado(null)}
                                                >
                                                    Cancelar
                                                </button>
                                                <button type="submit" className="btn-export">
                                                    <i className="bi bi-check-circle"></i>
                                                    Enviar propuesta
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-lg-5">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Mis postulaciones</h6>
                                </div>

                                <div className="p-3">
                                    {misPropuestas.length === 0 ? (
                                        <div className="text-muted p-2">
                                            Aún no has enviado propuestas.
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-3">
                                            {misPropuestas.map((propuesta) => (
                                                <div
                                                    key={propuesta.id}
                                                    className="stat-card"
                                                    style={{ padding: "1rem 1rem" }}
                                                >
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6
                                                            className="mb-0 fw-bold"
                                                            style={{ maxWidth: "70%" }}
                                                        >
                                                            Servicio #{propuesta.servicio_id}
                                                        </h6>
                                                        {renderEstadoPropuesta(propuesta)}
                                                    </div>

                                                    <p className="mb-1" style={{ fontSize: ".84rem" }}>
                                                        <strong>Mi oferta:</strong> ${propuesta.precio}
                                                    </p>

                                                    <p className="mb-3 text-muted" style={{ fontSize: ".8rem" }}>
                                                        <strong>Enviada:</strong>{" "}
                                                        {new Date(propuesta.created_at).toLocaleDateString()}
                                                    </p>

                                                    {propuesta.estado === "aceptada" &&
                                                        propuesta.servicio_estado !== "finalizado" && (
                                                            <button
                                                                className="btn-details"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/liner/services/${propuesta.servicio_id}/chat`
                                                                    )
                                                                }
                                                            >
                                                                Abrir chat
                                                            </button>
                                                        )}
                                                </div>
                                            ))}
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