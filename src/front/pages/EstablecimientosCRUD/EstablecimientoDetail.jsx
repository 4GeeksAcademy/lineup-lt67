import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export const EstablecimientoDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [nombre, setNombre] = useState("");
    const [tipoNombre, setTipoNombre] = useState("");
    const [totalSucursales, setTotalSucursales] = useState("");
    const [clave, setClave] = useState("");
    const [logo, setLogo] = useState("");
    const [sucursales, setSucursales] = useState([]);
    const { id } = useParams();
    

    useEffect(() => {
        fetch(`${backendUrl}/api/establecimientos/${id}`)
            .then((resp) => {
                if (!resp.ok) throw new Error("not found");
                return resp.json();
            })
            .then((data) => {
                setNombre(data.nombre || "");
                setTipoNombre(data.tipo_nombre || "—");
                setTotalSucursales(
                    data.total_sucursales != null ? String(data.total_sucursales) : ""
                );
                setClave(data.clave || "");
                setLogo(data.logo || "");
            })
            .catch(() => {
                setNombre("");
                setTipoNombre("—");
                setTotalSucursales("");
                setClave("");
                setLogo("");
            });

            fetch(`${backendUrl}/api/establecimientos/${id}/sucursales`)
                .then((resp) => resp.json())
                .then((data) => setSucursales(data))
                
    }, [backendUrl, id]);

    return (
        <div className="container-fluid mx-4">
            <div className="container">
                <h2>Establecimiento {nombre}</h2>

                <div className="container">
                    <h4>Nombre</h4>
                    <p>{nombre || "—"}</p>

                    <h4>Tipo</h4>
                    <p>{tipoNombre}</p>

                    <h4>Total sucursales</h4>
                    <p>{totalSucursales}</p>

                    <h4>Clave</h4>
                    <p>{clave}</p>

                    <h4>Logo</h4>
                    {logo ? (
                        <p>
                            <img
                                src={logo}
                                alt={nombre}
                                style={{ maxHeight: "120px", maxWidth: "240px", objectFit: "contain" }}
                            />
                        </p>
                    ) : (
                        <p className="text-muted">Sin logo</p>
                    )}
                </div>

                {/* AQUI ESTA LA LISTA DE SUCURSALES */}

                <div className="container mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>Sucursales</h3>
                        <Link to={`/sucursal/nueva?id_establecimiento=${id}`}>
                            <button className="btn btn-primary">Nueva Sucursal</button>
                        </Link>
                    </div>
                    {sucursales.length === 0 ? (
                        <p>No hay sucursales</p>
                    ) : (
                        sucursales.map((s) => (
                            <div className="container d-flex justify-content-between align-items-center my-2 border p-2" key={s.id}>
                                <div className="d-flex align-items-center gap-3">
                                    {s.imagen ? (
                                        <img
                                            src={s.imagen}
                                            alt={s.nombre}
                                            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                    ) : (
                                        <div style={{ width: "60px", height: "60px", backgroundColor: "#e9ecef", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span className="text-muted small">Sin img</span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="m-0 fw-bold">{s.nombre}</p>
                                        <p className="m-0 text-muted small">
                                            Capacidad: {s.capacidad} · Tiempo por cliente: {s.tiempo_por_cliente} min · Fila activa: {s.fila_activa ? "Sí" : "No"}
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <Link to={`/sucursal/${s.id}`}>
                                        <button className="btn btn-primary">Editar</button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>


            </div>
        </div>
    );
};