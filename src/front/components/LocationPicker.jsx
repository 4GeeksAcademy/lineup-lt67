import React, { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "./GoogleMapsLoader";

export const LocationPicker = ({
    value,
    onChange,
    height = "350px",
    defaultCenter = { lat: -31.4201, lng: -64.1888 }
}) => {
    const { isLoaded, loadError } = useGoogleMaps();

    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    const [lat, setLat] = useState(value?.lat ?? defaultCenter.lat);
    const [lng, setLng] = useState(value?.lng ?? defaultCenter.lng);

    useEffect(() => {
        if (value?.lat != null) setLat(value.lat);
        if (value?.lng != null) setLng(value.lng);
    }, [value?.lat, value?.lng]);

    useEffect(() => {
        if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

        const center = {
            lat: Number(lat),
            lng: Number(lng)
        };

        const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 15
        });

        const marker = new window.google.maps.Marker({
            position: center,
            map
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
    }, [isLoaded]);

    useEffect(() => {
        if (!mapInstanceRef.current || !markerRef.current) return;

        const nextPosition = {
            lat: Number(lat),
            lng: Number(lng)
        };

        mapInstanceRef.current.setCenter(nextPosition);
        markerRef.current.setPosition(nextPosition);
    }, [lat, lng]);

    const handleLatChange = (e) => {
        const newLat = e.target.value;
        setLat(newLat);

        if (onChange) {
            onChange({
                lat: Number(newLat),
                lng: Number(lng)
            });
        }
    };

    const handleLngChange = (e) => {
        const newLng = e.target.value;
        setLng(newLng);

        if (onChange) {
            onChange({
                lat: Number(lat),
                lng: Number(newLng)
            });
        }
    };

    if (loadError) {
        return <p className="text-danger">{loadError}</p>;
    }

    return (
        <div>
            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <label className="form-label">Latitud</label>
                    <input
                        type="number"
                        step="any"
                        className="form-control"
                        value={lat}
                        onChange={handleLatChange}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Longitud</label>
                    <input
                        type="number"
                        step="any"
                        className="form-control"
                        value={lng}
                        onChange={handleLngChange}
                    />
                </div>
            </div>

            {!isLoaded ? (
                <p>Cargando mapa...</p>
            ) : (
                <div
                    ref={mapRef}
                    style={{
                        width: "100%",
                        height,
                        borderRadius: "12px",
                        overflow: "hidden"
                    }}
                />
            )}
        </div>
    );
};