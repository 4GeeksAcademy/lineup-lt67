import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const LinerLogin = () => {
    const navigate = useNavigate()
    const { dispatch } = useGlobalReducer()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

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
                // Guardar el token si se provee, o el id en localStorage
                localStorage.setItem("linerData", JSON.stringify(data.liner));
                if(data.token) {
                    localStorage.setItem("linerToken", data.token);
                }
                
                // Actualizar flux
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
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow border-warning" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4 text-warning">Liner Login</h3>
                <p className="text-center text-muted small">Inicia sesión en tu cuenta de prestador de servicios.</p>

                {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control"
                            value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control"
                            value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                   <button type="submit" className="btn btn-warning w-100 mb-2">Entrar</button>
                    
                    <Link to="/liner/register" className="btn btn-outline-secondary w-100">
                        Crear una cuenta nueva
                    </Link>
                </form>
            </div>
        </div>
    );
};