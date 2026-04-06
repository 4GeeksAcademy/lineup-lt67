import React, { useState } from "react";
import { LocationPicker } from "../components/LocationPicker";

export const SimpleMap = () => {
    const [location, setLocation] = useState({
        lat: -31.4201,
        lng: -64.1888
    });

    return (
        <div className="container py-4">
            <h1 className="mb-4">Prueba de mapa</h1>

            <LocationPicker
                value={location}
                onChange={setLocation}
            />

            <div className="mt-3">
                <p><strong>Latitud:</strong> {location.lat}</p>
                <p><strong>Longitud:</strong> {location.lng}</p>
            </div>
        </div>
    );
};