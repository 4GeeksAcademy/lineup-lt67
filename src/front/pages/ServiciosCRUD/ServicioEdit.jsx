import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const ServicioEdit = () => {

    const { id } = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [idCliente, setIdCliente] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [lugar, setLugar] = useState('')
    const [urgencia, setUrgencia] = useState('')
    const [estado, setEstado] = useState('')
    const [date, setDate] = useState('')
    const [idServicio, setIdServicio] = useState('')
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();

        const data = {
            'descripcion': descripcion,
            'lugar': lugar,
            'urgencia': urgencia,
            'estado': estado
        }

        fetch(`${backendUrl}/api/servicios/${id}`,{
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((resp) => {
            if (resp.ok) navigate('/servicios')
        })

    }

    useEffect(() => {
        fetch(`${backendUrl}/api/servicios/${id}`)
        .then((resp) => resp.json())
        .then((data) => {
            setIdServicio(data.id)
            setIdCliente(data.id_cliente)
            setDescripcion(data.descripcion)
            setLugar(data.lugar)
            setUrgencia(data.urgencia)
            setEstado(data.estado)
            setDate(data.created_at)
        })
    }, [])

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Editar servicio</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Id Servicio</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="Enter full name"
                        value={idServicio}
                        disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Id Cliente</label>
                        <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={idCliente}
                        disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descripcion</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="Enter full name"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">lugar</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="Enter full name"
                        value={lugar}
                        onChange={(e) => setLugar(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">urgencia</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="Enter full name"
                        value={urgencia}
                        onChange={(e) => setUrgencia(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Estado</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="Enter full name"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        required
                        />
                    </div>


                    <div className="mb-3">
                        <label className="form-label">Fecha de creacion</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Fecha de creacion"
                        value={date}
                        disabled
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Editar
                    </button>
                </form>
            </div>
        </div>
    )
}