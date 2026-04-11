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
    const autocompleteContainerRef = useRef(null);
    const autocompleteElementRef = useRef(null);

    const [lat, setLat] = useState(value?.lat ?? defaultCenter.lat);
    const [lng, setLng] = useState(value?.lng ?? defaultCenter.lng);
    const [address, setAddress] = useState(value?.address ?? "");
    const [showMap, setShowMap] = useState(false);

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

            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode(
                { location: { lat: newLat, lng: newLng } },
                (results, status) => {
                    let newAddress = "";

                    if (status === "OK" && results && results.length > 0) {
                        newAddress = results[0].formatted_address;
                        setAddress(newAddress);
                    }

                    if (onChange) {
                        onChange({
                            lat: newLat,
                            lng: newLng,
                            address: newAddress
                        });
                    }
                }
            );
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

    useEffect(() => {
        if (!isLoaded || !autocompleteContainerRef.current || autocompleteElementRef.current) return;

        let cancelled = false;

        const initAutocomplete = async () => {
            try {
                await window.google.maps.importLibrary("places");
                if (cancelled) return;

                const placeAutocomplete = new window.google.maps.places.PlaceAutocompleteElement({
                    placeholder: "Buscá una dirección o lugar"
                });

                autocompleteContainerRef.current.innerHTML = "";
                autocompleteContainerRef.current.appendChild(placeAutocomplete);
                autocompleteElementRef.current = placeAutocomplete;

                placeAutocomplete.addEventListener("gmp-select", async ({ placePrediction }) => {
                    const place = placePrediction.toPlace();
                    await place.fetchFields({
                        fields: ["displayName", "formattedAddress", "location", "viewport"]
                    });

                    if (!place.location) return;

                    const newLat = place.location.lat();
                    const newLng = place.location.lng();
                    const formattedAddress = place.formattedAddress || place.displayName || "";

                    setLat(newLat);
                    setLng(newLng);
                    setAddress(formattedAddress);

                    if (mapInstanceRef.current) {
                        if (place.viewport) {
                            mapInstanceRef.current.fitBounds(place.viewport);
                        } else {
                            mapInstanceRef.current.setCenter({ lat: newLat, lng: newLng });
                            mapInstanceRef.current.setZoom(17);
                        }
                    }

                    if (markerRef.current) {
                        markerRef.current.setPosition({ lat: newLat, lng: newLng });
                    }

                    if (onChange) {
                        onChange({
                            lat: newLat,
                            lng: newLng,
                            address: formattedAddress
                        });
                    }
                });
            } catch (error) {
                console.error("Error inicializando Places Autocomplete:", error);
            }
        };

        initAutocomplete();

        return () => {
            cancelled = true;
        };
    }, [isLoaded, onChange, address]);

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
                <label className="form-label">Buscar dirección o lugar</label>
                <div ref={autocompleteContainerRef} />
            </div>

            {address && (
                <div className="mb-3">
                    <label className="form-label">Dirección seleccionada</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address}
                        readOnly
                    />
                </div>
            )}

            <div className="mb-3">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowMap(!showMap)}
                >
                    {showMap ? "Ocultar mapa" : "Ver mapa / ajustar ubicación"}
                </button>
            </div>

            {showMap && (
                !isLoaded ? (
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
                )
            )}
        </div>
    );
};