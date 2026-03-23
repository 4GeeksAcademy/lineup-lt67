import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const ClientDetail = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [date, setDate] = useState('')
    const { store, dispatch } = useGlobalReducer();
    const { id } = useParams()


    useEffect(() =>{
        fetch(`${backendUrl}/api/clients/${id}`)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            setFullName(data.full_name)
            setEmail(data.email)
            setDate(data.created_at)
        })
    },[])

    return(
        <div className="container-fluid mx-4">
            <div className="container">
                <h2>Cliente {fullName}</h2>
                
                <div className="container">
                        <h4>Email</h4><p>{email}</p>
                        <h4>Fecha de creacion</h4><p>{date}</p>
                </div>
            </div>
        </div>
    )
}