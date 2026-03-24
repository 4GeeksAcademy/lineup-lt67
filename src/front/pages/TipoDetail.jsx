import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const TipoDetail = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const { id } = useParams();


    useEffect(() => {
        fetch(`${backendUrl}/api/tipos/${id}`)
            .then((resp) => resp.json())
            .then((data) => {
                setNombre(data.nombre || '');
                setDescripcion(data.descripcion || 'Sin descripción');
            })
            .catch(() => {
                setNombre('');
                setDescripcion('Tipo no encontrado');
            });
    }, [id]);

    return (
        <div className="container-fluid mx-4">
            <div className="container">
                <h2>Tipo {nombre}</h2>

                <div className="container">
                    <h4>Nombre</h4>
                    <p>{nombre}</p>
                    <h4>Descripción</h4>
                    <p>{descripcion}</p>
                </div>
            </div>
        </div>
    );
};