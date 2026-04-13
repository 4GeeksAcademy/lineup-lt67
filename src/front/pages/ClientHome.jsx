import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClientNavbar } from "../components/ClientNavbar";
import { calculateDistanceInKm } from "../utils/distance";

export const ClientHome = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const loggedClient = JSON.parse(localStorage.getItem("loggedClient"));
    const clientLat = loggedClient?.lat;
    const clientLng = loggedClient?.lng;
    const MAX_DISTANCE_KM = 10;

    const [sucursales, setSucursales] = useState([]);
    const [establecimientos, setEstablecimientos] = useState([]);
    const [myTickets, setMyTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("tokenClient");

                const [sucursalesResp, establecimientosResp, ticketsResp] = await Promise.all([
                    fetch(`${backendUrl}/api/sucursal`),
                    fetch(`${backendUrl}/api/establecimientos`),
                    fetch(`${backendUrl}/api/clients/me/tickets`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })
                ]);

                if (!sucursalesResp.ok) throw new Error("No se pudieron cargar las sucursales");
                if (!establecimientosResp.ok) throw new Error("No se pudieron cargar los establecimientos");
                if (!ticketsResp.ok) throw new Error("No se pudieron cargar los tickets del cliente");

                const sucursalesData = await sucursalesResp.json();
                const establecimientosData = await establecimientosResp.json();
                const ticketsData = await ticketsResp.json();

                setSucursales(sucursalesData);
                setEstablecimientos(establecimientosData);
                setMyTickets(ticketsData);
            } catch (err) {
                setError(err.message || "Ocurrió un error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getSucursalesConDistancia = () => {
        return sucursales.map((sucursal) => {
            const distanceKm = calculateDistanceInKm(
                clientLat,
                clientLng,
                sucursal.lat,
                sucursal.lng
            );

            return {
                ...sucursal,
                distanceKm
            };
        });
    };

    const getSucursalesFiltradas = () => {
        const sucursalesConDistancia = getSucursalesConDistancia();

        // Si el cliente no tiene ubicacion, no se filtra
        if (clientLat == null || clientLng == null) {
            return sucursalesConDistancia;
        }

        return sucursalesConDistancia.filter((sucursal) => {
            if (sucursal.distanceKm == null) return false;
            return sucursal.distanceKm <= MAX_DISTANCE_KM;
        });
    };

    const agruparSucursales = () => {
        const resultado = {};
        const sucursalesFiltradas = getSucursalesFiltradas();

        sucursalesFiltradas.forEach((sucursal) => {
            const establecimiento = establecimientos.find(
                (est) => est.id === sucursal.id_establecimiento
            );

            const tipoNombre = establecimiento?.tipo_nombre || "Sin tipo";
            const establecimientoNombre = establecimiento?.nombre || "Establecimiento sin nombre";

            if (!resultado[tipoNombre]) {
                resultado[tipoNombre] = {};
            }

            if (!resultado[tipoNombre][establecimientoNombre]) {
                resultado[tipoNombre][establecimientoNombre] = [];
            }

            resultado[tipoNombre][establecimientoNombre].push(sucursal);
        });

        Object.keys(resultado).forEach((tipo) => {
            Object.keys(resultado[tipo]).forEach((establecimiento) => {
                resultado[tipo][establecimiento].sort((a, b) => {
                    if (a.distanceKm == null) return 1;
                    if (b.distanceKm == null) return -1;
                    return a.distanceKm - b.distanceKm;
                });
            });
        });

        return resultado;
    };

    const hasActiveTicketInSucursal = (sucursalId) => {
        return myTickets.some(
            (ticket) =>
                ticket.id_sucursal === sucursalId &&
                (ticket.estado === "esperando" || ticket.estado === "en_atencion")
        );
    };

    const handleJoinQueue = async (sucursalId) => {
        const token = localStorage.getItem("tokenClient");

        try {
            const resp = await fetch(`${backendUrl}/api/sucursal/${sucursalId}/join`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No fue posible unirse a la fila");
            }

            navigate("/client/tickets")
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="container-fluid px-0">
            <ClientNavbar />

            <div className="container py-4">
                <h1 className="mb-4">Sucursales disponibles</h1>

                {loading && <p>Cargando sucursales...</p>}
                {error && <p className="text-danger">{error}</p>}

                {!loading && !error && Object.keys(agruparSucursales()).length === 0 && (
                    <p>No hay sucursales dentro del radio seleccionado</p>
                )}

                {!loading && !error &&
                    Object.entries(agruparSucursales()).map(([tipo, establecimientosDelTipo]) => (
                        <div key={tipo} className="mb-5">
                            <h2 className="mb-3">{tipo}</h2>

                            {Object.entries(establecimientosDelTipo).map(
                                ([establecimientoNombre, sucursalesDelEstablecimiento]) => (
                                    <div key={establecimientoNombre} className="mb-4">
                                        <h4 className="mb-3">{establecimientoNombre}</h4>

                                        <div className="row g-3">
                                            {sucursalesDelEstablecimiento.map((sucursal) => (
                                                <div className="col-md-6 col-lg-4" key={sucursal.id}>
                                                    <div className="card h-100 shadow-sm">
                                                        <div className="card-body">
                                                            <h5 className="card-title">{sucursal.nombre}</h5>
                                                            <p><strong>Dirección:</strong> {sucursal.address || "No especificada"}</p>
                                                            {sucursal.distanceKm != null && (
                                                                <p className="card-text mb-1">
                                                                    <strong>Distancia:</strong> {sucursal.distanceKm.toFixed(1)} km
                                                                </p>
                                                            )}
                                                            <p className="card-text mb-1">
                                                                <strong>Capacidad:</strong> {sucursal.capacidad}
                                                            </p>
                                                            <p className="card-text mb-1">
                                                                <strong>Tiempo por cliente:</strong> {sucursal.tiempo_por_cliente} min
                                                            </p>
                                                            <p className="card-text mb-3">
                                                                <strong>Fila activa:</strong> {sucursal.fila_activa ? "Sí" : "No"}
                                                            </p>

                                                            {!sucursal.fila_activa ? (
                                                                <button className="btn btn-secondary" disabled>
                                                                    Fila inactiva
                                                                </button>
                                                            ) : hasActiveTicketInSucursal(sucursal.id) ? (
                                                                <button className="btn btn-outline-secondary" disabled>
                                                                    Ya estás en esta fila
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => handleJoinQueue(sucursal.id)}
                                                                >
                                                                    Unirme a la fila
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};