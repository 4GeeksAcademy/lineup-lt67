import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const PropuestaForm = () => {

    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [listaServicios, setListaServicios] = useState([])
    const [listaLiners, setListaLiners] = useState([])
    const [idServicio, setIdServicio] = useState('')
    const [idLiner, setIdLiner] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [precio, setPrecio] = useState('')
    /* const [estado, setEstado] = useState('') */


    function handleSubmit(e) {
        e.preventDefault();
        

        const data = {
            'servicio_id': idServicio,
            'liner_id': idLiner,
            'mensaje': mensaje,
            'precio': precio
        }

        fetch(`${backendUrl}/api/propuestas`,{
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((resp) => {
            if (resp.ok) {
                navigate('/propuestas')
            } else {
                throw new Error(resp.msg)
            }
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
        fetch(backendUrl + "/api/servicios")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            setListaServicios(data)
            console.log(listaServicios)
        })

        fetch(backendUrl + "/api/liners")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            setListaLiners(data)
            console.log(listaLiners)
        })

    }
    ,[])

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4">Crear nueva propuesta</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Servicios</label>
                        <select className='form-select' value={idServicio} onChange={(e) => setIdServicio(e.target.value)}>
                            <option selected>Seleccione el servicio</option>
                            {listaServicios.map((servicio) => {
                                return <option value={servicio.id} key={servicio.id}>{servicio.id} </option>
                            })}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Liners</label>
                        <select className='form-select' value={idLiner} onChange={(e) => setIdLiner(e.target.value)}>
                            <option selected>Seleccione el liner</option>
                            {listaLiners.map((liner) => {
                                return <option value={liner.id} key={liner.id}>{liner.nombre} </option>
                            })}
                        </select>
                    </div>


                    <div className="mb-3">
                        <label className="form-label">Mensaje</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Mensaje"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Precio</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Estado</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Estado"
                        value='pendiente'
                        disabled
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