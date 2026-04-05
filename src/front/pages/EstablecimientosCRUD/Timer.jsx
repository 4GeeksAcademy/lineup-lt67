import { useState, useEffect } from "react";

export const Timer = ({ onExpire }) => {
    const [segundos, setSegundos] = useState(300)

    useEffect(() => {
        const intervalo = setInterval(() => {
            setSegundos(prev => {
                if (prev <= 1) {
                    clearInterval(intervalo)
                    onExpire()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(intervalo)
    }, [])

    const minutos = Math.floor(segundos / 60)
    const segs = segundos % 60

    return (
        <span className="timer">
            {minutos}:{segs.toString().padStart(2, "0")}
        </span>
    );
};