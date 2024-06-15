import os
import json
import boto3
import traceback

dynamodb = boto3.resource("dynamodb")
table_name = os.getenv("DYNAMODB_TABLE_NAME")
cognito_client_id = os.getenv("COGNITO_CLIENT_ID")


def validate_payload(payload):
    """validates the payload"""
    required_keys = ["email", "code"]
    for key in required_keys:
        if key not in payload or not payload.get(key):
            raise Exception(f"{key} not present in payload!!")


def prepare_response(status, message, **kwargs):
    """prepares the response"""
    response = {
        "statusCode": status,
        "body": json.dumps({"message": message, **kwargs}),
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
        },
    }
    return response


def verify_code(email, code):
    """verifies the code"""
    client = boto3.client("cognito-idp")
    client.confirm_sign_up(
        ClientId=cognito_client_id,
        Username=email,
        ConfirmationCode=code,
    )


def update_user_verification_status(email):
    """updates the user verification status"""
    table = dynamodb.Table(table_name)
    table.update_item(
        Key={"email": email},
        UpdateExpression="set is_verified = :v",
        ExpressionAttributeValues={":v": True},
    )


def lambda_handler(event, context):
    payload = json.loads(event.get("body"))
    try:
        validate_payload(payload)
        email = payload.get("email")
        code = payload.get("code")
        verify_code(email, code)
        update_user_verification_status(email)
        return prepare_response(status=200, message="User verified successfully!!")
    except Exception as e:
        traceback.print_exc()
        return prepare_response(status=500, message=str(e))
