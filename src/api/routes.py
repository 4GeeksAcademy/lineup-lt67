"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Client
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/clients', methods=['GET'])
def get_clients():

    all_clients = list(db.session.execute(select(Client)).scalars().all())
    all_clients = list(map(lambda client: client.serialize(), all_clients))
    print(all_clients)

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(all_clients), 200

@api.route('/clients', methods=['POST'])
def post_client():

    all_clients = list(db.session.execute(select(Client)).scalars().all())
    all_clients = list(map(lambda client: client.serialize(), all_clients))
    

    body = request.get_json()
    if body is None:
        return jsonify({"error": "Request body can't be empty"}), 400
    if not body.get("email"):
        return jsonify({"error": "An Email is required"}), 400
    if not body.get("password"):
        return jsonify({"error": "A password is required"}), 400

    client = db.session.execute(select(Client).where(Client.email == body['email'])).scalar_one_or_none()
    if client:
        return jsonify({"error": "There is already an account with this Email"}), 400

    new_client = Client(
        email=body["email"],
        password=body["password"]
    )
    db.session.add(new_client)
    db.session.commit()
    return jsonify(new_client.serialize()), 201