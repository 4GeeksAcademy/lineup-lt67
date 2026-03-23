import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Administradores = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { store, dispatch } = useGlobalReducer();

    function getAdministradores(){
        fetch(backendUrl + "/api/administrador")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            dispatch({ type: "set_administradores", payload: data })
            console.log(store.clients)
        })
    }

    useEffect(() =>{
        getAdministradores()
    },[])

    return(
        <div className="container-fluid mx-4">
            <div className="container d-flex justify-content-between align-items-center mb-3">
                <h2>Administradores</h2>
                <Link to="/add_admin">
                    <button type="button" className="btn btn-primary">Nuevo Administrador</button>
                </Link>
            </div>
            {store.administradores.length === 0 ? 
            (<h4>No hay administradores</h4>) :
            (store.administradores.map((admin) => {
                return(
                    <div className="container d-flex justify-content-between align-items-center my-2 border" key={admin.id}>
                        <p>{admin.name}</p>
                        <p>{admin.email}</p>
                        <Link to={`/administradores/${admin.id}`}>
                            <button type="button" className="btn btn-primary">Ver detalle</button>
                        </Link>
                        <Link to={`/administradores/edit/${admin.id}`}>
                            <button type="button" className="btn btn-primary">Editar</button>
                        </Link>
                    </div>
                )
            }))}
        </div>
    )
}