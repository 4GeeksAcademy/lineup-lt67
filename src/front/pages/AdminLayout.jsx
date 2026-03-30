import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export const AdminLayout = () => {
    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>

            {/* SIDEBAR */}
            <div style={{
                width: "210px",
                flexShrink: 0,
                background: "#0f0f0f",
                display: "flex",
                flexDirection: "column",
            }}>
                {/* Brand */}
                <div style={{ padding: "20px 16px 14px", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: "#fff" }}>Admin panel</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Gestión interna</div>
                </div>

                {/* Nav */}
                <nav style={{ padding: "12px 8px", flex: 1 }}>
                    <div style={navLabel}>Módulos</div>

                    <NavLink to="/admin/clientes" style={({ isActive }) => navItem(isActive, "#1D9E75", "#E1F5EE")}>
                        <span style={{ ...dot, background: "#1D9E75" }} />
                        Clientes
                    </NavLink>

                    <NavLink to="/admin/liners" style={({ isActive }) => navItem(isActive, "#7F77DD", "#EEEDFE")}>
                        <span style={{ ...dot, background: "#7F77DD" }} />
                        Liners
                    </NavLink>

                    <div style={navLabel}>Organización</div>

                    <NavLink to="/admin/establecimientos" style={({ isActive }) => navItem(isActive, "#BA7517", "#FAEEDA")}>
                        <span style={{ ...dot, background: "#EF9F27" }} />
                        Establecimientos
                    </NavLink>

                    <NavLink to="/admin/administradores" style={({ isActive }) => navItem(isActive, "#D85A30", "#FAECE7")}>
                        <span style={{ ...dot, background: "#F0997B" }} />
                        Administradores
                    </NavLink>
                </nav>

                {/* Footer */}
                <div style={{ padding: "12px 16px", borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>Admin</div>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div style={{ flex: 1, overflow: "auto", background: "#f9f9f9" }}>
                <Outlet />
            </div>
        </div>
    );
};

const navLabel = {
    fontSize: "10px",
    color: "rgba(255,255,255,0.3)",
    padding: "0 8px",
    margin: "14px 0 4px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
};

const dot = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
    display: "inline-block",
};

const navItem = (isActive, color, lightBg) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    marginBottom: "2px",
    textDecoration: "none",
    fontWeight: isActive ? 500 : 400,
    background: isActive ? lightBg + "22" : "transparent",
    color: isActive ? color : "rgba(255,255,255,0.5)",
});