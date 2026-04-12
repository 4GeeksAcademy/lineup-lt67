/**
 * Calcula la distancia en kilómetros entre dos coordenadas geográficas usando la fórmula de Haversine.
 * Actúa matemáticamente como un cálculo cartesiano sobre la esfera de la Tierra.
 * 
 * @param {number} lat1 Latitud del punto 1
 * @param {number} lon1 Longitud del punto 1
 * @param {number} lat2 Latitud del punto 2
 * @param {number} lon2 Longitud del punto 2
 * @returns {number} Distancia en kilómetros (ej. 2.45)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;
    
    // Función para convertir grados a radianes
    const toRad = (value) => (value * Math.PI) / 180;
    
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Number(distance.toFixed(2));
};

/**
 * Estima el tiempo de viaje basado en una distancia asumiendo tráfico urbano estándar.
 * @param {number} distanceKm Distancia en kilómetros
 * @returns {number} Tiempo en minutos
 */
export const estimateTravelTimeMinutes = (distanceKm) => {
    // Velocidad promedio en ciudad (km/h)
    const averageUrbanSpeedKmh = 25; 
    const timeHours = distanceKm / averageUrbanSpeedKmh;
    const timeMinutes = timeHours * 60;
    
    // Sumar 5 minutos de "piso" por maniobras
    return Math.round(timeMinutes + 5);
};