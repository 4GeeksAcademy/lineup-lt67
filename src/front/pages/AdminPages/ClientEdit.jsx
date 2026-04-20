import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const ClientEdit = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            full_name: fullName.trim(),
            email: email.trim(),
            profile_image_url: profileImageUrl.trim() || null,
            address: address.trim() || null,
            lat: lat !== "" ? Number(lat) : null,
            lng: lng !== "" ? Number(lng) : null
        };

        fetch(`${backendUrl}/api/clients/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(async (resp) => {
                const responseData = await resp.json();

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo editar el cliente");
                }

                navigate("/clients");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al editar el cliente");
            });
    }

    function deleteClient() {
        fetch(`${backendUrl}/api/clients/${id}`, { method: "DELETE" })
            .then(async (resp) => {
                if (!resp.ok) {
                    let data = {};
                    try {
                        data = await resp.json();
                    } catch {
                        data = {};
                    }
                    throw new Error(data.msg || "No se pudo borrar el cliente");
                }

                navigate("/clients");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al borrar el cliente");
            });
    }

    useEffect(() => {
        fetch(`${backendUrl}/api/clients/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No se pudo cargar el cliente");
                }

                setFullName(data.full_name || "");
                setEmail(data.email || "");
                setProfileImageUrl(data.profile_image_url || "");
                setAddress(data.address || "");
                setLat(data.lat ?? "");
                setLng(data.lng ?? "");
                setDate(data.created_at || "");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al cargar el cliente");
            });
    }, [backendUrl, id]);

    return (
        <div className="container-fluid px-0">
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Editar cliente
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Modificá los datos del cliente desde el panel administrativo.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Datos editables</h6>
                                </div>

                                <div className="p-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Nombre completo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">URL imagen de perfil</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={profileImageUrl}
                                                onChange={(e) => setProfileImageUrl(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Dirección</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Latitud</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    className="form-control"
                                                    value={lat}
                                                    onChange={(e) => setLat(e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Longitud</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    className="form-control"
                                                    value={lng}
                                                    onChange={(e) => setLng(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Fecha de creación</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={date ? new Date(date).toLocaleString() : ""}
                                                disabled
                                            />
                                        </div>

                                        {error && <p className="text-danger small">{error}</p>}

                                        <div className="d-flex gap-2 flex-wrap mt-4">
                                            <button type="submit" className="btn-export">
                                                <i className="bi bi-check-circle"></i>
                                                Guardar cambios
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={deleteClient}
                                            >
                                                Borrar cliente
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-page"
                                                onClick={() => navigate("/clients")}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Vista previa</h6>
                                </div>

                                <div className="p-4">
                                    {profileImageUrl ? (
                                        <img
                                            src={profileImageUrl}
                                            alt="Preview perfil"
                                            className="img-fluid rounded mb-3"
                                            style={{
                                                width: "100%",
                                                maxHeight: "220px",
                                                objectFit: "cover",
                                                border: "1px solid var(--border)"
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded mb-3"
                                            style={{
                                                height: "200px",
                                                background: "#f8fafc",
                                                border: "1px solid var(--border)",
                                                color: "var(--text-muted)"
                                            }}
                                        >
                                            Sin imagen
                                        </div>
                                    )}

                                    <div className="d-flex flex-column gap-3">
                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">
                                                <span className="stat-dot" style={{ background: "#0d6efd" }}></span>
                                                Nombre
                                            </div>
                                            <div style={{ fontSize: ".9rem", color: "var(--text)" }}>
                                                {fullName || "Sin definir"}
                                            </div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">
                                                <span className="stat-dot" style={{ background: "#22c55e" }}></span>
                                                Email
                                            </div>
                                            <div style={{ fontSize: ".9rem", color: "var(--text)" }}>
                                                {email || "Sin definir"}
                                            </div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">
                                                <span className="stat-dot" style={{ background: "#8b5cf6" }}></span>
                                                Dirección
                                            </div>
                                            <div style={{ fontSize: ".9rem", color: "var(--text)" }}>
                                                {address || "No especificada"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};