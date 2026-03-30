import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

export const LinerLogin = () => {
    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    function handleSubmit(e) {
        e.preventDefault();

        fetch(`${backendUrl}/api/liners/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                liner_email: email,
                liner_password: password
            })
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.liner) {
                localStorage.setItem("liner", JSON.stringify(data.liner))
                navigate("/")
            } else {
                setError(data.msg)
            }
        });
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Liner — Iniciar sesión</h3>

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
                    <button type="submit" className="btn btn-primary w-100">Entrar</button>
                </form>
            </div>
        </div>
    );
};