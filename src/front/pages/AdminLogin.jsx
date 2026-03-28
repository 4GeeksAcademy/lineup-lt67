import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AdminLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        fetch(`${backendUrl}/api/administrador/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email.trim(), password }),
        })
            .then(async (resp) => {
                const data = await resp.json();
                if (!resp.ok) {
                    throw new Error(data.msg || "No fue posible iniciar sesión como administrador");
                }
                // Guardar el token y la sesión
                localStorage.setItem("tokenAdmin", data.access_token);
                localStorage.setItem("loggedAdmin", JSON.stringify(data.admin));
                
                // Actualizar Global Store
                dispatch({ type: "set_auth_admin", payload: true });

                // Redirigir al inicio de administración
                navigate("/administradores");
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow border-primary" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4 text-primary">Login Administrador</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="administrador@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
