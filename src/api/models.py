from datetime import datetime, timezone
from typing import List, Optional

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Integer, UniqueConstraint, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
class Administrador(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
class Tipo(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(250), nullable=True)

    establecimientos: Mapped[List["Establecimiento"]] = relationship(
        back_populates="tipo", lazy=True
    )

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion
        }
    
class Client(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    tickets: Mapped[List["Ticket"]] = relationship(back_populates="client")
    favoritos: Mapped[List["Favorito"]] = relationship(back_populates="client")
    servicios: Mapped[List["Servicio"]] = relationship(back_populates="client")
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc)
    )
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }

class Establecimiento(db.Model):
    __tablename__ = "establecimiento"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    tipo_id: Mapped[int] = mapped_column(ForeignKey("tipo.id"), nullable=False)
    total_sucursales: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    clave: Mapped[str] = mapped_column(String(120), nullable=False)
    logo: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    tipo: Mapped["Tipo"] = relationship(back_populates="establecimientos")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "tipo_id": self.tipo_id,
            "tipo_nombre": self.tipo.nombre if self.tipo else None,
            "total_sucursales": self.total_sucursales,
            "clave": self.clave,
            "logo": self.logo,
        }

class Sucursal(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    id_establecimiento: Mapped[int] = mapped_column(ForeignKey('establecimiento.id'), nullable=False)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    fila_activa: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=False)
    tiempo_por_cliente: Mapped[int] = mapped_column(nullable=False)
    capacidad: Mapped[int] = mapped_column(nullable=False)

    establecimiento = relationship('Establecimiento', backref='sucursales')
    tickets: Mapped[List["Ticket"]] = relationship(back_populates="sucursal")
    favoritos: Mapped[List["Favorito"]] = relationship(back_populates="sucursal")
    def serialize(self):
        return {
            "id": self.id,
            "id_establecimiento": self.id_establecimiento,
            "nombre": self.nombre,
            "fila_activa": self.fila_activa,
            "tiempo_por_cliente": self.tiempo_por_cliente,
            "capacidad": self.capacidad
        }


class Ticket(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("client.id"))
    id_sucursal: Mapped[int] = mapped_column(ForeignKey("sucursal.id"))
    estado: Mapped[str] = mapped_column(String(120), nullable=False)
    posicion: Mapped[int] = mapped_column(Integer, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc)
    )
    client: Mapped["Client"] = relationship(back_populates="tickets")
    sucursal: Mapped["Sucursal"] = relationship(back_populates="tickets")

    def serialize(self):
        return {
            "id": self.id,
            "id_cliente": self.client_id,
            "id_sucursal": self.id_sucursal,
            "estado": self.estado,
            "posicion": self.posicion,
            "created_at": self.created_at.isoformat()
        }

class Favorito(db.Model):
    __tablename__ = "favorito"
    __table_args__ = (
        UniqueConstraint("client_id", "id_sucursal", name="uq_favorito_client_sucursal"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("client.id"), nullable=False)
    id_sucursal: Mapped[int] = mapped_column(ForeignKey("sucursal.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        nullable=False,
    )

    client: Mapped["Client"] = relationship(back_populates="favoritos")
    sucursal: Mapped["Sucursal"] = relationship(back_populates="favoritos")

    def serialize(self):
        est = self.sucursal.establecimiento if self.sucursal else None
        return {
            "id": self.id,
            "client_id": self.client_id,
            "id_sucursal": self.id_sucursal,
            "sucursal_nombre": self.sucursal.nombre if self.sucursal else None,
            "id_establecimiento": est.id if est else None,
            "establecimiento_nombre": est.nombre if est else None,
            "created_at": self.created_at.isoformat(),
        }

class Servicio(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("client.id"))
    descripcion: Mapped[str] = mapped_column(String(255), nullable=False)
    lugar: Mapped[str] = mapped_column(String(255), nullable=False)
    urgencia: Mapped[str] = mapped_column(String(50), nullable=False)
    precio_propuesto: Mapped[float] = mapped_column(Float, nullable=True)
    estado: Mapped[str] = mapped_column(String(50), nullable=False, default='abierto')
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc)
    )
    client: Mapped["Client"] = relationship(back_populates="servicios")

    propuestas: Mapped[list["Propuesta"]] = relationship(
        back_populates="servicio",
        cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "id_cliente": self.client_id,
            "descripcion": self.descripcion,
            "lugar": self.lugar,
            "urgencia": self.urgencia,
            "estado": self.estado,
            "created_at": self.created_at.isoformat()
        }

class Propuesta(db.Model):
    __tablename__ = "propuestas"

    id: Mapped[int] = mapped_column(primary_key=True)

    servicio_id: Mapped[int] = mapped_column(
        ForeignKey("servicio.id"),
        nullable=False
    )

    liner_id: Mapped[int] = mapped_column(
        ForeignKey("liner.id"),
        nullable=False
    )

    precio: Mapped[float] = mapped_column(Float, nullable=False)

    mensaje: Mapped[str] = mapped_column(String(255), nullable=True)

    estado: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="pendiente"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc)
    )

    #Relaciones
    servicio: Mapped["Servicio"] = relationship(back_populates="propuestas")
    liner: Mapped["Liner"] = relationship(back_populates="propuestas")

    __table_args__ = (
    UniqueConstraint('servicio_id', 'liner_id'),
    )

    def serialize(self):
        return {
            "id": self.id,
            "servicio_id": self.servicio_id,
            "liner_id": self.liner_id,
            "precio": self.precio,
            "mensaje": self.mensaje,
            "estado": self.estado,
            "created_at": self.created_at.isoformat()
        }


class Liner(db.Model):
    __tablename__ = "liner"

    id: Mapped[int] = mapped_column(primary_key=True)
    liner_nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    liner_email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    liner_password: Mapped[str] = mapped_column(nullable=False)
    liner_foto: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    propuestas: Mapped[list["Propuesta"]] = relationship(
        back_populates="liner",
        cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.liner_nombre,
            "email": self.liner_email
        }

    