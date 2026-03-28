import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const PropuestaForm = () => {

    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [listaClientes, setListaClientes] = useState([])
    const [idCliente, setIdCliente] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [lugar, setLugar] = useState('')
    const [urgencia, setUrgencia] = useState('')
    const [estado, setEstado] = useState('')


    function handleSubmit(e) {
        e.preventDefault();
        

        const data = {
            'client_id': idCliente,
            'descripcion': descripcion,
            'lugar': lugar,
            'urgencia': urgencia,
            'estado': estado
        }

        fetch(`${backendUrl}/api/servicios`,{
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((resp) => {
            if (resp.ok) navigate('/servicios')
        })

    }

    /* function handleEstablecimiento(e){
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
    } */

    useEffect(() => {
        fetch(backendUrl + "/api/clients")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            setListaClientes(data)
            console.log(listaClientes)
        })

    }
    ,[])

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Crear nuevo servicio</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Cliente</label>
                        <select className='form-select' value={idCliente} onChange={(e) => setIdCliente(e.target.value)}>
                            <option selected>Seleccione cliente</option>
                            {listaClientes.map((cliente) => {
                                return <option value={cliente.id} key={cliente.id}>{cliente.full_name} </option>
                            })}
                        </select>
                    </div>


                    <div className="mb-3">
                        <label className="form-label">Descripcion</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Describa el servicio"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Lugar</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Describa el servicio"
                        value={lugar}
                        onChange={(e) => setLugar(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Urgencia</label>
                        <select defaultValue='' className='form-select' value={urgencia} onChange={(e) => setUrgencia(e.target.value)}>
                            <option value="" disabled>Elige una opcion</option>
                            <option value="baja">Baja</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Estado</label>
                        <select defaultValue='' className='form-select' value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="" disabled>Elige una opcion</option>
                            <option value="abierto">Abierto</option>
                            <option value="en_proceso">en_proceso</option>
                            <option value="finalizado">finalizado</option>
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