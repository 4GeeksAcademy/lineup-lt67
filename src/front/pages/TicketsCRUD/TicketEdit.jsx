import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const TicketEdit = (props) => {

    const { id } = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [idCliente, setIdCliente] = useState('')
    const [idSucursal, setIdSucursal] = useState('')
    const [estado, setEstado] = useState('')
    const [posicion, setPosicion] = useState('')
    const [date, setDate] = useState('')
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();

        const data = {
            'estado': estado
        }

        fetch(`${backendUrl}/api/tickets/${id}`,{
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((resp) => {
            if (resp.ok) navigate('/tickets')
        })

    }

    useEffect(() => {
        fetch(`${backendUrl}/api/tickets/${id}`)
        .then((resp) => resp.json())
        .then((data) => {
            setIdCliente(data.id_cliente)
            setIdSucursal(data.id_sucursal)
            setEstado(data.estado)
            setPosicion(data.posicion)
            setDate(data.created_at)
        })
    }, [])

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Editar usuario</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Id Cliente</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="Enter full name"
                        value={idCliente}
                        disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">ID Sucursal</label>
                        <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={idSucursal}
                        disabled
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
                        <label className="form-label">Full Name</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="Enter full name"
                        value={posicion}
                        disabled
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