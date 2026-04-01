import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const LinerRegister = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [linerNombre, setLinerNombre] = useState("");
    const [linerEmail, setLinerEmail] = useState("");
    const [linerPassword, setLinerPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        fetch(`${backendUrl}/api/liners`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                liner_nombre: linerNombre.trim(),
                liner_email: linerEmail.trim(),
                liner_password: linerPassword
            }),
        })
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No fue posible registrar el liner");
                }

                setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");

                setTimeout(() => {
                    navigate("/liner/login");
                }, 1500);
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow border-warning" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4 text-warning">Registro Liner</h3>
                <p className="text-center text-muted small">Crea tu cuenta para ofrecer y aplicar a servicios.</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre completo</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tu nombre y apellido"
                            value={linerNombre}
                            onChange={(e) => setLinerNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="liner@ejemplo.com"
                            value={linerEmail}
                            onChange={(e) => setLinerEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Elige una contraseña"
                            value={linerPassword}
                            onChange={(e) => setLinerPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-danger small">{error}</p>}
                    {success && <p className="text-success small">{success}</p>}

                    <button type="submit" className="btn btn-warning w-100 mb-2">
                        Registrarme
                    </button>

                    <Link to="/liner/login" className="btn btn-outline-secondary w-100">
                        Ya tengo cuenta
                    </Link>
                </form>
            </div>
        </div>
    );
};
