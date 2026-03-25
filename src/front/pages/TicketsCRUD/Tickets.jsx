import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const Tickets = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { store, dispatch } = useGlobalReducer();

    function getTickets(){
        fetch(backendUrl + "/api/tickets")
        .then((response) => {
            if (!response.ok){
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((data) => {
            dispatch({ type: "set_tickets", payload: data })
            console.log(data)
        })
    }

    function deleteTicket(id) {

        fetch(`${backendUrl}/api/tickets/${id}`,{method: 'DELETE'})
        .then((resp) => {
            console.log(resp)
            getTickets()
        })

    }

    useEffect(() =>{
        getTickets()
    },[])

    return(
        <div className="container-fluid mx-4">
            <div className="container d-flex justify-content-between align-items-center mb-3">
                <h2>Tickets</h2>
                <Link to="/add_ticket">
                    <button type="button" className="btn btn-primary">Nuevo Ticket</button>
                </Link>
            </div>
            {store.tickets.length === 0 ? 
            (<h4>No hay tickets</h4>) :
            (store.tickets.map((ticket) => {
                return(
                    <div className="container d-flex justify-content-between align-items-center my-2 border" key={ticket.id}>
                        <p>Id Cliente: {ticket.id_cliente}</p>
                        <p>Id Sucursal: {ticket.id_sucursal}</p>
                        <p>estado: {ticket.estado}</p>
                        <p>posicion: {ticket.posicion}</p>
                        <div>
                            <Link to={`${ticket.id}`}>
                                <button type="button" className="btn btn-primary mx-2">Ver Ticket</button>
                            </Link>
                            <Link to={`edit/${ticket.id}`}>
                                <button type="button" className="btn btn-primary">Editar Ticket</button>
                            </Link>
                            <Link to={'/tickets'}>
                                <button onClick={() => deleteTicket(ticket.id)} className="btn btn-danger">Borrar ticket</button>
                            </Link>
                            
                        </div>
                    </div>
                )
            }))}
        </div>
    )
}