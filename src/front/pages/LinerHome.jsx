import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const LinerHome = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [serviciosAbiertos, setServiciosAbiertos] = useState([]);
    const [misPropuestas, setMisPropuestas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [imagenExpandidaId, setImagenExpandidaId] = useState(null);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [precioPropuesto, setPrecioPropuesto] = useState("");
    const [mensajeExtra, setMensajeExtra] = useState("");

    const liner = store.linerData || JSON.parse(localStorage.getItem("linerData"));

    useEffect(() => {
        if (!liner) {
            navigate("/liner/login");
            return;
        }

        const fetchData = async () => {
            try {
                const resServicios = await fetch(`${backendUrl}/api/servicios`);
                const dataServicios = await resServicios.json();
                
                const resPropuestas = await fetch(`${backendUrl}/api/propuestas?liner_id=${liner.id}`);
                const dataPropuestas = await resPropuestas.json();

                if (resServicios.ok && resPropuestas.ok) {
                    const misPropuestasIds = dataPropuestas.map(p => p.servicio_id);
                    const abiertos = dataServicios.filter(
                        s => s.estado === "abierto" && !misPropuestasIds.includes(s.id)
                    );

                    setServiciosAbiertos(abiertos);
                    setMisPropuestas(dataPropuestas);
                }
            } catch (error) {
                console.error("Error cargando los datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [liner, navigate, backendUrl]);

    const handleLogout = () => {
        dispatch({ type: "set_auth_liner", payload: false });
        dispatch({ type: "set_liner_data", payload: null });
        localStorage.removeItem("linerToken");
        localStorage.removeItem("linerData");
        navigate("/liner/login");
    };

    const handlePostularse = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch(`${backendUrl}/api/propuestas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    servicio_id: servicioSeleccionado.id,
                    liner_id: liner.id,
                    precio: parseFloat(precioPropuesto),
                    mensaje: mensajeExtra
                })
            });

            if (resp.ok) {
                const nuevaPropuesta = await resp.json();
                setMisPropuestas([...misPropuestas, nuevaPropuesta]);
                setServiciosAbiertos(serviciosAbiertos.filter(s => s.id !== servicioSeleccionado.id));
                
                setServicioSeleccionado(null);
                setPrecioPropuesto("");
                setMensajeExtra("");
                alert("Te has postulado exitosamente al servicio!");
            } else {
                const errorData = await resp.json();
                alert(`Error: ${errorData.msg}`);
            }
        } catch (error) {
            console.error("Error al postularse", error);
            alert("No se pudo completar la postulación");
        }
    };


    if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h2>Panel de Liner</h2>
                <div>
                    <span className="me-3 fw-bold text-dark">Hola, {liner?.nombre}</span>
                    <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-7">
                    <h4 className="text-primary mb-3">Servicios Disponibles</h4>
                    {serviciosAbiertos.length === 0 ? (
                        <div className="alert alert-info">No hay servicios nuevos disponibles en este momento.</div>
                    ) : (
                        serviciosAbiertos.map(servicio => (
                            <div key={servicio.id} className="card mb-3 shadow-sm border-0 position-relative">
                                <span className="badge bg-success position-absolute top-0 end-0 m-2">Abierto</span>
                                <div className="card-body">
                                    <h5 className="card-title text-dark">{servicio.descripcion}</h5>
                                    {servicio.image_url && (
                                        <div className="mb-3">
                                            <img
                                                src={servicio.image_url}
                                                alt="Servicio"
                                                className="img-fluid rounded mb-2"
                                                style={{ maxHeight: "160px", objectFit: "cover" }}
                                            />

                                            <div>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() =>
                                                        setImagenExpandidaId(
                                                            imagenExpandidaId === servicio.id ? null : servicio.id
                                                        )
                                                    }
                                                >
                                                    {imagenExpandidaId === servicio.id ? "Ocultar imagen" : "Ver imagen"}
                                                </button>
                                            </div>

                                            {imagenExpandidaId === servicio.id && (
                                                <div className="mt-3">
                                                    <img
                                                        src={servicio.image_url}
                                                        alt="Servicio ampliado"
                                                        className="img-fluid rounded border"
                                                        style={{ maxHeight: "360px", objectFit: "contain" }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <p className="card-text mb-1"><strong>Dirección:</strong> {servicio.address || "No especificada"}</p>
                                    <p className="card-text mb-1"><i className="fas fa-clock text-warning"></i> <strong>Urgencia:</strong> {servicio.urgencia}</p>
                                    <p className="card-text mb-3"><i className="fas fa-money-bill-wave text-success"></i> <strong>Presupuesto del Cliente:</strong> ${servicio.precio_propuesto}</p>
                                    
                                    <button 
                                        className="btn btn-warning btn-sm" 
                                        onClick={() => setServicioSeleccionado(servicio)}
                                    >
                                        Ofrecer mis servicios
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {servicioSeleccionado && (
                        <div className="card mt-4 border-warning shadow">
                            <div className="card-header bg-warning text-dark fw-bold d-flex justify-content-between align-items-center">
                                Postularse al servicio: {servicioSeleccionado.descripcion}
                                <button className="btn-close" onClick={() => setServicioSeleccionado(null)}></button>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handlePostularse}>
                                    <div className="mb-3">
                                        <label className="form-label">Tu Precio Ofertado ($)</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            value={precioPropuesto} 
                                            onChange={e => setPrecioPropuesto(e.target.value)} 
                                            placeholder={`El cliente sugirió $${servicioSeleccionado.precio_propuesto}`}
                                            required 
                                            min="1"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mensaje al Cliente (opcional)</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="2" 
                                            placeholder="Ej: Tengo experiencia, puedo ir de inmediato."
                                            value={mensajeExtra}
                                            onChange={e => setMensajeExtra(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                        <button type="button" className="btn btn-secondary" onClick={() => setServicioSeleccionado(null)}>Cancelar</button>
                                        <button type="submit" className="btn btn-success">Enviar Propuesta</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-md-5">
                    <h4 className="text-secondary mb-3">Mis Postulaciones</h4>
                    {misPropuestas.length === 0 ? (
                        <div className="alert alert-light border">Aún no has enviado propuestas.</div>
                    ) : (
                        <div className="list-group shadow-sm">
                            {misPropuestas.map(propuesta => {
                                let badgeColor = "bg-secondary";
                               let estadoMostrar = propuesta.estado.toUpperCase();

                                if (propuesta.estado === "aceptada") {
                                    if (propuesta.servicio_estado === "finalizado") {
                                        badgeColor = "bg-dark";
                                        estadoMostrar = "FINALIZADO";
                                    } else {
                                        badgeColor = "bg-success";
                                        estadoMostrar = "ACTIVO";
                                    }
                                } else if (propuesta.estado === "rechazada") {
                                    badgeColor = "bg-danger";
                                } else if (propuesta.estado === "pendiente") {
                                    badgeColor = "bg-warning text-dark";
                                }

                                return (
                                    <div key={propuesta.id} className="list-group-item list-group-item-action flex-column align-items-start border-0 border-bottom">
                                        <div className="d-flex w-100 justify-content-between align-items-center mb-1">
                                            <h6 className="mb-1 text-truncate" style={{maxWidth: "70%"}}>Servicio #{propuesta.servicio_id}</h6>
                                            <span className={`badge rounded-pill ${badgeColor}`}>
                                               {estadoMostrar}
                                            </span>
                                        </div>
                                        <p className="mb-1 small"><strong>Mi oferta:</strong> ${propuesta.precio}</p>
                                        <small className="text-muted d-block">Enviada: {new Date(propuesta.created_at).toLocaleDateString()}</small>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
