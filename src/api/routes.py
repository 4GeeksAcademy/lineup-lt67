"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Client, Administrador
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
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