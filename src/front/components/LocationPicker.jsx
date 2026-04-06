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
    const [address, setAddress] = useState(value?.address ?? "");

    useEffect(() => {
        if (value?.lat != null) setLat(value.lat);
        if (value?.lng != null) setLng(value.lng);
        if (value?.address != null) setAddress(value.address);
    }, [value?.lat, value?.lng, value?.address]);

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
            map,
            draggable: true
        });

        marker.addListener("dragend", (event) => {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();

            setLat(newLat);
            setLng(newLng);

            if (onChange) {
                onChange({
                    lat: newLat,
                    lng: newLng,
                    address
                });
            }
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
                lng: Number(lng),
                address
            });
        }
    };

    const handleLngChange = (e) => {
        const newLng = e.target.value;
        setLng(newLng);

        if (onChange) {
            onChange({
                lat: Number(lat),
                lng: Number(newLng),
                address
            });
        }
    };

    const handleAddressSearch = async () => {
        if (!window.google || !address.trim()) return;

        try {
            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ address: address.trim() }, (results, status) => {
                if (status !== "OK" || !results || !results.length) {
                    alert("No se pudo encontrar esa dirección");
                    return;
                }

                const location = results[0].geometry.location;
                const newLat = location.lat();
                const newLng = location.lng();
                const formattedAddress = results[0].formatted_address;

                setLat(newLat);
                setLng(newLng);
                setAddress(formattedAddress);

                if (onChange) {
                    onChange({
                        lat: newLat,
                        lng: newLng,
                        address: formattedAddress
                    });
                }
            });
        } catch (error) {
            alert("Ocurrió un error al buscar la dirección");
        }
    };

    if (loadError) {
        return <p className="text-danger">{loadError}</p>;
    }

    return (
        <div>

            <div className="mb-3">
                <label className="form-label">Dirección</label>
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Escribí una dirección"
                    />
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleAddressSearch}
                    >
                        Buscar
                    </button>
                </div>
            </div>

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