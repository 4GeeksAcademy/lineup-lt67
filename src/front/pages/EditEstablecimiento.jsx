import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const EditEstablecimiento = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [tipoId, setTipoId] = useState("");
    const [totalSucursales, setTotalSucursales] = useState(0);
    const [clave, setClave] = useState("");
    const [logo, setLogo] = useState("");
    const [tipos, setTipos] = useState([]);

    useEffect(() => {
        fetch(`${backendUrl}/api/tipos`)
            .then((r) => r.json())
            .then((data) => setTipos(data))
            .catch(() => setTipos([]));
    }, [backendUrl]);

    useEffect(() => {
        fetch(`${backendUrl}/api/establecimientos/${id}`)
            .then((resp) => resp.json())
            .then((data) => {
                setNombre(data.nombre || "");
                setTipoId(data.tipo_id != null ? String(data.tipo_id) : "");
                setTotalSucursales(data.total_sucursales ?? 0);
                setClave(data.clave || "");
                setLogo(data.logo || "");
            });
    }, [backendUrl, id]);

    function handleSubmit(e) {
        e.preventDefault();
        const data = {
            nombre: nombre.trim(),
            tipo_id: Number(tipoId),
            total_sucursales: Number(totalSucursales) || 0,
            clave: clave.trim(),
            logo: logo.trim() || null,
        };
        fetch(`${backendUrl}/api/establecimientos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((resp) => {
            if (resp.ok) navigate("/establecimientos");
        });
    }

    function borrar() {
        fetch(`${backendUrl}/api/establecimientos/${id}`, { method: "DELETE" }).then((resp) => {
            if (resp.ok) navigate("/establecimientos");
        });
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow" style={{ width: "28rem" }}>
                <h3 className="text-center mb-4">Editar establecimiento</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tipo</label>
                        <select
                            className="form-select"
                            value={tipoId}
                            onChange={(e) => setTipoId(e.target.value)}
                            required
                        >
                            <option value="">Selecciona un tipo</option>
                            {tipos.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Total sucursales</label>
                        <input
                            type="number"
                            className="form-control"
                            min={0}
                            value={totalSucursales}
                            onChange={(e) => setTotalSucursales(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Clave</label>
                        <input
                            type="text"
                            className="form-control"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Logo (URL)</label>
                        <input
                            type="url"
                            className="form-control"
                            placeholder="https://..."
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-2">
                        Guardar
                    </button>
                </form>
                <button type="button" onClick={borrar} className="btn btn-danger w-100">
                    Borrar establecimiento
                </button>
            </div>
        </div>
    );
};
