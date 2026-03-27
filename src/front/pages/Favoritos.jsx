import React, { useEffect, useState } from "react";

export const Favoritos = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [clients, setClients] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [clientId, setClientId] = useState("");
    const [sucursalId, setSucursalId] = useState("");
    const [favoritos, setFavoritos] = useState([]);

    function loadClients() {
        fetch(`${backendUrl}/api/clients`)
            .then((r) => r.json())
            .then((data) => setClients(data))
            .catch((e) => console.error(e));
    }

    function loadSucursales() {
        fetch(`${backendUrl}/api/sucursal`)
            .then((r) => r.json())
            .then((data) => setSucursales(data))
            .catch((e) => console.error(e));
    }

    function loadFavoritos() {
        if (!clientId) return;
        fetch(`${backendUrl}/api/clients/${clientId}/favoritos`)
            .then((r) => r.json())
            .then((data) => setFavoritos(Array.isArray(data) ? data : []))
            .catch((e) => console.error(e));
    }

    function addFavorito() {
        if (!clientId || !sucursalId) return;
        fetch(`${backendUrl}/api/clients/${clientId}/favoritos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_sucursal: Number(sucursalId) }),
        })
            .then((resp) => {
                if (resp.ok) {
                    setSucursalId("");
                    loadFavoritos();
                }
            })
            .catch((e) => console.error(e));
    }

    function deleteFavorito(favoritoId) {
        if (!clientId) return;
        if (!window.confirm("¿Eliminar este favorito?")) return;
        fetch(`${backendUrl}/api/clients/${clientId}/favoritos/${favoritoId}`, {
            method: "DELETE",
        })
            .then((resp) => {
                if (resp.ok) loadFavoritos();
            })
            .catch((e) => console.error(e));
    }

    useEffect(() => {
        loadClients();
        loadSucursales();
        const loggedClient = localStorage.getItem("loggedClient");
        if (loggedClient) {
            try {
                const parsed = JSON.parse(loggedClient);
                if (parsed?.id) setClientId(String(parsed.id));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    useEffect(() => {
        loadFavoritos();
    }, [clientId]);

    return (
        <div className="container-fluid mx-4">
            <div className="container d-flex justify-content-between align-items-center mb-3">
                <h2>Favoritos</h2>
            </div>

            <div className="container border p-3 mb-3">
                <div className="row g-2 align-items-end">
                    <div className="col-12 col-md-4">
                        <label className="form-label">Cliente</label>
                        <select
                            className="form-select"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                        >
                            <option value="">Selecciona un cliente</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.full_name} ({c.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label">Sucursal</label>
                        <select
                            className="form-select"
                            value={sucursalId}
                            onChange={(e) => setSucursalId(e.target.value)}
                            disabled={!clientId}
                        >
                            <option value="">Selecciona una sucursal</option>
                            {sucursales.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.nombre} (Establecimiento #{s.id_establecimiento})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12 col-md-2">
                        <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={addFavorito}
                            disabled={!clientId || !sucursalId}
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            </div>

            {!clientId ? (
                <h4>Selecciona un cliente para ver sus favoritos</h4>
            ) : favoritos.length === 0 ? (
                <h4>No hay favoritos</h4>
            ) : (
                favoritos.map((f) => (
                    <div
                        className="container d-flex justify-content-between align-items-center my-2 border p-2"
                        key={f.id}
                    >
                        <div>
                            <p className="m-0 fw-bold">
                                {f.establecimiento_nombre || "Establecimiento"} · {f.sucursal_nombre || "Sucursal"}
                            </p>
                            <p className="m-0 text-muted small">
                                Establecimiento ID: {f.id_establecimiento ?? "—"} · Sucursal ID: {f.id_sucursal}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => deleteFavorito(f.id)}
                        >
                            Eliminar
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

