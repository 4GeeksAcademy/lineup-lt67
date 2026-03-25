from datetime import datetime, timezone
from typing import List, Optional

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Integer
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