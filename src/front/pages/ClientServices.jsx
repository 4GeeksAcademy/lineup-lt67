import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClientNavbar } from "../components/ClientNavbar";
import { ClientSidebar } from "../components/ClientSidebar";
import "../components/lineup-shared.css"

export const ClientServices = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const loggedClient = JSON.parse(localStorage.getItem("loggedClient"));

    const loadServices = async () => {
        const token = localStorage.getItem("tokenClient");

        try {
            setLoading(true);
            setError("");

            const resp = await fetch(`${backendUrl}/api/clients/me/services`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudieron cargar los servicios en este momento");
            }

            setServices(data);
        } catch (err) {
            setError(err.message || "Ocurrió un error al cargar los servicios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    const openServices = useMemo(
        () => services.filter((service) => service.estado === "abierto"),
        [services]
    );

    const inProgressServices = useMemo(
        () => services.filter((service) => service.estado === "en_proceso"),
        [services]
    );

    const history = useMemo(
        () => services.filter(
            (service) => service.estado !== "abierto" && service.estado !== "en_proceso"
        ),
        [services]
    );

    const renderServiceCard = (service, buttonVariant = "btn-details") => {
        const isInProgress = service.estado === "en_proceso";

        return (
            <div className="col-md-6 col-xl-4" key={service.id}>
                <div
                    className="stat-card h-100 d-flex flex-column justify-content-between"
                    style={{ padding: "1.1rem 1.1rem" }}
                >
                    <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0 fw-bold">Servicio #{service.id}</h6>

                            <span
                                className={
                                    service.estado === "abierto"
                                        ? "badge-online"
                                        : service.estado === "en_proceso"
                                        ? "badge-online"
                                        : "badge-offline"
                                }
                            >
                                {service.estado === "abierto"
                                    ? "Abierto"
                                    : service.estado === "en_proceso"
                                    ? "En curso"
                                    : service.estado}
                            </span>
                        </div>

                        {service.image_url && (
                            <div className="mb-3">
                                <img
                                    src={service.image_url}
                                    alt="Servicio"
                                    className="img-fluid rounded"
                                    style={{
                                        width: "100%",
                                        maxHeight: "180px",
                                        objectFit: "cover",
                                        border: "1px solid var(--border)"
                                    }}
                                />
                            </div>
                        )}

                        <p className="mb-2" style={{ fontSize: ".86rem" }}>
                            <strong>Descripción:</strong> {service.descripcion}
                        </p>

                        <p className="text-muted mb-2" style={{ fontSize: ".84rem" }}>
                            <strong>Origen:</strong> {service.address_start || "No especificado"}
                        </p>

                        <p className="text-muted mb-2" style={{ fontSize: ".84rem" }}>
                            <strong>Destino:</strong> {service.address_finish || "No especificado"}
                        </p>

                        <p className="mb-1" style={{ fontSize: ".84rem" }}>
                            <strong>Urgencia:</strong> {service.urgencia}
                        </p>

                        <p className="mb-1" style={{ fontSize: ".84rem" }}>
                            <strong>Precio propuesto:</strong>{" "}
                            {service.precio_propuesto ?? "No especificado"}
                        </p>

                        {service.tiempo_estimado && (
                            <p className="mb-1 text-primary" style={{ fontSize: ".84rem" }}>
                                <strong>⏳ Tiempo estimado IA:</strong> {service.tiempo_estimado}
                            </p>
                        )}

                        {service.precio_recomendado && (
                            <p className="mb-1 text-success" style={{ fontSize: ".84rem" }}>
                                <strong>💰 Precio recomendado IA:</strong> ${service.precio_recomendado}
                            </p>
                        )}

                        <p className="mb-3 text-muted" style={{ fontSize: ".8rem" }}>
                            <strong>Creado:</strong>{" "}
                            {new Date(service.created_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                        <Link to={`/client/services/${service.id}`} className="w-100">
                            <button className={`${buttonVariant} w-100`}>
                                {isInProgress ? "Ver detalle / chat" : "Ver detalle"}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container-fluid px-0">

            <ClientSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h3 className="fw-bold mb-5" style={{ marginBottom: "2rem" }}>
                                Bienvenido, {loggedClient?.full_name || "Cliente"} 👋
                            </h3>

                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Mis servicios
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Gestioná tus servicios abiertos, en curso y finalizados.
                            </p>
                        </div>

                        <Link to="/client/services/new">
                            <button className="btn-export">
                                <i className="bi bi-plus-circle"></i>
                                Nuevo servicio
                            </button>
                        </Link>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                    Servicios abiertos
                                </div>
                                <div className="stat-value">{openServices.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-folder2-open"></i>
                                        Esperando propuestas
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#22c55e" }}></span>
                                    Servicios en curso
                                </div>
                                <div className="stat-value">{inProgressServices.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-chat-dots"></i>
                                        Con liner asignado
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <span className="stat-dot" style={{ background: "#8b5cf6" }}></span>
                                    Historial
                                </div>
                                <div className="stat-value">{history.length}</div>
                                <div>
                                    <span className="stat-badge">
                                        <i className="bi bi-clock-history"></i>
                                        Servicios cerrados
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Cargando servicios...</h6>
                            </div>
                            <div className="p-4 text-muted">
                                Esperá un momento mientras obtenemos tus servicios.
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6>Error</h6>
                            </div>
                            <div className="p-4 text-danger">{error}</div>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            <div className="mb-5">
                                <div className="table-card">
                                    <div className="table-card-header">
                                        <h6>Servicios abiertos</h6>
                                    </div>

                                    <div className="p-3">
                                        {openServices.length === 0 ? (
                                            <div className="text-muted p-2">
                                                No tenés servicios abiertos en este momento.
                                            </div>
                                        ) : (
                                            <div className="row g-3">
                                                {openServices.map((service) =>
                                                    renderServiceCard(service)
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <div className="table-card">
                                    <div className="table-card-header">
                                        <h6>Servicios en curso</h6>
                                    </div>

                                    <div className="p-3">
                                        {inProgressServices.length === 0 ? (
                                            <div className="text-muted p-2">
                                                No tenés servicios en curso en este momento.
                                            </div>
                                        ) : (
                                            <div className="row g-3">
                                                {inProgressServices.map((service) =>
                                                    renderServiceCard(service)
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="table-card">
                                    <div className="table-card-header">
                                        <h6>Historial</h6>
                                    </div>

                                    <div className="p-3">
                                        {history.length === 0 ? (
                                            <div className="text-muted p-2">
                                                No existen servicios anteriores.
                                            </div>
                                        ) : (
                                            <div className="row g-3">
                                                {history.map((service) =>
                                                    renderServiceCard(service)
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};