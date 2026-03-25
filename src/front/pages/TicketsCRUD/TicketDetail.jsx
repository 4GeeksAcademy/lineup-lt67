import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const TicketDetail = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [idCliente, setIdCliente] = useState('')
    const [idSucursal, setIdSucursal] = useState('')
    const [estado, setEstado] = useState('')
    const [posicion, setPosicion] = useState('')
    const [date, setDate] = useState('')
    const { store, dispatch } = useGlobalReducer();
    const { id } = useParams()


    useEffect(() =>{
        fetch(`${backendUrl}/api/tickets/${id}`)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            setIdCliente(data.id_cliente)
            setIdSucursal(data.id_sucursal)
            setEstado(data.estado)
            setPosicion(data.posicion)
            setDate(data.created_at)
        })
    },[])

    return(
        <div className="container-fluid mx-4">
            <div className="container">
                <h2>Ticket {id}</h2>
                
                <div className="container">
                        <h4>ID Cliente</h4><p>{idCliente}</p>
                        <h4>ID Sucursal</h4><p>{idSucursal}</p>
                        <h4>Estado</h4><p>{estado}</p>
                        <h4>Posicion</h4><p>{posicion}</p>
                        <h4>Fecha de creacion</h4><p>{date}</p>
                </div>
            </div>
        </div>
    )
}