"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User, Client, Administrador, Tipo, Establecimiento, Sucursal, Ticket, Favorito, Servicio, Liner, Propuesta
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select, and_, func
from sqlalchemy.orm import joinedload
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

@api.route('/administrador/login', methods=['POST'])
def login_administrador():
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Request body can't be empty"}), 400

    email = (body.get("email") or "").strip()
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y password son requeridos"}), 400

    admin = db.session.execute(
        select(Administrador).where(Administrador.email == email)
    ).scalar_one_or_none()

    if not admin or admin.password != password:
        return jsonify({"msg": "Credenciales invalidas"}), 401
    
    access_token = create_access_token(identity=admin.id)

    return jsonify({
        "msg": "Login exitoso",
        "access_token": access_token,
        "admin": admin.serialize()
    }), 200

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

@api.route('/clients/login', methods=['POST'])
def login_client():
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Request body can't be empty"}), 400

    email = (body.get("email") or "").strip()
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y password son requeridos"}), 400

    client = db.session.execute(
        select(Client).where(Client.email == email)
    ).scalar_one_or_none()

    if not client or client.password != password:
        return jsonify({"msg": "Credenciales invalidas"}), 401

    return jsonify({
        "msg": "Login exitoso",
        "client": client.serialize()
    }), 200


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

@api.route("/establecimientos", methods=["GET"])
def get_establecimientos():
    stmt = select(Establecimiento).options(joinedload(Establecimiento.tipo))
    rows = list(db.session.execute(stmt).unique().scalars().all())
    return jsonify([e.serialize() for e in rows]), 200


@api.route("/establecimientos/<int:establecimiento_id>", methods=["GET"])
def get_establecimiento(establecimiento_id):
    stmt = (
        select(Establecimiento)
        .where(Establecimiento.id == establecimiento_id)
        .options(joinedload(Establecimiento.tipo))
    )
    est = db.session.execute(stmt).unique().scalar_one_or_none()
    if not est:
        return jsonify({"msg": "Establecimiento no encontrado"}), 404
    return jsonify(est.serialize()), 200


@api.route("/establecimientos", methods=["POST"])
def create_establecimiento():
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Request body can't be empty"}), 400
    if not body.get("nombre"):
        return jsonify({"msg": "El nombre es requerido"}), 400
    if body.get("tipo_id") is None:
        return jsonify({"msg": "El tipo es requerido"}), 400
    if not body.get("clave"):
        return jsonify({"msg": "La clave es requerida"}), 400

    tipo = db.session.get(Tipo, int(body["tipo_id"]))
    if not tipo:
        return jsonify({"msg": "Tipo no encontrado"}), 404

    total = body.get("total_sucursales")
    if total is None:
        total = 0
    try:
        total = int(total)
    except (TypeError, ValueError):
        return jsonify({"msg": "total_sucursales debe ser un numero entero"}), 400

    nuevo = Establecimiento(
        nombre=body["nombre"].strip(),
        tipo_id=tipo.id,
        total_sucursales=total,
        clave=body["clave"].strip(),
        logo=(body.get("logo") or "").strip() or None,
    )
    db.session.add(nuevo)
    db.session.commit()
    db.session.refresh(nuevo)
    nuevo = db.session.execute(
        select(Establecimiento)
        .where(Establecimiento.id == nuevo.id)
        .options(joinedload(Establecimiento.tipo))
    ).unique().scalar_one()
    return jsonify({"msg": "Establecimiento añadido con exito", "establecimiento": nuevo.serialize()}), 201


@api.route("/establecimientos/<int:establecimiento_id>", methods=["PUT"])
def update_establecimiento(establecimiento_id):
    est = db.session.get(Establecimiento, establecimiento_id)
    if not est:
        return jsonify({"msg": "Establecimiento no encontrado"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Request body can't be empty"}), 400

    if "nombre" in body:
        nombre = (body.get("nombre") or "").strip()
        if not nombre:
            return jsonify({"msg": "El nombre no puede estar vacio"}), 400
        est.nombre = nombre

    if "tipo_id" in body:
        tid = body.get("tipo_id")
        if tid is None:
            return jsonify({"msg": "tipo_id no puede ser nulo"}), 400
        tipo = db.session.get(Tipo, int(tid))
        if not tipo:
            return jsonify({"msg": "Tipo no encontrado"}), 404
        est.tipo_id = tipo.id

    if "total_sucursales" in body:
        try:
            est.total_sucursales = int(body["total_sucursales"])
        except (TypeError, ValueError):
            return jsonify({"msg": "total_sucursales debe ser un numero entero"}), 400

    if "clave" in body:
        clave = (body.get("clave") or "").strip()
        if not clave:
            return jsonify({"msg": "La clave no puede estar vacia"}), 400
        est.clave = clave

    if "logo" in body:
        est.logo = (body.get("logo") or "").strip() or None

    db.session.commit()
    est = db.session.execute(
        select(Establecimiento)
        .where(Establecimiento.id == establecimiento_id)
        .options(joinedload(Establecimiento.tipo))
    ).unique().scalar_one()
    return jsonify({"msg": "Establecimiento modificado con exito", "body": est.serialize()}), 200


@api.route("/establecimientos/<int:establecimiento_id>", methods=["DELETE"])
def delete_establecimiento(establecimiento_id):
    est = db.session.get(Establecimiento, establecimiento_id)
    if not est:
        return jsonify({"msg": "Establecimiento no encontrado"}), 404
    db.session.delete(est)
    db.session.commit()
    return jsonify({"msg": "Establecimiento eliminado", "id": establecimiento_id}), 200

@api.route('/sucursal', methods=['GET'])
def get_sucursales():
    sucursales = Sucursal.query.all()
    result = list(map(lambda s: s.serialize(), sucursales))
    return jsonify(result), 200

@api.route('/sucursal/<int:id>', methods=['GET'])
def get_sucursal(id):
    sucursal = Sucursal.query.get(id)
    if not sucursal:
        return jsonify({"message": "Sucursal no encontrada"}), 404
    return jsonify(sucursal.serialize()), 200

@api.route('/establecimientos/<int:id>/sucursales', methods=['GET'])
def get_sucursales_por_establecimiento(id):
    sucursales = Sucursal.query.filter_by(id_establecimiento=id).all()
    result = list(map(lambda s: s.serialize(), sucursales))
    return jsonify(result), 200

@api.route('/sucursal', methods=['POST'])
def crear_sucursal():
    body = request.get_json()
    if not body.get("nombre") or not body.get("id_establecimiento"):
        return jsonify({"message": "Faltan datos"}), 400

    nueva_sucursal = Sucursal(
        id_establecimiento=body["id_establecimiento"],
        nombre=body["nombre"],
        fila_activa=body.get("fila_activa", False),
        tiempo_por_cliente=body["tiempo_por_cliente"],
        capacidad=body["capacidad"]
    )
    db.session.add(nueva_sucursal)
    db.session.commit()
    return jsonify(nueva_sucursal.serialize()), 201

@api.route('/sucursal/<int:id>', methods=['PUT'])
def editar_sucursal(id):
    sucursal = Sucursal.query.get(id)
    if not sucursal:
        return jsonify({"message": "Sucursal no encontrada"}), 404

    body = request.get_json()
    sucursal.nombre = body.get("nombre", sucursal.nombre)
    sucursal.fila_activa = body.get("fila_activa", sucursal.fila_activa)
    sucursal.tiempo_por_cliente = body.get("tiempo_por_cliente", sucursal.tiempo_por_cliente)
    sucursal.capacidad = body.get("capacidad", sucursal.capacidad)

    db.session.commit()
    return jsonify(sucursal.serialize()), 200

@api.route('/sucursal/<int:id>', methods=['DELETE'])
def borrar_sucursal(id):
    sucursal = Sucursal.query.get(id)
    if not sucursal:
        return jsonify({"message": "Sucursal no encontrada"}), 404

    db.session.delete(sucursal)
    db.session.commit()
    return jsonify({"message": "Sucursal borrada"}), 200

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

@api.route('/clients/<int:client_id>/favoritos', methods=['GET'])
def get_favoritos(client_id):
    client = db.session.get(Client, client_id)
    if not client:
        return jsonify({"msg": "Cliente no encontrado"}), 404

    stmt = (
        select(Favorito)
        .where(Favorito.client_id == client_id)
        .options(
            joinedload(Favorito.sucursal).joinedload(Sucursal.establecimiento)
        )
    )
    favoritos = list(db.session.execute(stmt).scalars().all())
    return jsonify([f.serialize() for f in favoritos]), 200


@api.route('/clients/<int:client_id>/favoritos', methods=['POST'])
def create_favorito(client_id):
    client = db.session.get(Client, client_id)
    if not client:
        return jsonify({"msg": "Cliente no encontrado"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Request body can't be empty"}), 400
    if not body.get("id_sucursal"):
        return jsonify({"msg": "Es necesario especificar id_sucursal"}), 400

    sucursal = db.session.get(Sucursal, body["id_sucursal"])
    if not sucursal:
        return jsonify({"msg": "Sucursal no encontrada"}), 404

    existente = db.session.execute(
        select(Favorito).where(
            Favorito.client_id == client_id,
            Favorito.id_sucursal == sucursal.id,
        )
    ).scalar_one_or_none()
    if existente:
        return jsonify({"msg": "Ya existe este favorito para el cliente"}), 400

    fav = Favorito(client_id=client_id, id_sucursal=sucursal.id)
    db.session.add(fav)
    db.session.commit()

    fav = db.session.execute(
        select(Favorito)
        .where(Favorito.id == fav.id)
        .options(joinedload(Favorito.sucursal).joinedload(Sucursal.establecimiento))
    ).scalar_one()

    return jsonify({
        "msg": "Favorito creado con exito",
        "favorito": fav.serialize()
    }), 201


@api.route('/clients/<int:client_id>/favoritos/<int:favorito_id>', methods=['DELETE'])
def delete_favorito(client_id, favorito_id):
    fav = db.session.execute(
        select(Favorito).where(
            Favorito.id == favorito_id,
            Favorito.client_id == client_id,
        )
    ).scalar_one_or_none()

    if not fav:
        return jsonify({"msg": "Favorito no encontrado"}), 404

    db.session.delete(fav)
    db.session.commit()

    return jsonify({
        "msg": "Favorito eliminado",
        "id": favorito_id
    }), 200

@api.route('/servicios', methods=['GET'])
def get_servicios():

    servicios = db.session.execute(
        select(Servicio)
    ).scalars().all()

    return jsonify([s.serialize() for s in servicios]), 200

@api.route('/servicios/<int:servicio_id>', methods=['GET'])
def get_servicio(servicio_id):

    servicio = db.session.get(Servicio, servicio_id)

    if not servicio:
        return jsonify({"msg": "Servicio no encontrado"}), 404

    return jsonify(servicio.serialize()), 200

@api.route('/servicios', methods=['POST'])
def create_servicio():

    body = request.get_json()

    if not body:
        return jsonify({"msg": "Body requerido"}), 400

    required_fields = ["client_id", "descripcion", "lugar", "urgencia"]

    for field in required_fields:
        if field not in body:
            return jsonify({"msg": f"Falta {field}"}), 400

    servicio = Servicio(
        client_id=body["client_id"],
        descripcion=body["descripcion"],
        lugar=body["lugar"],
        urgencia=body["urgencia"],
        estado="abierto"
    )

    db.session.add(servicio)
    db.session.commit()

    return jsonify(servicio.serialize()), 201

@api.route('/servicios/<int:servicio_id>', methods=['PUT'])
def update_servicio(servicio_id):

    servicio = db.session.get(Servicio, servicio_id)

    if not servicio:
        return jsonify({"msg": "Servicio no encontrado"}), 404

    body = request.get_json()

    if not body:
        return jsonify({"msg": "Body requerido"}), 400

    # actualización parcial
    if "descripcion" in body:
        servicio.descripcion = body["descripcion"]

    if "lugar" in body:
        servicio.lugar = body["lugar"]

    if "urgencia" in body:
        servicio.urgencia = body["urgencia"]

    if "estado" in body:
        servicio.estado = body["estado"]

    db.session.commit()

    return jsonify(servicio.serialize()), 200

@api.route('/servicios/<int:servicio_id>', methods=['DELETE'])
def delete_servicio(servicio_id):

    servicio = db.session.get(Servicio, servicio_id)

    if not servicio:
        return jsonify({"msg": "Servicio no encontrado"}), 404

    db.session.delete(servicio)
    db.session.commit()

    return jsonify({"msg": "Servicio eliminado"}), 200


@api.route('/liners', methods=['GET'])
def get_liners():

    liners = Liner.query.all()
    result = list(map(lambda liner: liner.serialize(), liners))

    return jsonify(result), 200


@api.route('/liners/<int:liner_id>', methods=['GET'])
def get_liner(liner_id):

    liner = db.session.execute(select(Liner).where(Liner.id == liner_id)).scalar_one_or_none()
    if not liner:
        return jsonify({"msg": "Liner no encontrado"}), 404

    return jsonify(liner.serialize()), 200

@api.route('/liners', methods=['POST'])
def create_liner():
    body = request.get_json()
    print("BODY RECIBIDO", body)

    name = body.get("liner_nombre")
    email = body.get("liner_email")
    password = body.get("liner_password")

    if not name or not email or not password:
        return jsonify({"msg": "Faltan campos"}), 400

    liner_existente = Liner.query.filter_by(liner_email=email).first()
    if liner_existente:
        return jsonify({"msg": "El liner ya existe"}), 400

    new_liner = Liner(
        liner_nombre=name,
        liner_email=email,
        liner_password=password
    )

    db.session.add(new_liner)
    db.session.commit()

    return jsonify(new_liner.serialize()), 201

@api.route('/liners/<int:liner_id>', methods=['PUT'])
def update_liner(liner_id):
    liner = db.session.get(Liner, liner_id)
    if not liner:
        return jsonify({"msg": "Liner no encontrado"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Request body can't be empty"}), 400

    liner.liner_nombre = body.get("liner_nombre", liner.liner_nombre)
    liner.liner_email = body.get("liner_email", liner.liner_email)
    liner.liner_foto = body.get("liner_foto", liner.liner_foto)

    db.session.commit()
    return jsonify(liner.serialize()), 200


@api.route('/liners/<int:liner_id>', methods=['DELETE'])
def delete_liner(liner_id):
    liner = db.session.get(Liner, liner_id)
    if not liner:
        return jsonify({"msg": "Liner no encontrado"}), 404

    db.session.delete(liner)
    db.session.commit()
    return jsonify({"msg": "Liner eliminado", "id": liner_id}), 200

@api.route('/propuestas', methods=['GET'])
def get_propuestas():

    query = select(Propuesta)

    servicio_id = request.args.get("servicio_id")
    liner_id = request.args.get("liner_id")
    estado = request.args.get("estado")

    if servicio_id:
        query = query.where(Propuesta.servicio_id == int(servicio_id))

    if liner_id:
        query = query.where(Propuesta.liner_id == int(liner_id))

    if estado:
        query = query.where(Propuesta.estado == estado)

    propuestas = db.session.execute(query).scalars().all()

    return jsonify([p.serialize() for p in propuestas]), 200

@api.route('/propuestas/<int:propuesta_id>', methods=['GET'])
def get_propuesta(propuesta_id):

    propuesta = db.session.get(Propuesta, propuesta_id)

    if not propuesta:
        return jsonify({"msg": "Propuesta no encontrada"}), 404

    return jsonify(propuesta.serialize()), 200

@api.route('/propuestas', methods=['POST'])
def create_propuesta():

    body = request.get_json()

    if not body:
        return jsonify({"msg": "Body requerido"}), 400

    required_fields = ["servicio_id", "liner_id", "precio"]

    for field in required_fields:
        if field not in body:
            return jsonify({"msg": f"Falta {field}"}), 400

    existing = db.session.execute(
        select(Propuesta).where(
            Propuesta.servicio_id == body["servicio_id"],
            Propuesta.liner_id == body["liner_id"]
        )
    ).scalar_one_or_none()

    if existing:
        return jsonify({"msg": "Este liner ya se postuló a este servicio"}), 400

    propuesta = Propuesta(
        servicio_id=body["servicio_id"],
        liner_id=body["liner_id"],
        precio=body["precio"],
        mensaje=body.get("mensaje"),
        estado="pendiente"
    )

    db.session.add(propuesta)
    db.session.commit()

    return jsonify(propuesta.serialize()), 201

@api.route('/propuestas/<int:propuesta_id>', methods=['PUT'])
def update_propuesta(propuesta_id):

    propuesta = db.session.get(Propuesta, propuesta_id)

    if not propuesta:
        return jsonify({"msg": "Propuesta no encontrada"}), 404

    body = request.get_json()

    if not body:
        return jsonify({"msg": "Body requerido"}), 400

    if "precio" in body:
        propuesta.precio = body["precio"]

    if "mensaje" in body:
        propuesta.mensaje = body["mensaje"]

    if "estado" in body:
        propuesta.estado = body["estado"]

    db.session.commit()

    return jsonify(propuesta.serialize()), 200

@api.route('/propuestas/<int:propuesta_id>', methods=['DELETE'])
def delete_propuesta(propuesta_id):

    propuesta = db.session.get(Propuesta, propuesta_id)

    if not propuesta:
        return jsonify({"msg": "Propuesta no encontrada"}), 404

    db.session.delete(propuesta)
    db.session.commit()

    return jsonify({"msg": "Propuesta eliminada"}), 200