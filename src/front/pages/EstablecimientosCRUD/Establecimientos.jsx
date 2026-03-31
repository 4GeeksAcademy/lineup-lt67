import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Establecimientos = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [items, setItems] = useState([]);

    function load() {
        fetch(`${backendUrl}/api/establecimientos`)
            .then((response) => {
                if (!response.ok) throw new Error(response.status);
                return response.json();
            })
            .then((data) => setItems(data))
            .catch((error) => console.error(error));
    }

    function eliminar(id) {
        if (!window.confirm("¿Eliminar este establecimiento?")) return;
        fetch(`${backendUrl}/api/establecimientos/${id}`, { method: "DELETE" })
            .then((resp) => {
                if (resp.ok) load();
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="container-fluid mx-4">
            <div className="container d-flex justify-content-between align-items-center mb-3">
                <h2>Establecimientos</h2>
                <Link to="/add_establecimiento">
                    <button type="button" className="btn btn-primary">
                        Nuevo establecimiento
                    </button>
                </Link>
            </div>
            {items.length === 0 ? (
                <h4>No hay establecimientos</h4>
            ) : (
                items.map((e) => (
                    <div
                        className="container d-flex justify-content-between align-items-center my-2 border p-2"
                        key={e.id}
                    >
                        <div className="d-flex align-items-center gap-3 flex-wrap">
                            {e.logo ? (
                                <img
                                    src={e.logo}
                                    alt=""
                                    style={{ maxHeight: "48px", maxWidth: "80px", objectFit: "contain" }}
                                />
                            ) : null}
                            <div>
                                <p className="m-0 fw-bold">{e.nombre}</p>
                                <p className="m-0 text-muted small">
                                    Tipo: {e.tipo_nombre || "—"} · Sucursales: {e.total_sucursales} · Clave:{" "}
                                    {e.clave}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <Link to={`/establecimientos/${e.id}/detalle`}>
                                <button type="button" className="btn btn-outline-primary">
                                    Detalle
                                </button>
                            </Link>
                            <Link to={`/establecimientos/${e.id}`}>
                                <button type="button" className="btn btn-primary">
                                    Editar
                                </button>
                            </Link>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => eliminar(e.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};