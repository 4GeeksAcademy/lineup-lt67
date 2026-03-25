import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Tipos = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [tipos, setTipos] = useState([]);

    function getTipos() {
        fetch(backendUrl + "/api/tipos")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => setTipos(data))
            .catch((error) => console.error(error));
    }

    function deleteTipo(id) {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este tipo?")) return;
        fetch(`${backendUrl}/api/tipos/${id}`, { method: "DELETE" })
            .then((resp) => {
                if (resp.ok) getTipos();
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        getTipos();
    }, []);

    return (
        <div className="container-fluid mx-4">
            <div className="container d-flex justify-content-between align-items-center mb-3">
                <h2>Tipos</h2>
                <Link to="/add_tipo">
                    <button type="button" className="btn btn-primary">Nuevo Tipo</button>
                </Link>
            </div>
            {tipos.length === 0 ?
                (<h4>No hay tipos</h4>) :
                (tipos.map((tipo) => {
                    return (
                        <div className="container d-flex justify-content-between align-items-center my-2 border p-2" key={tipo.id}>
                            <div>
                                <p className="m-0 fw-bold">{tipo.nombre}</p>
                                <p className="m-0 text-muted">{tipo.descripcion || "Sin descripcion"}</p>
                            </div>
                            <div className="d-flex gap-2">
                                <Link to={`${tipo.id}`}>
                            
                                <button type="button" className="btn btn-outline-primary">Detalle</button>
                            </Link>
                            <Link to={`edit/${tipo.id}`}>
                            
                                <button type="button" className="btn btn-primary">Editar Tipo</button>
                            </Link>
                            <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => deleteTipo(tipo.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    );
                }))}
        </div>
    );
};