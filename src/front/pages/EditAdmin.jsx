import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const EditAdmin = () => {

    const { id } = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        fetch(`${backendUrl}/api/administrador/${id}`)
        .then((resp) => resp.json())
        .then((data) => {
            setName(data.name)
            setEmail(data.email)
        })
    }, [])

    function handleSubmit(e) {
        e.preventDefault();

        const data = { 'name': name, 'email': email }

        fetch(`${backendUrl}/api/administrador/${id}`, {
            method: 'PUT',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(data)
        })
        .then((resp) => {
            if (resp.ok) navigate('/administradores')
        })
    }

    function deleteAdmin() {
        fetch(`${backendUrl}/api/administrador/${id}`, { method: 'DELETE' })
        .then((resp) => {
            if (resp.ok) navigate('/administradores')
        })
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <button onClick={() => navigate('/administradores')} className="btn-close position-absolute top-0 end-0 m-2"/>
                <h3 className="text-center mb-4">Editar administrador</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Nombre"
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

                    <button type="submit" className="btn btn-primary w-100 mb-2">
                        Guardar cambios
                    </button>
                </form>

                <button onClick={deleteAdmin} className="btn btn-danger w-100">
                    Borrar administrador
                </button>
            </div>
        </div>
    )
}