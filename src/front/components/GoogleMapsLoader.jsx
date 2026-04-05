import { useEffect, useState } from "react";

let googleMapsPromise = null;

function loadGoogleMaps(apiKey) {
    if (window.google?.maps) {
        return Promise.resolve(window.google);
    }

    if (googleMapsPromise) {
        return googleMapsPromise;
    }

    googleMapsPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
        script.async = true;
        script.defer = true;

        script.onload = () => resolve(window.google);
        script.onerror = () => reject(new Error("No se pudo cargar Google Maps"));

        document.head.appendChild(script);
    });

    return googleMapsPromise;
}

export function useGoogleMaps() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            setLoadError("Falta VITE_GOOGLE_MAPS_API_KEY");
            return;
        }

        loadGoogleMaps(apiKey)
            .then(() => setIsLoaded(true))
            .catch((err) => setLoadError(err.message));
    }, []);

    return { isLoaded, loadError };
}