import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const PropuestaDetail = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [propuesta, setPropuesta] = useState({})
    const { id } = useParams()


    useEffect(() =>{
        fetch(`${backendUrl}/api/propuestas/${id}`)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            setPropuesta(data)
        })
    },[])

    return(
        <div className="container-fluid mx-4">
            <div className="container">
                <h2>Propuesta {id}</h2>
                
                <div className="container">
                        {Object.entries(propuesta).map((e) => {
                            return <h5>{e[0]} : {e[1]}</h5>
                        })}
                </div>
            </div>
        </div>
    )
}