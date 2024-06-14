import re
import json
import uuid
import boto3
import random
from constants import adjectives, nouns

dynamodb = boto3.resource("dynamodb")
table_name = "dvh-user"
table = dynamodb.Table(table_name)


def validate_event(payload):
    """validates if the payload consist of the keys required by lambda"""
    required_keys = ["email", "password", "role"]
    for key in required_keys:
        if key not in payload or not payload.get(key):
            raise Exception(f"{key} not present in payload!!")

    validate_password(payload.get("password"))
    validate_role(payload.get("role"))


def validate_role(role):
    """validates the role"""
    if role not in ["agent", "user"]:
        raise Exception("Role must be either agent or user!!")


def validate_password(password):
    """validates the password requirements using regex"""
    if len(password) < 8:
        raise Exception("Password must be at least 8 characters long")
    if not re.search(r"\d", password):
        raise Exception("Password must have at least one digit")
    if not re.search(r"[A-Z]", password):
        raise Exception("Password must have at least one uppercase letter")
    if not re.search(r"[a-z]", password):
        raise Exception("Password must have at least one lowercase letter")
    if not re.search(r"[!@#$%^&*()-+]", password):
        raise Exception("Password must have at least one special character")


def check_email_exists(email):
    """validates if email already exists in system"""
    response = table.get_item(Key={"email": email})
    if "Item" in response:
        raise Exception("Email already exists in system")


def generate_random_name():
    """generates a random name"""
    adjective = random.choice(adjectives)
    noun = random.choice(nouns)
    number = random.randint(1, 9999)
    name = f"{adjective}{noun}{number}"
    return name


def prepare_user_schema(payload):
    """prepares the user schema"""
    return {
        "email": payload.get("email"),
        "password": payload.get("password"),
        "role": payload.get("role"),
        "is_verified": False,
        "name": generate_random_name(),
        "dob": "",
        "gender": "",
        "mfa_1": {
            "security_question": "",
            "security_answer": "",
        },
        "mfa_2": {
            "cipher_decryption_key": "",
        },
    }


def store_record_in_dynamodb(data):
    """stores the user record in dynamodb"""
    _id = uuid.uuid4().hex
    record = table.put_item(Item={"id": _id, **data}, ReturnValues="ALL_OLD")
    return record


def lambda_handler(event, context):
    payload = json.loads(event.get("body"))
    try:
        validate_event(payload)
        email = payload.get("email")
        check_email_exists(email)
        user_payload = prepare_user_schema(payload)
        record = store_record_in_dynamodb(user_payload)
        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": "User registered successfully",
                    "record": record,
                }
            ),
        }
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}
