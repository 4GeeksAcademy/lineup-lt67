import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClientNavbar } from "../components/ClientNavbar"

export const ClientServices = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const loadServices = async () => {
        const token = localStorage.getItem("tokenClient");

        try {
            setLoading(true)
            setError("")

            const resp = await fetch(`${backendUrl}/api/clients/me/services`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await resp.json()

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudieron cargar los servicios en este momento")
            }

            setServices(data);
        } catch (err) {
            setError(err.message || "Ocurrio un error al cargar los servicios")
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadServices()
    }, [])

    const activeService = services.find(
        (service) => service.estado === "abierto" || service.estado === "en_proceso"
    )

    const history = services.filter(
        (service) => service.estado !== "abierto" && service.estado !== "en_proceso"
    )

    return (
        <div className="container-fluid px-0">
            <ClientNavbar />

            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="mb-0">Mis servicios</h1>

                    <Link to="/client/services/new">
                        <button className="btn btn-primary">Nuevo servicio</button>
                    </Link>
                </div>

                {loading && <p>Cargando servicios...</p>}
                {error && <p className="text-danger">{error}</p>}

                {!loading && !error && (
                    <>
                        <div className="mb-5">
                            <h2 className="mb-3">Servicio activo</h2>

                            {!activeService ? (
                                <div className="alert alert-secondary">
                                    No tenés ningún servicio activo en este momento.
                                </div>
                            ) : (
                                <div className="card shadow-sm border-primary">
                                    <div className="card-body">
                                        <h5 className="card-title">Servicio #{activeService.id}</h5>
                                        <p className="card-text mb-1">
                                            <strong>Descripción:</strong> {activeService.descripcion}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Lugar:</strong> {activeService.lugar}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Urgencia:</strong> {activeService.urgencia}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Precio propuesto:</strong>{" "}
                                            {activeService.precio_propuesto ?? "No especificado"}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Estado:</strong> {activeService.estado}
                                        </p>
                                        {activeService.tiempo_estimado && (
                                            <p className="mb-1 text-primary">
                                                <strong>⏳ Tiempo estimado IA:</strong> {activeService.tiempo_estimado}
                                            </p>
                                        )}
                                        {activeService.precio_recomendado && (
                                            <p className="mb-1 text-success">
                                                <strong>💰 Precio recomendado IA:</strong> ${activeService.precio_recomendado}
                                            </p>
                                        )}
                                        <p className="card-text mb-3">
                                            <strong>Creado:</strong>{" "}
                                            {new Date(activeService.created_at).toLocaleString()}
                                        </p>

                                        <Link to={`/client/services/${activeService.id}`}>
                                            <button className="btn btn-outline-primary">
                                                Ver detalle
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="mb-3">Historial</h2>

                            {history.length === 0 ? (
                                <div className="alert alert-light border">
                                    No existen servicios anteriores.
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {history.map((service) => (
                                        <div className="col-md-6 col-lg-4" key={service.id}>
                                            <div className="card h-100 shadow-sm">
                                                <div className="card-body">
                                                    <h5 className="card-title">Servicio #{service.id}</h5>
                                                    <p className="card-text mb-1">
                                                        <strong>Descripción:</strong> {service.descripcion}
                                                    </p>
                                                    <p className="card-text mb-1">
                                                        <strong>Lugar:</strong> {service.lugar}
                                                    </p>
                                                    <p className="card-text mb-1">
                                                        <strong>Urgencia:</strong> {service.urgencia}
                                                    </p>
                                                    <p className="card-text mb-1">
                                                        <strong>Precio propuesto:</strong>{" "}
                                                        {service.precio_propuesto ?? "No especificado"}
                                                    </p>
                                                    <p className="card-text mb-1">
                                                        <strong>Estado:</strong> {service.estado}
                                                    </p>
                                                    {service.tiempo_estimado && (
                                                        <p className="mb-1 text-primary">
                                                            <strong>⏳ Tiempo estimado IA:</strong> {service.tiempo_estimado}
                                                        </p>
                                                    )}
                                                    {service.precio_recomendado && (
                                                        <p className="mb-1 text-success">
                                                            <strong>💰 Precio recomendado IA:</strong> ${service.precio_recomendado}
                                                        </p>
                                                    )}  
                                                    <p className="card-text mb-3">
                                                        <strong>Creado:</strong>{" "}
                                                        {new Date(service.created_at).toLocaleString()}
                                                    </p>

                                                    <Link to={`/client/services/${service.id}`}>
                                                        <button className="btn btn-outline-secondary">
                                                            Ver detalle
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}