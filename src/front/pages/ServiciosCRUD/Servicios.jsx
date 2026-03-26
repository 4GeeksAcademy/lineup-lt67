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
                    <div className="container d-flex justify-content-between align-items-center my-2 border" key={servicio.id}>
                        <p>Id Cliente: {servicio.id_cliente}</p>
                        <p>Descripcion: {servicio.id_sucursal}</p>
                        <p>lugar: {servicio.lugar}</p>
                        <p>urgencia: {servicio.urgencia}</p>
                        <p>estado: {servicio.estado}</p>
                        <div>
                            <Link to={`${servicio.id}`}>
                                <button type="button" className="btn btn-primary mx-2">Ver Servicio</button>
                            </Link>
                            <Link to={`edit/${servicio.id}`}>
                                <button type="button" className="btn btn-primary">Editar Servicio</button>
                            </Link>
                            <Link to={'/servicios'}>
                                <button onClick={() => deleteServicio(servicio.id)} className="btn btn-danger">Borrar servicio</button>
                            </Link>
                            
                        </div>
                    </div>
                )
            }))}
        </div>
    )
}