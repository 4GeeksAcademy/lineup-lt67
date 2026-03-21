import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Clientes = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { store, dispatch } = useGlobalReducer();

    function getClients(){
        fetch(backendUrl + "/api/clients")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            dispatch({ type: "set_clients_list", payload: data })
            console.log(store.clients)
        })
    }

    useEffect(() =>{
        getClients()
    },[])

    return(
        <div className="container-fluid mx-4">
            <div className="container d-flex justify-content-between align-items-center mb-3">
                <h2>Clientes</h2>
                <button type="button" className="btn btn-primary">Nuevo Cliente</button>
            </div>
            {store.clients.length === 0 ? 
            (<h4>No hay clientes</h4>) :
            (store.clients.map((client) => {
                return(
                    <div className="container d-flex justify-content-between align-items-center my-2 border">
                        <p>{client.full_name}</p>
                        <button type="button" className="btn btn-primary">Editar Cliente</button>
                    </div>
                )
            }))}
        </div>
    )
}