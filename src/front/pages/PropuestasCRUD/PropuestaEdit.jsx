import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const PropuestaEdit = () => {

    const { id } = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [idServicio, setIdServicio] = useState('')
    const [idLiner, setIdLiner] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [precio, setPrecio] = useState('')
    const [estado, setEstado] = useState('')
    const [date, setDate] = useState('')
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();

        const data = {
            'mensaje': mensaje,
            'precio': precio,
            'estado': estado
        }

        fetch(`${backendUrl}/api/propuestas/${id}`,{
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((resp) => {
            if (resp.ok) navigate('/propuestas')
        })

    }

    useEffect(() => {
        fetch(`${backendUrl}/api/propuestas/${id}`)
        .then((resp) => resp.json())
        .then((data) => {
            setIdServicio(data.servicio_id)
            setIdLiner(data.liner_id)
            setMensaje(data.mensaje)
            setPrecio(data.precio)
            setEstado(data.estado)
            setDate(data.created_at)
        })
    }, [])

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Editar propuesta</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Id Servicio</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="servicio"
                        value={idServicio}
                        disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Id Liner</label>
                        <input
                        type="email"
                        className="form-control"
                        placeholder="liner"
                        value={idLiner}
                        disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Mensaje</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="mensaje"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Precio</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                        />
                    </div>


                    <div className="mb-3">
                        <label className="form-label">Estado</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="estado"
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