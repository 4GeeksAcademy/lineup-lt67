import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./EstablecimientoDashboard.css"

export const EstablecimientoLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        fetch(`${backendUrl}/api/establecimiento/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nombre: nombre.trim(), password }),
        })
            .then(async (resp) => {
                const data = await resp.json();
                if (!resp.ok) {
                    throw new Error(data.msg || "No fue posible iniciar sesión como establecimiento");
                }
                // Guardar el token y la sesión
                localStorage.setItem("tokenEstablecimiento", data.access_token);
                localStorage.setItem("loggedEstablecimiento", JSON.stringify(data.establecimiento));
                
                // Actualizar Global Store
                dispatch({ type: "set_auth_establecimiento", payload: true });

                // Redirigir al inicio de administración
                navigate("/establecimiento/dashboard");
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow border-primary" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4 text-primary">Login Establecimiento</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="nombre de establecimiento"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-danger small">{error}</p>}

                    <button type="submit" className="btn btn-primary w-100">
                        Entrar al Panel
                    </button>
                </form>
            </div>
        </div>
    );
};
