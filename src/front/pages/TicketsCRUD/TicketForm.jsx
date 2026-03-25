import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const TicketForm = () => {

    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [idCliente, setidCliente] = useState('')
    const [listaClientes, setListaClientes] = useState([])
    const [idEstablecimiento, setidEstablecimiento] = useState('')
    const [listaEstablecimientos, setListaEstablecimientos] = useState([])
    const [listaSucursales, setListaSucursales] = useState([])
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

    function handleEstablecimiento(e){
        setidEstablecimiento(e.target.value)


        fetch(backendUrl + "/api/establecimientos/"+ e.target.value + "/sucursales")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            //dispatch({ type: "set_clients_list", payload: data })
            setListaSucursales(data)
            console.log(data)
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

        fetch(backendUrl + "/api/establecimientos")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            //dispatch({ type: "set_clients_list", payload: data })
            setListaEstablecimientos(data)
            console.log(listaEstablecimientos)
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
                                return <option value={cliente.id} key={cliente.id}>{cliente.full_name} </option>
                            })}
                        </select>
                    </div>


                    <div className="mb-3">
                        <label className="form-label">Establecimiento</label>
                        <select defaultValue='' className='form-select' value={idEstablecimiento} onChange={handleEstablecimiento}>
                            <option value="" disabled>Elige un establecimiento</option>
                            {listaEstablecimientos.map((establecimiento) => {
                                return <option value={establecimiento.id} key={establecimiento.id}>{establecimiento.nombre} </option>
                            })}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Sucursal</label>
                        <select defaultValue='' className='form-select' value={idSucursal} onChange={(e) => setidSucursal(e.target.value)}>
                            <option value="" disabled>Elige una sucursal</option>
                            {listaSucursales.map((sucursal) => {
                                return <option value={sucursal.id} key={sucursal.id}>{sucursal.nombre}</option>
                            })}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Crear
                    </button>
                </form>
            </div>
        </div>
    )
}