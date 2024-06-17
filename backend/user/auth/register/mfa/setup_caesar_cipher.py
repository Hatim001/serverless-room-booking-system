import json
import os
import boto3
from boto3.dynamodb.conditions import Key
import traceback

table_name = "dvh-user"
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)

client = boto3.client("cognito-idp")


def validate_payload(payload):
    """validates if the payload consist of the keys required by lambda"""
    required_keys = ["email", "cipher_decryption_key"]
    for key in required_keys:
        if key not in payload or not payload.get(key):
            raise Exception(f"{key} not present in payload!!")

    validate_cipher_key(payload.get("cipher_decryption_key"))


def validate_cipher_key(cipher_key):
    """Validates the cipher key value"""
    cipher_key_int = int(cipher_key)
    if cipher_key_int <= 1:
        raise Exception("Please enter cipher key value greater than 1")
    if cipher_key_int >= 25:
        raise Exception("Please enter cipher key value less than 25")


def validate_and_get_user(email):
    """validates if email already exists in system"""
    response = table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("User doesn't exists in system")

    user = response.get("Item")
    if not user.get("mfa_1", {}).get("configured"):
        raise Exception("MFA #1 not configured. Please configure it first.")

    if user.get("mfa_2", {}).get("configured"):
        raise Exception("Cipher key already set for the user")

    return user


def configure_caesar_cipher(payload):
    """Configures the security question and answer for the user"""
    mfa_2 = {
        "cipher_decryption_key": payload.get("cipher_decryption_key"),
        "configured": True,
    }
    return table.update_item(
        Key={"email": payload.get("email")},
        UpdateExpression="SET mfa_2 = :mfa_2",
        ExpressionAttributeValues={":mfa_2": mfa_2},
        ReturnValues="ALL_NEW",
    )


def prepare_response(status, message, headers={}, **kwargs):
    """prepares the response"""
    response = {
        "statusCode": status,
        "body": json.dumps({"message": message, **kwargs}),
        "headers": {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:3000",
            **headers,
        },
    }
    return response


def lambda_handler(event, context):
    payload = json.loads(event.get("body"))
    try:
        validate_payload(payload)
        user = validate_and_get_user(payload.get("email"))
        configure_caesar_cipher(payload)
        return prepare_response(
            status=200, message="Caesar Cipher configured successfully"
        )

    except Exception as e:
        traceback.print_exc()
        return prepare_response(status=500, message=str(e))
