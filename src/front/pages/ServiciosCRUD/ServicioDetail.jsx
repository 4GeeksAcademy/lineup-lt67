import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const ServicioDetail = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [idCliente, setIdCliente] = useState('')
    const [idSucursal, setIdSucursal] = useState('')
    const [estado, setEstado] = useState('')
    const [posicion, setPosicion] = useState('')
    const [date, setDate] = useState('')
    const [servicio, setServicio] = useState({})
    const { id } = useParams()


    useEffect(() =>{
        fetch(`${backendUrl}/api/tickets/${id}`)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            setServicio(data)
            /* setIdCliente(data.id_cliente)
            setIdSucursal(data.id_sucursal)
            setEstado(data.estado)
            setPosicion(data.posicion)
            setDate(data.created_at) */
        })
    },[])

    return(
        <div className="container-fluid mx-4">
            <div className="container">
                <h2>Ticket {id}</h2>
                
                <div className="container">
                        {Object.entries(servicio).map((e) => {
                            return <h5>{e[0]} : {e[1]}</h5>
                        })}
                </div>
            </div>
        </div>
    )
}