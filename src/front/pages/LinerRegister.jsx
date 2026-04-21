import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LocationPicker } from "../components/LocationPicker";
import "./EstablecimientosCRUD/EstablecimientoStyles.css";
import logo from "../assets/lineUP_LogoFULL.svg";

export const LinerRegister = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [linerNombre, setLinerNombre] = useState("");
    const [linerEmail, setLinerEmail] = useState("");
    const [linerPassword, setLinerPassword] = useState("");
    const [location, setLocation] = useState({
        lat: -31.4201,
        lng: -64.1888,
        address: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        fetch(`${backendUrl}/api/liners`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                liner_nombre: linerNombre.trim(),
                liner_email: linerEmail.trim(),
                liner_password: linerPassword,
                lat: location.lat,
                lng: location.lng,
                address: location.address
            }),
        })
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No fue posible registrar el liner");
                }

                setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");

                setTimeout(() => {
                    navigate("/liner/login");
                }, 1500);
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    return (
        <div className="login-split">
            <div className="login-left">
                <div style={{ maxWidth: 460, width: "100%" }}>
                    <h2
                        className="fw-bold mb-1"
                        style={{ fontSize: "1.4rem", color: "#1a1f36" }}
                    >
                        Crear cuenta de Liner
                    </h2>

                    <p
                        className="mb-4"
                        style={{ fontSize: ".88rem", color: "#6b7a99" }}
                    >
                        Registrate como liner para comenzar a generar ingresos extras
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label
                                className="form-label fw-500 mb-1"
                                style={{ fontSize: ".84rem", color: "#6b7a99" }}
                            >
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                className="login-form-control"
                                placeholder="Tu nombre y apellido"
                                value={linerNombre}
                                onChange={(e) => setLinerNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label
                                className="form-label fw-500 mb-1"
                                style={{ fontSize: ".84rem", color: "#6b7a99" }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                className="login-form-control"
                                placeholder="liner@ejemplo.com"
                                value={linerEmail}
                                onChange={(e) => setLinerEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="form-label mb-1"
                                style={{ fontSize: ".84rem", color: "#6b7a99" }}
                            >
                                Contraseña
                            </label>
                            <input
                                type="password"
                                className="login-form-control"
                                placeholder="••••••••"
                                value={linerPassword}
                                onChange={(e) => setLinerPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="form-label fw-500 mb-2"
                                style={{ fontSize: ".84rem", color: "#6b7a99" }}
                            >
                                Ubicación
                            </label>
                            <LocationPicker
                                value={location}
                                onChange={setLocation}
                                height="260px"
                            />
                        </div>

                        {error && (
                            <p
                                className="text-danger mb-3"
                                style={{ fontSize: ".84rem" }}
                            >
                                {error}
                            </p>
                        )}

                        {success && (
                            <p
                                className="text-success mb-3"
                                style={{ fontSize: ".84rem" }}
                            >
                                {success}
                            </p>
                        )}

                        <button type="submit" className="btn-dark-solid mb-3">
                            Registrarme
                        </button>

                        <Link
                            to="/liner/login"
                            className="btn btn-outline-secondary w-100"
                            style={{
                                borderRadius: "14px",
                                padding: ".78rem 1rem",
                                fontWeight: 600
                            }}
                        >
                            Ya tengo cuenta
                        </Link>
                    </form>
                </div>
            </div>

            <div className="login-right">
                <img src={logo} alt="LineUp" height="600px" />
            </div>
        </div>
    );
};