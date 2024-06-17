import json
import os
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
user_table_name = os.getenv("DYNAMODB_USER_TABLE_NAME")
session_table_name = os.getenv("DYNAMODB_SESSION_TABLE_NAME")

user_table = dynamodb.Table(user_table_name)
session_table = dynamodb.Table(session_table_name)


def validate_event(payload):
    """validates if the payload consist of the keys required by lambda"""
    required_keys = ["email", "question", "answer"]
    for key in required_keys:
        if key not in payload or not payload.get(key):
            raise Exception(f"{key} not present in payload!!")


def check_email_exists(email):
    """validates if email already exists in system"""
    response = user_table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("Email doesn't exists in system")


def check_mfa_status(email):
    """Validates if MFA1 is completed by the user or not"""
    response = session_table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("Session does not exist")
    item = response["Item"]
    if not item.get("mfa_1"):
        return False

    session_table.update_item(
        Key={"email": email},
        UpdateExpression="SET mfa_2 = :val",
        ExpressionAttributeValues={":val": True},
    )
    return True


def validate_second_factor_authentication(email, question, answer):
    """validates the second factor authentication"""
    response = user_table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("User does not exist")
    item = response["Item"]
    security_details = item.get("mfa_1", {})

    if (
        not security_details.get("security_question") == question
        or not security_details.get("security_answer").lower() == answer.lower()
    ):
        return False
    else:
        return True


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
        validate_event(payload)
        email = payload.get("email")
        question = payload.get("security_question")
        answer = payload.get("security_answer")
        check_email_exists(email)

        validation_result = validate_second_factor_authentication(
            email, question, answer
        )

        if validation_result:
            mfa_status = check_mfa_status(email)
            if mfa_status:

                return prepare_response(
                    status=200,
                    message="Security question passed successfully!!",
                )
            else:
                return prepare_response(
                    status=200,
                    message="User has not logged in yet!!",
                )
        else:
            return prepare_response(
                status=200, message="Invalid security question or answer"
            )

    except Exception as e:
        return prepare_response(status=500, message=str(e))
