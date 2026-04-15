import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import "./EstablecimientoStyles.css";
import logo from "../../assets/lineUP_LogoFULL.svg";

export const EstablecimientoLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("negocio")

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        fetch(`${backendUrl}/api/establecimiento/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nombre.trim(), password }),
        })
            .then(async (resp) => {
                const data = await resp.json();
                if (!resp.ok) throw new Error(data.msg || "No fue posible iniciar sesión");
                localStorage.setItem("tokenEstablecimiento", data.access_token);
                localStorage.setItem("loggedEstablecimiento", JSON.stringify(data.establecimiento));
                dispatch({ type: "set_auth_establecimiento", payload: true });
                navigate("/establecimiento/dashboard");
            })
            .catch((err) => setError(err.message));
    }

    return (
        <div className="login-split">

            <div className="login-left">
                <div style={{ maxWidth: 420, width: "100%" }}>

                    <div className="login-toggle">
                        <button type="button" className={`toggle-btn ${activeTab === "usuario" ? "active" : ""}`} onClick={() => { setActiveTab("usuario"); navigate("/client/login");}} >
                            Usuarios
                        </button>
                        <button type="button" className={`toggle-btn ${activeTab === "negocio" ? "active" : ""}`} onClick={() => setActiveTab("negocio")} >
                            Establecimientos
                        </button>
                    </div>

                    <h2 className="fw-bold mb-1" style={{ fontSize: "1.4rem", color: "#1a1f36" }}>
                        Bienvenido
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-500 mb-1" style={{ fontSize: ".84rem", color: "#6b7a99" }}>
                                Nombre del establecimiento
                            </label>
                            <input
                                type="text"
                                className="login-form-control"
                                placeholder="Nombre de tu establecimiento"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label mb-1" style={{ fontSize: ".84rem", color: "#6b7a99" }}>
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
                            <p className="text-danger mb-3" style={{ fontSize: ".84rem" }}>{error}</p>
                        )}

                        <button type="submit" className="btn-dark-solid">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>

            <div className="login-right">
                <img src={logo} alt="LineUp" height="600px" className="" />
            </div>

        </div>
    );
};