import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Liners = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { store, dispatch } = useGlobalReducer();

    function getLiners(){
        fetch(backendUrl + "/api/liners")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            dispatch({ type: "set_liners_list", payload: data })
            console.log(store.liners)
        })
    }

    function deleteLiners(id) {

        fetch(`${backendUrl}/api/liners/${id}`,{method: 'DELETE'})
        .then((resp) => {
            console.log(resp)
            getLiners()
        })

    }

    useEffect(() =>{
        getLiners()
    },[])

    return(
        <div className="container-fluid mx-4">
            <div className="container d-flex justify-content-between align-items-center mb-3">
                <h2>Liners</h2>
                <Link to="/add_liner">
                    <button type="button" className="btn btn-primary">Nuevo Liner</button>
                </Link>
            </div>
            {store.liners.length === 0 ? (<h4>No hay liners</h4>) :
            (store.liners.map((liner) => {
                return(
                    <div className="container d-flex justify-content-between align-items-center my-2 border" key={liner.id}>
                        
                        <div className="d-flex gap-5">
                            <p>{liner.nombre}</p>
                            <p>{liner.email}</p>
                        </div>

                        <div>
                            <Link to={`${liner.id}`}>
                                <button type="button" className="btn btn-primary mx-2">Ver Cliente</button>
                            </Link>
                            <Link to={`edit/${liner.id}`}>
                                <button type="button" className="btn btn-primary">Editar Cliente</button>
                            </Link>
                            <Link to={'/liners'}>
                                <button onClick={() => deleteLiners(liner.id)} className="btn btn-danger"> Borrar liner</button>
                            </Link>
                            
                        </div>
                    </div>
                )
            }))}
        </div>
    )
}