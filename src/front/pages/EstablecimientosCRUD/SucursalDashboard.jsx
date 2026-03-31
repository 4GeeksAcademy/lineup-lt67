import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export const SucursalDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="container mt-4">
            <h2>Sucursal {id}</h2>
        </div>
    );
};