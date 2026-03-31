import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const EstablecimientoForm = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [nombre, setNombre] = useState("");
    const [tipoId, setTipoId] = useState("");
    const [totalSucursales, setTotalSucursales] = useState(0);
    const [password, setPassword] = useState("");
    const [logo, setLogo] = useState("");
    const [tipos, setTipos] = useState([]);

    useEffect(() => {
        fetch(`${backendUrl}/api/tipos`)
            .then((r) => r.json())
            .then((data) => setTipos(data))
            .catch(() => setTipos([]));
    }, [backendUrl]);

    function handleSubmit(e) {
        e.preventDefault();
        const data = {
            nombre: nombre.trim(),
            tipo_id: Number(tipoId),
            total_sucursales: Number(totalSucursales) || 0,
            password: password.trim(),
            logo: logo.trim() || null,
        };
        fetch(`${backendUrl}/api/establecimientos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((resp) => {
            if (resp.ok) navigate("/establecimientos");
        });
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow" style={{ width: "28rem" }}>
                <h3 className="text-center mb-4">Nuevo establecimiento</h3>

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
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={ password } onChange = {(e) => setPassword(e.target.value)} required />
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

                    <button type="submit" className="btn btn-primary w-100">
                        Crear
                    </button>
                </form>
            </div>
        </div>
    );
};
