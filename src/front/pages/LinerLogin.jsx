import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./EstablecimientosCRUD/EstablecimientoStyles.css";
import logo from "../assets/lineUP_LogoFULL.svg";

export const LinerLogin = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const resp = await fetch(`${backendUrl}/api/liners/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    liner_email: email,
                    liner_password: password
                })
            });

            const data = await resp.json();

            if (resp.ok) {
                localStorage.setItem("linerData", JSON.stringify(data.liner));

                if (data.access_token) {
                    localStorage.setItem("linerToken", data.access_token);
                }

                dispatch({ type: "set_liner_data", payload: data.liner });
                dispatch({ type: "set_auth_liner", payload: true });

                navigate("/liner/home");
            } else {
                setError(data.msg || "Error en inicio de sesión");
            }
        } catch (err) {
            setError("Problema de conexión: " + err.message);
        }
    }

    return (
        <div className="login-split">
            <div className="login-left">
                <div style={{ maxWidth: 420, width: "100%" }}>
                    <h2
                        className="fw-bold mb-1"
                        style={{ fontSize: "1.4rem", color: "#1a1f36" }}
                    >
                        Bienvenido Liner
                    </h2>

                    <p
                        className="mb-4"
                        style={{ fontSize: ".88rem", color: "#6b7a99" }}
                    >
                        Ingresá con tu cuenta de liner para continuar
                    </p>

                    <form onSubmit={handleSubmit}>
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
                            <p
                                className="text-danger mb-3"
                                style={{ fontSize: ".84rem" }}
                            >
                                {error}
                            </p>
                        )}

                        <button type="submit" className="btn-dark-solid mb-3">
                            Entrar
                        </button>

                        <Link
                            to="/liner/register"
                            className="btn btn-outline-secondary w-100"
                            style={{
                                borderRadius: "14px",
                                padding: ".78rem 1rem",
                                fontWeight: 600
                            }}
                        >
                            Crear cuenta
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