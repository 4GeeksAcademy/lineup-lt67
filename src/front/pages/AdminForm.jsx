import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminForm = () => {

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState("")

    function handleSubmit(e) {
        e.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL

        const data = {
            'name': name,
            'email': email,
            'password': password
        }

        fetch(`${backendUrl}/api/administrador`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((resp) => {
            if (resp.ok) navigate('/administradores')
        })
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Crear administrador</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Nombre completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
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
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Crear
                    </button>
                </form>
            </div>
        </div>
    )
}