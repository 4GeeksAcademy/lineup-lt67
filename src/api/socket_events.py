from flask import request
from flask_socketio import emit, join_room, ConnectionRefusedError
from flask_jwt_extended import decode_token
from sqlalchemy import select

from api.models import db, Chat, Mensaje
from api.socket_instance import socketio


def get_identity_and_role_from_auth(auth):
    if not auth or "token" not in auth:
        raise ConnectionRefusedError("missing token")

    token = auth["token"]

    try:
        decoded = decode_token(token)
        identity = decoded["sub"]
        role = decoded.get("role") or decoded.get("claims", {}).get("role")
        return identity, role
    except Exception:
        raise ConnectionRefusedError("invalid token")


@socketio.on("connect")
def handle_connect(auth):
    get_identity_and_role_from_auth(auth)
    emit("connected", {"ok": True})


@socketio.on("join_service_chat")
def handle_join_service_chat(data):
    auth = data.get("auth")
    service_id = data.get("service_id")

    identity, role = get_identity_and_role_from_auth(auth)

    chat = db.session.execute(
        select(Chat).where(Chat.servicio_id == service_id)
    ).scalar_one_or_none()

    if not chat:
        emit("chat_error", {"msg": "Chat no encontrado"})
        return

    user_id = int(identity)

    allowed = (
        (role == "cliente" and chat.client_id == user_id) or
        (role == "liner" and chat.liner_id == user_id)
    )

    if not allowed:
        emit("chat_error", {"msg": "No autorizado para este chat"})
        return

    room = f"service_{service_id}"
    join_room(room)
    emit("joined_room", {"room": room})


@socketio.on("send_message")
def handle_send_message(data):
    auth = data.get("auth")
    service_id = data.get("service_id")
    contenido = (data.get("contenido") or "").strip()

    if not contenido:
        emit("chat_error", {"msg": "Mensaje vacío"})
        return

    identity, role = get_identity_and_role_from_auth(auth)

    chat = db.session.execute(
        select(Chat).where(Chat.servicio_id == service_id)
    ).scalar_one_or_none()

    if not chat:
        emit("chat_error", {"msg": "Chat no encontrado"})
        return

    user_id = int(identity)

    allowed = (
        (role == "cliente" and chat.client_id == user_id) or
        (role == "liner" and chat.liner_id == user_id)
    )

    if not allowed:
        emit("chat_error", {"msg": "No autorizado para enviar mensajes"})
        return

    sender_type = "client" if role == "cliente" else "liner"

    mensaje = Mensaje(
        chat_id=chat.id,
        sender_type=sender_type,
        sender_id=user_id,
        contenido=contenido
    )

    db.session.add(mensaje)
    db.session.commit()

    room = f"service_{service_id}"
    emit("new_message", mensaje.serialize(), to=room)