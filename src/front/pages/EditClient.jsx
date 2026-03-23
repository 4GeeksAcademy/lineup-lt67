import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const EditClient = (props) => {

    const { id } = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [date, setDate] = useState('')
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();

        const data = {
            'full_name': fullName,
            'email': email,
        }

        fetch(`${backendUrl}/api/clients/${id}`,{
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((resp) => {
            if (resp.ok) navigate('/clients')
        })

    }

    function deleteClient() {

        fetch(`${backendUrl}/api/clients/${id}`,{method: 'DELETE'})
        .then((resp) => {
            console.log(resp)
            navigate('/clients')
        })

        /*navigate('/clients')*/
    }

    useEffect(() => {
        fetch(`${backendUrl}/api/clients/${id}`)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            setFullName(data.full_name)
            setEmail(data.email)
            setDate(data.created_at)
        })
    }, [])

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Editar usuario</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                        type="fullName"
                        className="form-control"
                        placeholder="Enter full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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