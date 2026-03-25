import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const TicketForm = () => {

    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [idCliente, setidCliente] = useState('')
    const [listaClientes, setListaClientes] = useState([])
    const [listaSucursacles, setListaSucursacles] = useState([])
    const [idSucursal, setidSucursal] = useState('')


    function handleSubmit(e) {
        e.preventDefault();
        

        const data = {
            'client_id': idCliente,
            'id_sucursal': idSucursal,
        }

        fetch(`${backendUrl}/api/tickets`,{
            method: 'POST',
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
        fetch(backendUrl + "/api/clients")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            //dispatch({ type: "set_clients_list", payload: data })
            setListaClientes(data)
            console.log(listaClientes)
        })
    }
    ,[])

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Crear nuevo ticket</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Cliente</label>
                        <select className='form-select' value={idCliente} onChange={(e) => setidCliente(e.target.value)}>
                            <option selected>Seleccione cliente</option>
                            {listaClientes.map((cliente) => {
                                return <option value={cliente.id}>{cliente.full_name}</option>
                            })}
                        </select>
                    </div>


                    <div className="mb-3">
                        <label className="form-label">Sucursal</label>
                        <input
                        type="number"
                        className="form-control"
                        placeholder="Numero Sucursal"
                        value={idSucursal}
                        onChange={(e) => setidSucursal(e.target.value)}
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