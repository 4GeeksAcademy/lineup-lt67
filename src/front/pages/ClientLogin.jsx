import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./EstablecimientosCRUD/EstablecimientoStyles.css";
import logo from "../assets/lineUP_LogoFULL.svg";

export const ClientLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState("usuario")

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        fetch(`${backendUrl}/api/clients/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email.trim(), password }),
        })
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No fue posible iniciar sesión");
                }

                localStorage.setItem("tokenClient", data.access_token);
                localStorage.setItem("loggedClient", JSON.stringify(data.client));

                dispatch({ type: "set_auth_client", payload: true });

                navigate("/client/home");
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    return (
        <div className="login-split">
            <div className="login-left">
                <div style={{ maxWidth: 420, width: "100%" }}>

                    {/* Toggle */}
                    <div className="login-toggle">
                        <button type="button" className={`toggle-btn ${activeTab === "usuario" ? "active" : ""}`} onClick={() => setActiveTab("usuario")} >
                            Usuarios
                        </button>
                        <button type="button" className={`toggle-btn ${activeTab === "negocio" ? "active" : ""}`} onClick={() => { setActiveTab("negocio"); navigate("/establecimiento/login"); }} >
                            Establecimientos
                        </button>
                    </div>

                    <h2 className="fw-bold mb-1" style={{ fontSize: "1.4rem", color: "#1a1f36" }} >
                        Bienvenido
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-500 mb-1" style={{ fontSize: ".84rem", color: "#6b7a99" }} >
                                Email
                            </label>
                            <input
                                type="email"
                                className="login-form-control"
                                placeholder="tuemail@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-danger mb-3" style={{ fontSize: ".84rem" }} >
                                {error}
                            </p>
                        )}

                        <button type="submit" className="btn-dark-solid mb-3">
                            Entrar
                        </button>

                        <p style={{ fontSize: "0.84rem", color: "#6b7a99", textAlign: "center", marginTop: "16px" }}>
                            ¿Aún no tienes cuenta?{" "}
                            <Link to="/client/register" style={{ color: "#1a36ff", fontWeight: 600 }}>
                                Regístrate gratis
                            </Link>{" "}
                            y empieza a usar LINE UP desde el dia de hoy.
                        </p>
                    </form>
                </div>
            </div>

            <div className="login-right">
                <img src={logo} alt="LineUp" height="600px" />
            </div>
        </div>
    );
};