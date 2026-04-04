import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const ClientRegister = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
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
                profile_image_url: profileImageUrl || null
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
        <div className="container d-flex justify-content-center align-items-center vh-50 mt-4">
            <div className="card p-4 shadow border-primary" style={{ width: "22rem" }}>
                <h3 className="text-center mb-4 text-primary">Registro Cliente</h3>

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
                        <input
                            type="email"
                            className="form-control"
                            placeholder="cliente@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Elegí una contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                            className="btn btn-outline-primary w-100"
                            onClick={handleImageUpload}
                            disabled={!selectedFile || uploadingImage}
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
                                style={{ maxHeight: "150px", objectFit: "cover" }}
                            />
                        </div>
                    )}

                    {error && <p className="text-danger small">{error}</p>}
                    {success && <p className="text-success small">{success}</p>}

                    <button type="submit" className="btn btn-primary w-100 mb-2">
                        Registrarme
                    </button>

                    <Link to="/client/login" className="btn btn-outline-secondary w-100">
                        Ya tengo cuenta
                    </Link>
                </form>
            </div>
        </div>
    );
};