"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Client, Administrador, Tipo, Establecimiento, Sucursal
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
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