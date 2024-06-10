import json
import uuid
import boto3

dynamodb = boto3.resource("dynamodb")
table_name = "dvh-user"
table = dynamodb.Table(table_name)


def validate_event(payload):
    """validates if the payload consist of the keys required by lambda"""
    required_keys = ["email", "password"]
    for key in required_keys:
        if key not in payload or not payload.get(key):
            raise Exception(f"{key} not present in payload!!")


def validate_password(password):
    """validates the password requirements"""
    if len(password) < 8:
        raise Exception("Password must be atleast 8 characters long")
    if not any(char.isdigit() for char in password):
        raise Exception("Password must have atleast one digit")
    if not any(char.isupper() for char in password):
        raise Exception("Password must have atleast one uppercase letter")
    if not any(char.islower() for char in password):
        raise Exception("Password must have atleast one lowercase letter")
    if not any(char in "!@#$%^&*()-+" for char in password):
        raise Exception("Password must have atleast one special character")


def check_email_exists(email):
    """validates if email already exists in system"""
    response = table.get_item(Key={"email": email})
    if "Item" in response:
        raise Exception("Email already exists in system")


def store_record_in_dynamodb(email, password):
    """stores the user record in dynamodb"""
    _id = uuid.uuid4().hex
    record = table.put_item(
        Item={"id": _id, "email": email, "password": password}, ReturnValues="ALL_OLD"
    )
    return record


def lambda_handler(event, context):
    payload = json.loads(event.get("body"))
    try:
        validate_event(payload)
        email = payload.get("email")
        password = payload.get("password")
        validate_password(password)
        check_email_exists(email)
        record = store_record_in_dynamodb(email, password)
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
