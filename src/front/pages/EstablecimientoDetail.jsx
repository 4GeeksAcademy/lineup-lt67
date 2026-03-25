import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const EstablecimientoDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [nombre, setNombre] = useState("");
    const [tipoNombre, setTipoNombre] = useState("");
    const [totalSucursales, setTotalSucursales] = useState("");
    const [clave, setClave] = useState("");
    const [logo, setLogo] = useState("");
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
                            <br />
                            <span className="text-muted small">{logo}</span>
                        </p>
                    ) : (
                        <p className="text-muted">Sin logo</p>
                    )}
                </div>
            </div>
        </div>
    );
};