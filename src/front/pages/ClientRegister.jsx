import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LocationPicker } from "../components/LocationPicker";
import "./EstablecimientosCRUD/EstablecimientoStyles.css";
import logo from "../assets/lineUP_LogoFULL.svg";

export const ClientRegister = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [location, setLocation] = useState({
        lat: -31.4201,
        lng: -64.1888,
        address: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleImageUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setUploadingImage(true);
            setError("");

            const resp = await fetch(`${backendUrl}/api/upload/client-profile-image`, {
                method: "POST",
                body: formData
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.msg || "No se pudo subir la imagen");
            }

            setProfileImageUrl(data.image_url);
        } catch (err) {
            setError(err.message || "Ocurrió un error al subir la imagen");
        } finally {
            setUploadingImage(false);
        }
    };

    function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        fetch(`${backendUrl}/api/clients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                full_name: fullName.trim(),
                email: email.trim(),
                password,
                profile_image_url: profileImageUrl || null,
                lat: location.lat,
                lng: location.lng,
                address: location.address
            }),
        })
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.msg || "No fue posible registrar el cliente");
                }

                setSuccess("Registro exitoso. Ahora podés iniciar sesión.");

                setTimeout(() => {
                    navigate("/client/login");
                }, 1200);
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    return (
        <div className="login-split">
            <div className="login-left">
                <div style={{ maxWidth: 460, width: "100%" }}>
                    <h2
                        className="fw-bold mb-1"
                        style={{ fontSize: "1.4rem", color: "#1a1f36" }}
                    >
                        Crear cuenta
                    </h2>

                    <p
                        className="mb-4"
                        style={{ fontSize: ".88rem", color: "#6b7a99" }}
                    >
                        Registrate como cliente para continuar
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label
                                className="form-label fw-500 mb-1"
                                style={{ fontSize: ".84rem", color: "#6b7a99" }}
                            >
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                className="login-form-control"
                                placeholder="Juan Pérez"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label
                                className="form-label fw-500 mb-1"
                                style={{ fontSize: ".84rem", color: "#6b7a99" }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                className="login-form-control"
                                placeholder="cliente@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="form-label mb-1"
                                style={{ fontSize: ".84rem", color: "#6b7a99" }}
                            >
                                Contraseña
                            </label>
                            <input
                                type="password"
                                className="login-form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="form-label fw-500 mb-2"
                                style={{ fontSize: ".84rem", color: "#6b7a99" }}
                            >
                                Ubicación
                            </label>
                            <LocationPicker
                                value={location}
                                onChange={setLocation}
                                height="260px"
                            />
                        </div>

                        <div className="mb-3">
                            <label
                                className="form-label fw-500 mb-1"
                                style={{ fontSize: ".84rem", color: "#6b7a99" }}
                            >
                                Imagen de perfil
                            </label>
                            <input
                                type="file"
                                className="login-form-control"
                                accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                        </div>

                        <div className="mb-3">
                            <button
                                type="button"
                                className="btn-dark-solid"
                                onClick={handleImageUpload}
                                disabled={!selectedFile || uploadingImage}
                                style={{
                                    opacity: !selectedFile || uploadingImage ? 0.7 : 1,
                                    cursor: !selectedFile || uploadingImage ? "not-allowed" : "pointer"
                                }}
                            >
                                {uploadingImage ? "Subiendo imagen..." : "Subir imagen"}
                            </button>
                        </div>

                        {profileImageUrl && (
                            <div className="mb-3">
                                <p
                                    className="text-success mb-2"
                                    style={{ fontSize: ".84rem" }}
                                >
                                    Imagen subida correctamente
                                </p>
                                <img
                                    src={profileImageUrl}
                                    alt="Preview perfil"
                                    className="img-fluid rounded"
                                    style={{
                                        maxHeight: "150px",
                                        objectFit: "cover",
                                        border: "1px solid #d6dbe8"
                                    }}
                                />
                            </div>
                        )}

                        {error && (
                            <p
                                className="text-danger mb-3"
                                style={{ fontSize: ".84rem" }}
                            >
                                {error}
                            </p>
                        )}

                        {success && (
                            <p
                                className="text-success mb-3"
                                style={{ fontSize: ".84rem" }}
                            >
                                {success}
                            </p>
                        )}

                        <button type="submit" className="btn-dark-solid mb-3">
                            Registrarme
                        </button>

                        <Link
                            to="/client/login"
                            className="btn btn-outline-secondary w-100"
                            style={{
                                borderRadius: "14px",
                                padding: ".78rem 1rem",
                                fontWeight: 600
                            }}
                        >
                            Ya tengo cuenta
                        </Link>
                    </form>
                </div>
            </div>

            <div className="login-right">
                <img src={logo} alt="LineUp" height="600px" />
            </div>
        </div>
    );
};