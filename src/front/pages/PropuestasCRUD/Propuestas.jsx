import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const Propuestas = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { store, dispatch } = useGlobalReducer();
    const [ listaPropuestas, setListaPropuestas ] = useState([])

    function getPropuestas(){
        fetch(backendUrl + "/api/propuestas")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            setListaPropuestas(data)
            console.log(data)
        })
    }

    function deletePropuesta(id) {

        fetch(`${backendUrl}/api/propuestas/${id}`,{method: 'DELETE'})
        .then((resp) => {
            console.log(resp)
            getPropuestas()
        })

    }

    useEffect(() =>{
        getPropuestas()
    },[])

    return(
        <div className="container-fluid mx-4">
            <div className="container d-flex justify-content-between align-items-center mb-3">
                <h2>servicios</h2>
                <Link to="/add_propuestas">
                    <button type="button" className="btn btn-primary">Nueva propuesta</button>
                </Link>
            </div>
            {listaPropuestas.length === 0 ? 
            (<h4>No hay propuestas</h4>) :
            (listaPropuestas.map((propuesta) => {
                return(
                    <div className="container d-flex justify-content-between align-items-center my-2 border" key={propuesta.id}>
                        <p>ID servicio: {propuesta.servicio_id}</p>
                        <p>ID Liner: {propuesta.liner_id}</p>
                        <p>precio: {propuesta.precio}</p>
                        <p>mensaje: {propuesta.mensaje}</p>
                        <p>estado: {propuesta.estado}</p>
                        <div>
                            <Link to={`${propuesta.id}`}>
                                <button type="button" className="btn btn-primary mx-2">Ver Propuesta</button>
                            </Link>
                            <Link to={`edit/${propuesta.id}`}>
                                <button type="button" className="btn btn-primary">Editar Propuesta</button>
                            </Link>
                            <Link to={'/propuestas'}>
                                <button onClick={() => deletePropuesta(propuesta.id)} className="btn btn-danger">Borrar propuesta</button>
                            </Link>
                            
                        </div>
                    </div>
                )
            }))}
        </div>
    )
}