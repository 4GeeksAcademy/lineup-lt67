import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClientNavbar } from "../components/ClientNavbar";

export const ClientHome = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [sucursales, setSucursales] = useState([]);
    const [establecimientos, setEstablecimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [sucursalesResp, establecimientosResp] = await Promise.all([
                    fetch(`${backendUrl}/api/sucursal`),
                    fetch(`${backendUrl}/api/establecimientos`)
                ]);

                if (!sucursalesResp.ok) throw new Error("No se pudieron cargar las sucursales");
                if (!establecimientosResp.ok) throw new Error("No se pudieron cargar los establecimientos");

                const sucursalesData = await sucursalesResp.json();
                const establecimientosData = await establecimientosResp.json();

                setSucursales(sucursalesData);
                setEstablecimientos(establecimientosData);
            } catch (err) {
                setError(err.message || "Ocurrió un error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const agruparSucursales = () => {
        const resultado = {};

        sucursales.forEach((sucursal) => {
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

        return resultado;
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
                    <p>No hay sucursales disponibles.</p>
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
                                                            <p className="card-text mb-1">
                                                                <strong>Capacidad:</strong> {sucursal.capacidad}
                                                            </p>
                                                            <p className="card-text mb-1">
                                                                <strong>Tiempo por cliente:</strong> {sucursal.tiempo_por_cliente} min
                                                            </p>
                                                            <p className="card-text mb-3">
                                                                <strong>Fila activa:</strong> {sucursal.fila_activa ? "Sí" : "No"}
                                                            </p>

                                                            <button
                                                                className="btn btn-primary"
                                                                disabled={!sucursal.fila_activa}
                                                                onClick={() => handleJoinQueue(sucursal.id)}
                                                            >
                                                                Unirme a la fila
                                                            </button>
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