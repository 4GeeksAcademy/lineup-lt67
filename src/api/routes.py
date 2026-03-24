"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Client, Administrador, Tipo, Ticket
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select, and_, func
from .models import Administrador

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/administrador', methods=['GET'])
def get_administradores():
    admins = Administrador.query.all()
    result = list(map(lambda admin: admin.serialize(), admins))

    return jsonify(result), 200

@api.route('/administrador', methods=['POST'])
def create_administrador():
    body = request.get_json()

    name = body.get("name")
    email = body.get("email")
    password = body.get("password")

    if not name or not email or not password:
        return jsonify({"msg": "Faltan campos"}), 400

    admin_existente = Administrador.query.filter_by(email=email).first()
    if admin_existente:
        return jsonify({"msg": "El administrador ya existe"}), 400

    new_admin = Administrador(
        name=name,
        email=email,
        password=password,
        is_active=True
    )

    db.session.add(new_admin)
    db.session.commit()

    return jsonify(new_admin.serialize()), 201

@api.route('/administrador/<int:id>', methods=['GET'])
def get_administrador(id):
    admin = Administrador.query.get(id)
    if not admin:
        return jsonify({"message": "Admin no encontrado"}), 404
    return jsonify(admin.serialize()), 200


@api.route('/administrador/<int:id>', methods=['PUT'])
def editar_administrador(id):
    admin = Administrador.query.get(id)
    if not admin:
        return jsonify({"message": "Admin no encontrado"}), 404
    
    body = request.get_json()
    admin.name = body.get("name", admin.name)
    admin.email = body.get("email", admin.email)
    
    db.session.commit()
    return jsonify(admin.serialize()), 200


@api.route('/administrador/<int:id>', methods=['DELETE'])
def borrar_administrador(id):
    admin = Administrador.query.get(id)
    if not admin:
        return jsonify({"message": "Admin no encontrado"}), 404
    
    db.session.delete(admin)
    db.session.commit()
    return jsonify({"message": "Admin borrado"}), 200



@api.route('/clients', methods=['GET'])
def get_clients():

    all_clients = list(db.session.execute(select(Client)).scalars().all())
    all_clients = list(map(lambda client: client.serialize(), all_clients))
    print(all_clients)

    return jsonify(all_clients), 200


@api.route('/clients/<int:client_id>', methods=['GET'])
def get_client(client_id):

    client = db.session.execute(select(Client).where(Client.id == client_id)).scalar_one_or_none()
    if not client:
        return jsonify({"msg": "Cliente no encontrado"}), 404

    return jsonify(client.serialize()), 200


@api.route('/clients', methods=['POST'])
def create_client():

    all_clients = list(db.session.execute(select(Client)).scalars().all())
    all_clients = list(map(lambda client: client.serialize(), all_clients))
    

    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Request body can't be empty"}), 400
    if not body.get("email"):
        return jsonify({"msg": "An Email is required"}), 400
    if not body.get("password"):
        return jsonify({"msg": "A password is required"}), 400

    client = db.session.execute(select(Client).where(Client.email == body['email'])).scalar_one_or_none()
    if client:
        return jsonify({"msg": "There is already an account with this Email"}), 400

    new_client = Client(
        full_name=body["full_name"],
        email=body["email"],
        password=body["password"],
        is_active=True
    )
    db.session.add(new_client)
    db.session.commit()
    return jsonify({
        'msg': 'Cliente añadido con exito',
        'cliente': new_client.serialize() 
    }), 201

@api.route('/clients/<int:client_id>', methods=['PUT'])
def update_client(client_id):

    client = db.session.get(Client, client_id)
    if not client:
        return jsonify({"msg": "Cliente no encontrado"}), 404

    body = request.get_json()

    if 'full_name' in body:
        client.full_name = body['full_name']

    if 'email' in body:
        client.email = body['email']

    db.session.commit()

    return jsonify({
        'msg': 'Cliente modificado con exito',
        'body': client.serialize()
    }), 200

@api.route('/clients/<int:client_id>', methods=['DELETE'])
def eliminar_cliente(client_id):
    client = db.session.get(Client, client_id)

    if not client:
        return jsonify({"msg": "Cliente no encontrado"}), 404

    db.session.delete(client)
    db.session.commit()

    return jsonify({
    "msg": "Cliente eliminado",
    "id": client_id
    }), 200

@api.route('/tipos', methods=['GET'])
def get_tipos():

    all_tipos = list(db.session.execute(select(Tipo)).scalars().all())
    all_tipos = list(map(lambda tipo: tipo.serialize(), all_tipos))

    return jsonify(all_tipos), 200


@api.route('/tipos/<int:tipo_id>', methods=['GET'])
def get_tipo(tipo_id):

    tipo = db.session.execute(select(Tipo).where(Tipo.id == tipo_id)).scalar_one_or_none()
    if not tipo:
        return jsonify({"msg": "Tipo no encontrado"}), 404

    return jsonify(tipo.serialize()), 200


@api.route('/tipos', methods=['POST'])
def create_tipo():

    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Request body can't be empty"}), 400
    if not body.get("nombre"):
        return jsonify({"msg": "El nombre es requerido"}), 400

    new_tipo = Tipo(
        nombre=body["nombre"].strip(),
        descripcion=(body.get("descripcion") or "").strip() or None
    )
    db.session.add(new_tipo)
    db.session.commit()
    return jsonify({
        'msg': 'Tipo añadido con exito',
        'tipo': new_tipo.serialize()
    }), 201


@api.route('/tipos/<int:tipo_id>', methods=['PUT'])
def update_tipo(tipo_id):

    tipo = db.session.get(Tipo, tipo_id)
    if not tipo:
        return jsonify({"msg": "Tipo no encontrado"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Request body can't be empty"}), 400

    if 'nombre' in body:
        nombre = (body.get('nombre') or '').strip()
        if not nombre:
            return jsonify({"msg": "El nombre no puede estar vacio"}), 400
        tipo.nombre = nombre

    if 'descripcion' in body:
        tipo.descripcion = (body.get('descripcion') or '').strip() or None

    db.session.commit()

    return jsonify({
        'msg': 'Tipo modificado con exito',
        'body': tipo.serialize()
    }), 200


@api.route('/tipos/<int:tipo_id>', methods=['DELETE'])
def delete_tipo(tipo_id):
    tipo = db.session.get(Tipo, tipo_id)

    if not tipo:
        return jsonify({"msg": "Tipo no encontrado"}), 404

    db.session.delete(tipo)
    db.session.commit()

    return jsonify({
    "msg": "Tipo eliminado",
    "id": tipo_id
    }), 200

#######################################################################################

@api.route('/tickets', methods=['GET'])
def get_tickets():

    all_tickets = list(db.session.execute(select(Ticket)).scalars().all())
    all_tickets = list(map(lambda ticket: ticket.serialize(), all_tickets))
    print(all_tickets)

    return jsonify(all_tickets), 200


@api.route('/tickets/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):

    ticket = db.session.execute(select(Ticket).where(Ticket.id == ticket_id)).scalar_one_or_none()
    if not ticket:
        return jsonify({"msg": "ticket no encontrado"}), 404

    return jsonify(ticket.serialize()), 200


@api.route('/tickets', methods=['POST'])
def create_ticket():
 
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Request body can't be empty"}), 400
    if not body.get("client_id"):
        return jsonify({"msg": "Es necesario especificar client_id"}), 400
    if not body.get("id_sucursal"):
        return jsonify({"msg": "Es necesario especificar id_sucursal"}), 400

    ticket_existente = db.session.execute(
        select(Ticket).where(
            and_(
                Ticket.client_id == body['client_id'],
                Ticket.id_sucursal == body['id_sucursal'],
                Ticket.estado == 'esperando'
            )
        )
    ).scalar_one_or_none()
    
    if ticket_existente:
        return jsonify({"msg": "Ya existe un ticket activo de este cliente para esta sucursal"}), 400
    
    posicion_actual = db.session.execute(
        select(func.max(Ticket.posicion))
        .where(
            and_(
                Ticket.id_sucursal == body['id_sucursal'],
                Ticket.estado == 'esperando'
            )
        )
    ).scalar()

    nueva_posicion = 1 if posicion_actual is None else posicion_actual + 1

    new_ticket = Ticket(
        client_id=body["client_id"],
        id_sucursal=body["id_sucursal"],
        estado='esperando',
        posicion=nueva_posicion
    )
    db.session.add(new_ticket)
    db.session.commit()
    return jsonify({
        'msg': 'Ticket creado con exito',
        'cliente': new_ticket.serialize() 
    }), 201

@api.route('/tickets/<int:ticket_id>', methods=['PUT'])
def update_ticket(ticket_id):

    ticket = db.session.get(Ticket, ticket_id)
    if not ticket:
        return jsonify({"msg": "Ticket no encontrado"}), 404

    body = request.get_json()

    if not body or 'estado' not in body:
        return jsonify({'msg': 'Debe especificar el nuevo estado'}), 400

    nuevo_estado = body['estado']

    estados_validos = ["esperando", "en_atencion", "atendido", "cancelado"]

    if nuevo_estado not in estados_validos:
        return jsonify({"msg": "Estado inválido"}), 400
    
    if ticket.estado in ["atendido", "cancelado"]:
        return jsonify({"msg": "No se puede modificar un ticket cerrado"}), 400
    
    if nuevo_estado == "cancelado":
        ticket.estado = "cancelado"
    elif nuevo_estado == "en_atencion":
        primer_ticket = db.session.execute(
            select(Ticket)
            .where(
                Ticket.id_sucursal == ticket.id_sucursal,
                Ticket.estado == "esperando"
            )
            .order_by(Ticket.posicion)
        ).scalars().first()

        if not primer_ticket or primer_ticket.id != ticket.id:
            return jsonify({
                "msg": "Solo el primer ticket puede pasar a en_atencion"
            }), 400

        ticket.estado = "en_atencion"
    elif nuevo_estado == "atendido":

        if ticket.estado != "en_atencion":
            return jsonify({
                "msg": "Solo un ticket en atención puede finalizarse"
            }), 400

        ticket.estado = "atendido"

    db.session.commit()

    return jsonify({
        'msg': 'Estado actualizado',
        'body': ticket.serialize()
    }), 200

@api.route('/tickets/<int:ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    ticket = db.session.get(Ticket, ticket_id)

    if not ticket:
        return jsonify({"msg": "Ticket no encontrado"}), 404

    db.session.delete(ticket)
    db.session.commit()

    return jsonify({
    "msg": "Ticket eliminado",
    "id": ticket_id
    }), 200