import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const Servicios = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { store, dispatch } = useGlobalReducer();
    const [ listaServicios, setListaServicios ] = useState([])

    function getServicios(){
        fetch(backendUrl + "/api/servicios")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            setListaServicios(data)
            console.log(data)
        })
    }

    function deleteServicio(id) {

        fetch(`${backendUrl}/api/servicios/${id}`,{method: 'DELETE'})
        .then((resp) => {
            console.log(resp)
            getServicios()
        })

    }

    useEffect(() =>{
        getServicios()
    },[])

    return(
        <div className="container-fluid mx-4">
            <div className="container d-flex justify-content-between align-items-center mb-3">
                <h2>servicios</h2>
                <Link to="/add_servicios">
                    <button type="button" className="btn btn-primary">Nuevo Servicio</button>
                </Link>
            </div>
            {listaServicios.length === 0 ? 
            (<h4>No hay servicios</h4>) :
            (listaServicios.map((servicio) => {
                return(
                    <div className="container d-flex justify-content-between align-items-center my-2 border p-3 flex-wrap" key={servicio.id}>
                        <div>
                            <p
                            className="mb-1"><strong>Lugar:</strong> {servicio.lugar}</p>
                            <p className="mb-1"><strong>Urgencia:</strong> {servicio.urgencia}</p>
                            <p className="mb-1"><strong>Estado:</strong> {servicio.estado}</p>
                            {servicio.tiempo_estimado && (
                                <p className="mb-1 text-primary"><strong>⏳ Tiempo estimado IA:</strong> {servicio.tiempo_estimado}</p>
                            )}
                            {servicio.precio_recomendado && (
                                <p className="mb-1 text-success"><strong>💰 Precio recomendado IA:</strong> ${servicio.precio_recomendado}</p>
                            )}
                        </div>
                        <div className="d-flex gap-2">
                            <Link to={`${servicio.id}`}>
                                <button type="button" className="btn btn-primary btn-sm">Ver</button>
                            </Link>
                            <Link to={`edit/${servicio.id}`}>
                                <button type="button" className="btn btn-warning btn-sm">Editar</button>
                            </Link>
                            <button onClick={() => deleteServicio(servicio.id)} className="btn btn-danger btn-sm">Borrar</button>
                        </div>
                    </div>
                )
            }))}
        </div>
    )
}