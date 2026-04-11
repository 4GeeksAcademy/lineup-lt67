import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LocationPicker } from "../components/LocationPicker";

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
        <div style={{ minHeight: "100vh", background: "var(--surface)" }}>
            <header className="topnav" style={{ position: "sticky" }}>
                <div className="d-flex align-items-center gap-3">
                    <Link to="/" className="topnav-brand">
                        <svg width="30" height="30" viewBox="260 160 220 240" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#f0f4ff" stroke="#0442f4" strokeWidth="6" d="M307.95,379.91c-7.73,0-13.6-3.74-18.78-7.03-.54-.35-1.09-.69-1.64-1.04-2.23-1.39-5.95-3.73-7.98-8.08-2.32-4.99-.81-9.44.09-12.11l.16-.47c1.92-5.77,4.44-14.21,5.95-22.65-5.62-2.87-10.77-6.49-15.67-11.03-4.95-4.58-14.17-13.12-12.6-23.95.27-1.88,1.02-3.61,2.17-5.06.17-2.98,1.4-5.56,3.61-7.52,2.01-1.79,4.52-2.74,7.24-2.74,1.81,0,3.43.41,4.92.99,4.28-10.83,13.19-22.04,20.7-30.83.27-.32.54-.63.81-.94.83-.95,1.56-1.79,2.07-2.56.02-.69-.25-2.38-1.5-6.44-.24-.76-.46-1.5-.66-2.18-1.48-5.18-2.41-10.79-2.64-15.91-1.17-1.7-1.77-3.69-1.76-5.83.02-2.98,1.07-5.53,3.04-7.43,1.19-5.96,3.39-11.34,6.57-16.03,5.56-8.19,13.36-11.1,18.34-11.1,2.54,0,4.86.73,6.68,2.09.18,0,.36-.01.53-.01,4.03,0,7.44,1.84,9.35,5.04.83,1.38,1.3,2.98,1.39,4.65,2.02,1.2,3.76,2.67,5.27,4.45,6.54.22,9.69,4.63,10.45,8.77.33,1.78.13,3.33-.2,4.54h.01c5.42,0,9.67,1.74,12.61,5.17,2.37,2.77,3.45,6.29,3.04,9.91-.36,3.12-1.83,6.02-4.1,8.2,2.09-.21,4.03-.32,5.81-.32,1.13,0,2.22.04,3.24.13,4.07.34,7.58,2.61,9.53,6.13,2.47,1.92,4.01,4.78,4.37,8.13.16,1.44.06,2.89-.26,4.25,3.62,4.13,4.93,9.96,3.61,16.31-.79,3.83-2.84,7.22-5.8,9.66-.73,2.47-2.7,7.04-9.05,8.94-2.59.78-5.31,1.18-8.29,1.23-3.58,2.45-7.66,4.06-11.96,4.75.42,5.37.08,10.38-1.03,15.56-1.21,5.47-3.46,10.38-6.69,14.62.98,1.59,1.9,3.16,2.79,4.77l3.81,6.86,1.62,2.82c3.64-2.47,6.92-3.68,9.96-3.68,1.76,0,3.42.39,4.92,1.17,1.73.9,3.16,2.26,4.13,3.93,3.39.83,5.29,2.91,6.17,4.19,1.1,1.59,3.32,5.94.24,11.91-3.81,7.36-17.06,17.73-30,17.88h-.24c-9.58,0-12.41-6.64-13.62-9.48-.1-.24-.2-.47-.31-.71-3.44-7.7-7.49-15.2-12.37-22.94l-1.97-2.98c-2.24.3-4.5.46-6.77.46-1.36,0-2.75-.06-4.15-.17l-3.09,11.61c2.22.87,4.6,1.66,6.76,2.37l.87.29c3.82,1.27,13.97,4.64,13.78,13.77-.05,2.48-1.15,10.4-12.81,11.66-1.44,1.7-3.4,2.93-5.5,3.39-1.73.38-3.48.57-5.19.57Z"/>
                            <path fill="#0442f4" d="M359.01,345.68c2.04-1.72,6.83-5.34,9.18-4.12,1.71.88,1.14,3.5.47,5.28,1.87-.39,5.58-1.62,6.81.17,2.72,3.94-11.5,16.61-23.01,16.75-4.67.06-5.2-2.43-6.48-5.27-3.74-8.36-8.08-16.29-12.96-24.02l-5.11-7.74c-6.9,1.83-13.82,1.77-20.91.22l-5.06,19.01c-.6,2.25-1.02,4.26-1.44,6.55,4.11,2.53,10.02,4.41,14.55,5.91,2.52.84,8.15,2.78,8.09,5.7-.09,4.31-8.34,3.75-10.97,3.55.3.91.51,1.59.48,2.2-.02.47-.73,1.23-1.28,1.35-7.63,1.67-13.16-2.5-19.42-6.42-1.89-1.18-3.9-2.49-4.86-4.55-.99-2.13-.11-4.32.59-6.43,3.07-9.24,6.07-20.31,7.21-30.29-7.24-2.83-13.51-6.9-19.17-12.14-4.25-3.94-10.94-10.32-10.02-16.65.22-1.52,1.6-2.24,3.08-1.87-.6-1.81-1.57-4.3-.01-5.68,3.18-2.82,9,4.8,12.22,2.14l.97-3.55c2.97-10.83,13.21-23.49,20.46-31.97,1.37-1.6,2.77-3.08,3.85-4.87,2.43-4.01-.18-10.48-1.46-14.94-1.51-5.27-2.53-11.76-2.36-17.34-.96-.36-1.73-.91-1.72-2.04.02-2.57,2.22-1.57,2.44-3.25.76-5.62,2.57-10.93,5.74-15.6,5.14-7.57,13.65-8.95,13.66-6.03,0,.77-.31,1.52-.56,2.22,2.08-.91,6.52-2.68,7.79-.56.34.56.3,1.83-.21,2.39l-2.38,2.6c5.65,1.34,9.35,3.07,12.11,8.3,2.85.16,6-1.15,6.55,1.81.19,1.04-.57,1.76-.76,2.56-.61,2.56-1.06,5.01-3.13,7.02,1.25,2.46,5.38,2.4,7.79,2.1,3.41-.43,7.95-.91,10.39,1.94,1.91,2.23,1.27,5.45-1.03,7.14-2.86,2.1-6.06,3.35-9.57,4.03-1.16.23-2.04.71-3.06,1.33-6.46,3.9-12.89,1.27-12.93,5.99-.05,5.17,2.56,12.84,4.32,17.9,1.77,1.86,4.06,3.58,6.28,4.84,4.25,2.42,8.99,1.08,11.98-2.59l.71-.87-.92-4.81c-1.66.03-2.18-1.09-2.26-2.39-.12-1.77.4-3.27,2.25-3.76l.12-1.83c.09-1.47,1.13-2.55,2.58-2.83,4.64-.9,10.48-1.73,15.16-1.34,2.07.17,3.31,1.78,3.51,3.79,1.77.2,2.64,1.47,2.82,3.09.15,1.38-.04,2.61-1.73,2.97l.14,3.57c4.95,1.96,6.07,6.57,5.06,11.43-.58,2.8-2.37,5.02-4.98,6.19-.66,2.69-.61,5.09-4.11,6.14-2.83.85-5.66,1-8.66.83-5.15,4.5-12.11,6.15-18.9,4.64,1.65,7.85,2.23,14.41.53,22.29-1.33,6.04-4.33,11.39-9.07,15.47,2.21,3.22,4.17,6.35,6.03,9.7l3.81,6.86,6.51,11.38,4.27-3.59Z"/>
                        </svg>
                        LineUp
                    </Link>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <Link to="/client/login" className="btn-page" style={{ textDecoration: "none" }}>
                        Ya tengo cuenta
                    </Link>
                </div>
            </header>

            <div
                className="d-flex"
                style={{
                    minHeight: "calc(100vh - 58px)",
                    marginTop: "0"
                }}
            >
                <div
                    style={{
                        flex: "0 0 50%",
                        maxWidth: "50%",
                        padding: "3rem 4rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}
                >
                    <div style={{ maxWidth: "520px", width: "100%" }}>
                        <div
                            className="fw-bold mb-4"
                            style={{ fontSize: "1.3rem" }}
                        >
                            Crear cuenta
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nombre completo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Juan Pérez"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <div className="position-relative">
                                    <i
                                        className="bi bi-envelope"
                                        style={{
                                            position: "absolute",
                                            left: ".85rem",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#c0c8d8"
                                        }}
                                    ></i>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="cliente@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ paddingLeft: "2.4rem" }}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Contraseña</label>
                                <div className="position-relative">
                                    <i
                                        className="bi bi-lock"
                                        style={{
                                            position: "absolute",
                                            left: ".85rem",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#c0c8d8"
                                        }}
                                    ></i>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Elegí una contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ paddingLeft: "2.4rem" }}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Ubicación</label>
                                <LocationPicker
                                    value={location}
                                    onChange={setLocation}
                                    height="260px"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Imagen de perfil</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                />
                            </div>

                            <div className="mb-3">
                                <button
                                    type="button"
                                    className="w-100"
                                    onClick={handleImageUpload}
                                    disabled={!selectedFile || uploadingImage}
                                    style={{
                                        background: "var(--surface)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "10px",
                                        padding: ".65rem 1rem",
                                        fontSize: ".9rem",
                                        fontWeight: 500,
                                        color: "var(--text)",
                                        cursor: !selectedFile || uploadingImage ? "not-allowed" : "pointer",
                                        opacity: !selectedFile || uploadingImage ? 0.7 : 1
                                    }}
                                >
                                    {uploadingImage ? "Subiendo imagen..." : "Subir imagen"}
                                </button>
                            </div>

                            {profileImageUrl && (
                                <div className="mb-3 text-center">
                                    <p className="small text-success mb-2">Imagen subida correctamente</p>
                                    <img
                                        src={profileImageUrl}
                                        alt="Preview perfil"
                                        className="img-fluid rounded"
                                        style={{
                                            maxHeight: "150px",
                                            objectFit: "cover",
                                            border: "1px solid var(--border)"
                                        }}
                                    />
                                </div>
                            )}

                            {error && <p className="text-danger small mb-3">{error}</p>}
                            {success && <p className="text-success small mb-3">{success}</p>}

                            <button
                                type="submit"
                                className="w-100 mb-3"
                                style={{
                                    background: "var(--text)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "10px",
                                    padding: ".7rem 1rem",
                                    fontSize: ".92rem",
                                    fontWeight: 600
                                }}
                            >
                                Registrarme
                            </button>

                            <div
                                className="d-flex align-items-center gap-3 mb-3"
                                style={{ color: "var(--text-muted)", fontSize: ".82rem" }}
                            >
                                <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
                                <span>o</span>
                                <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
                            </div>

                            <Link
                                to="/client/login"
                                className="w-100 d-inline-flex align-items-center justify-content-center"
                                style={{
                                    background: "var(--surface)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "10px",
                                    padding: ".7rem 1rem",
                                    fontSize: ".9rem",
                                    fontWeight: 500,
                                    color: "var(--text)",
                                    textDecoration: "none"
                                }}
                            >
                                Ya tengo cuenta
                            </Link>
                        </form>
                    </div>
                </div>

                <div
                    style={{
                        flex: "0 0 50%",
                        maxWidth: "50%",
                        background: "#111",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "3rem"
                    }}
                >
                    <div className="d-flex justify-content-center mb-4">
                        <svg width="120" height="120" viewBox="260 160 220 240" xmlns="http://www.w3.org/2000/svg">
                            <path fill="rgba(255,255,255,0.1)" stroke="#fff" strokeWidth="4" d="M307.95,379.91c-7.73,0-13.6-3.74-18.78-7.03-.54-.35-1.09-.69-1.64-1.04-2.23-1.39-5.95-3.73-7.98-8.08-2.32-4.99-.81-9.44.09-12.11l.16-.47c1.92-5.77,4.44-14.21,5.95-22.65-5.62-2.87-10.77-6.49-15.67-11.03-4.95-4.58-14.17-13.12-12.6-23.95.27-1.88,1.02-3.61,2.17-5.06.17-2.98,1.4-5.56,3.61-7.52,2.01-1.79,4.52-2.74,7.24-2.74,1.81,0,3.43.41,4.92.99,4.28-10.83,13.19-22.04,20.7-30.83.27-.32.54-.63.81-.94.83-.95,1.56-1.79,2.07-2.56.02-.69-.25-2.38-1.5-6.44-.24-.76-.46-1.5-.66-2.18-1.48-5.18-2.41-10.79-2.64-15.91-1.17-1.7-1.77-3.69-1.76-5.83.02-2.98,1.07-5.53,3.04-7.43,1.19-5.96,3.39-11.34,6.57-16.03,5.56-8.19,13.36-11.1,18.34-11.1,2.54,0,4.86.73,6.68,2.09.18,0,.36-.01.53-.01,4.03,0,7.44,1.84,9.35,5.04.83,1.38,1.3,2.98,1.39,4.65,2.02,1.2,3.76,2.67,5.27,4.45,6.54.22,9.69,4.63,10.45,8.77.33,1.78.13,3.33-.2,4.54h.01c5.42,0,9.67,1.74,12.61,5.17,2.37,2.77,3.45,6.29,3.04,9.91-.36,3.12-1.83,6.02-4.1,8.2,2.09-.21,4.03-.32,5.81-.32,1.13,0,2.22.04,3.24.13,4.07.34,7.58,2.61,9.53,6.13,2.47,1.92,4.01,4.78,4.37,8.13.16,1.44.06,2.89-.26,4.25,3.62,4.13,4.93,9.96,3.61,16.31-.79,3.83-2.84,7.22-5.8,9.66-.73,2.47-2.7,7.04-9.05,8.94-2.59.78-5.31,1.18-8.29,1.23-3.58,2.45-7.66,4.06-11.96,4.75.42,5.37.08,10.38-1.03,15.56-1.21,5.47-3.46,10.38-6.69,14.62.98,1.59,1.9,3.16,2.79,4.77l3.81,6.86,1.62,2.82c3.64-2.47,6.92-3.68,9.96-3.68,1.76,0,3.42.39,4.92,1.17,1.73.9,3.16,2.26,4.13,3.93,3.39.83,5.29,2.91,6.17,4.19,1.1,1.59,3.32,5.94.24,11.91-3.81,7.36-17.06,17.73-30,17.88h-.24c-9.58,0-12.41-6.64-13.62-9.48-.1-.24-.2-.47-.31-.71-3.44-7.7-7.49-15.2-12.37-22.94l-1.97-2.98c-2.24.3-4.5.46-6.77.46-1.36,0-2.75-.06-4.15-.17l-3.09,11.61c2.22.87,4.6,1.66,6.76,2.37l.87.29c3.82,1.27,13.97,4.64,13.78,13.77-.05,2.48-1.15,10.4-12.81,11.66-1.44,1.7-3.4,2.93-5.5,3.39-1.73.38-3.48.57-5.19.57Z"/>
                            <path fill="#fff" d="M359.01,345.68c2.04-1.72,6.83-5.34,9.18-4.12,1.71.88,1.14,3.5.47,5.28,1.87-.39,5.58-1.62,6.81.17,2.72,3.94-11.5,16.61-23.01,16.75-4.67.06-5.2-2.43-6.48-5.27-3.74-8.36-8.08-16.29-12.96-24.02l-5.11-7.74c-6.9,1.83-13.82,1.77-20.91.22l-5.06,19.01c-.6,2.25-1.02,4.26-1.44,6.55,4.11,2.53,10.02,4.41,14.55,5.91,2.52.84,8.15,2.78,8.09,5.7-.09,4.31-8.34,3.75-10.97,3.55.3.91.51,1.59.48,2.2-.02.47-.73,1.23-1.28,1.35-7.63,1.67-13.16-2.5-19.42-6.42-1.89-1.18-3.9-2.49-4.86-4.55-.99-2.13-.11-4.32.59-6.43,3.07-9.24,6.07-20.31,7.21-30.29-7.24-2.83-13.51-6.9-19.17-12.14-4.25-3.94-10.94-10.32-10.02-16.65.22-1.52,1.6-2.24,3.08-1.87-.6-1.81-1.57-4.3-.01-5.68,3.18-2.82,9,4.8,12.22,2.14l.97-3.55c2.97-10.83,13.21-23.49,20.46-31.97,1.37-1.6,2.77-3.08,3.85-4.87,2.43-4.01-.18-10.48-1.46-14.94-1.51-5.27-2.53-11.76-2.36-17.34-.96-.36-1.73-.91-1.72-2.04.02-2.57,2.22-1.57,2.44-3.25.76-5.62,2.57-10.93,5.74-15.6,5.14-7.57,13.65-8.95,13.66-6.03,0,.77-.31,1.52-.56,2.22,2.08-.91,6.52-2.68,7.79-.56.34.56.3,1.83-.21,2.39l-2.38,2.6c5.65,1.34,9.35,3.07,12.11,8.3,2.85.16,6-1.15,6.55,1.81.19,1.04-.57,1.76-.76,2.56-.61,2.56-1.06,5.01-3.13,7.02,1.25,2.46,5.38,2.4,7.79,2.1,3.41-.43,7.95-.91,10.39,1.94,1.91,2.23,1.27,5.45-1.03,7.14-2.86,2.1-6.06,3.35-9.57,4.03-1.16.23-2.04.71-3.06,1.33-6.46,3.9-12.89,1.27-12.93,5.99-.05,5.17,2.56,12.84,4.32,17.9,1.77,1.86,4.06,3.58,6.28,4.84,4.25,2.42,8.99,1.08,11.98-2.59l.71-.87-.92-4.81c-1.66.03-2.18-1.09-2.26-2.39-.12-1.77.4-3.27,2.25-3.76l.12-1.83c.09-1.47,1.13-2.55,2.58-2.83,4.64-.9,10.48-1.73,15.16-1.34,2.07.17,3.31,1.78,3.51,3.79,1.77.2,2.64,1.47,2.82,3.09.15,1.38-.04,2.61-1.73,2.97l.14,3.57c4.95,1.96,6.07,6.57,5.06,11.43-.58,2.8-2.37,5.02-4.98,6.19-.66,2.69-.61,5.09-4.11,6.14-2.83.85-5.66,1-8.66.83-5.15,4.5-12.11,6.15-18.9,4.64,1.65,7.85,2.23,14.41.53,22.29-1.33,6.04-4.33,11.39-9.07,15.47,2.21,3.22,4.17,6.35,6.03,9.7l3.81,6.86,6.51,11.38,4.27-3.59Z"/>
                        </svg>
                    </div>

                    <h2
                        className="text-white fw-bold text-center mb-2"
                        style={{ fontSize: "2rem" }}
                    >
                        Bienvenido a LineUp
                    </h2>

                    <p
                        className="text-center mb-0"
                        style={{
                            color: "rgba(255,255,255,.55)",
                            fontSize: ".95rem"
                        }}
                    >
                        Registrate para empezar a gestionar filas, servicios y ubicaciones.
                    </p>
                </div>
            </div>
        </div>
    );
};