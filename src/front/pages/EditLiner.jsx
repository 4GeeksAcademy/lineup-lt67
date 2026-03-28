import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EditLiner = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [foto, setFoto] = useState('');

    
    useEffect(() => {
        fetch(`${backendUrl}/api/liners/${id}`)
        .then((resp) => resp.json())
        .then((data) => {
            setNombre(data.nombre);
            setEmail(data.email);
            setFoto(data.foto || '');
        });
    }, [id]);

    function handleSubmit(e) {
        e.preventDefault();

        const data = {
            liner_nombre: nombre,
            liner_email: email,
            liner_foto: foto || null
        };

        fetch(`${backendUrl}/api/liners/${id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then((resp) => {
            if (resp.ok) navigate('/liners');
        });
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Editar Liner</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control"
                            value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control"
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Foto (URL, opcional)</label>
                        <input type="text" className="form-control" placeholder="https://..."
                            value={foto} onChange={(e) => setFoto(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Guardar cambios</button>
                </form>
            </div>
        </div>
    );
};