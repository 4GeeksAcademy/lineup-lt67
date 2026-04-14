import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "../../components/AdminNavbar";
import { AdminSidebar } from "../../components/AdminSidebar";

export const TicketForm = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [idCliente, setIdCliente] = useState("");
    const [listaClientes, setListaClientes] = useState([]);
    const [idEstablecimiento, setIdEstablecimiento] = useState("");
    const [listaEstablecimientos, setListaEstablecimientos] = useState([]);
    const [listaSucursales, setListaSucursales] = useState([]);
    const [idSucursal, setIdSucursal] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            client_id: idCliente,
            id_sucursal: idSucursal,
        };

        fetch(`${backendUrl}/api/tickets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(async (resp) => {
                const responseData = await resp.json();

                if (!resp.ok) {
                    throw new Error(responseData.msg || "No se pudo crear el ticket");
                }

                navigate("/tickets");
            })
            .catch((err) => {
                setError(err.message || "Ocurrió un error al crear el ticket");
            });
    }

    function handleEstablecimiento(e) {
        const value = e.target.value;
        setIdEstablecimiento(value);
        setIdSucursal("");

        fetch(`${backendUrl}/api/establecimientos/${value}/sucursales`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                setListaSucursales(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    useEffect(() => {
        fetch(`${backendUrl}/api/clients`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                setListaClientes(data);
            })
            .catch((err) => {
                console.error(err);
            });

        fetch(`${backendUrl}/api/establecimientos`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                setListaEstablecimientos(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [backendUrl]);

    return (
        <div className="container-fluid px-0">
            <AdminNavbar />
            <AdminSidebar />

            <main className="main">
                <div className="page-body">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1.35rem" }}>
                                Nuevo ticket
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: ".9rem" }}>
                                Crear un nuevo ticket manualmente desde el panel administrativo.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Datos del ticket</h6>
                                </div>

                                <div className="p-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Cliente</label>
                                            <select
                                                className="form-select"
                                                value={idCliente}
                                                onChange={(e) => setIdCliente(e.target.value)}
                                                required
                                            >
                                                <option value="">Seleccione cliente</option>
                                                {listaClientes.map((cliente) => (
                                                    <option value={cliente.id} key={cliente.id}>
                                                        {cliente.full_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Establecimiento</label>
                                            <select
                                                className="form-select"
                                                value={idEstablecimiento}
                                                onChange={handleEstablecimiento}
                                                required
                                            >
                                                <option value="">Elige un establecimiento</option>
                                                {listaEstablecimientos.map((establecimiento) => (
                                                    <option value={establecimiento.id} key={establecimiento.id}>
                                                        {establecimiento.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Sucursal</label>
                                            <select
                                                className="form-select"
                                                value={idSucursal}
                                                onChange={(e) => setIdSucursal(e.target.value)}
                                                required
                                            >
                                                <option value="">Elige una sucursal</option>
                                                {listaSucursales.map((sucursal) => (
                                                    <option value={sucursal.id} key={sucursal.id}>
                                                        {sucursal.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {error && <p className="text-danger small">{error}</p>}

                                        <div className="d-flex gap-2 flex-wrap mt-4">
                                            <button type="submit" className="btn-export">
                                                <i className="bi bi-check-circle"></i>
                                                Crear ticket
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-page"
                                                onClick={() => navigate("/tickets")}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h6>Resumen</h6>
                                </div>

                                <div className="p-4">
                                    <div className="d-flex flex-column gap-3">
                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Cliente</div>
                                            <div>{idCliente || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Establecimiento</div>
                                            <div>{idEstablecimiento || "Sin definir"}</div>
                                        </div>

                                        <div className="stat-card" style={{ padding: "1rem" }}>
                                            <div className="stat-label">Sucursal</div>
                                            <div>{idSucursal || "Sin definir"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};