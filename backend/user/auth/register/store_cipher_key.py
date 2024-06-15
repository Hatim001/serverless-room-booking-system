import json
import os
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
user_table = dynamodb.Table("dvh-user")
session_table = dynamodb.Table("session")

client = boto3.client('cognito-idp')

def validate_event(payload):
    """validates if the payload consist of the keys required by lambda"""
    required_keys = ["email", "cipher_key", "role"]
    for key in required_keys:
        if key not in payload or not payload.get(key):
            raise Exception(f"{key} not present in payload!!")

def validate_cipher_key(cipher_key):
    """Validates the cipher key value"""
    cipher_key_int = int(cipher_key)
    if cipher_key_int <= 1:
        raise Exception("Please enter cipher key value greater than 1")
    if cipher_key_int >= 25:
        raise Exception("Please enter cipher key value less than 25")

def check_email_exists(email):
    """Validates if email already exists in system"""
    response = user_table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("Email doesn't exist in system")

def check_mfa_status(email):
    """Validates if MFA1 and MFA2 are passed by the user or not"""
    response = user_table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("Session does not exist")
    item = response["Item"]
    if not (item.get("mfa_1") and item.get("mfa_2")):
        return False
    else:
        # Set mfa_3 as true
        user_table.update_item(
            Key={"email": email},
            UpdateExpression="SET mfa_3 = :val",
            ExpressionAttributeValues={":val": True}
        )
        return True

def update_cipher_key_in_dynamodb(email, cipher_key):
    """Updates the cipher key in DynamoDB"""
    response = user_table.update_item(
        Key={"email": email},
        UpdateExpression="SET cipher_key = :key",
        ExpressionAttributeValues={":key": cipher_key},
        ReturnValues="ALL_NEW"
    )
    return response

def get_password_from_user_table(email):
    """Retrieves the password from the user table"""
    response = user_table.query(
        KeyConditionExpression=Key('email').eq(email)
    )
    if 'Items' in response and response['Items']:
        return response['Items'][0]['password']
    else:
        raise Exception("Email not found in user table")

def user_register_in_cognito(email, password, role):
    """Registers the user in Cognito"""
    response = client.sign_up(
        ClientId=os.getenv("COGNITO_CLIENT_ID"),
        Username=email,
        Password=password,
        UserAttributes=[
            {
                'Name': 'email',
                'Value': email
            },
            {
                'Name': 'custom:role',
                'Value': role
            }
        ]
    )
    return response

def lambda_handler(event, context):
    payload = json.loads(event.get("body"))
    try:
        validate_event(payload)
        email = payload.get("email")
        password = get_password_from_user_table(email)
        cipher_key = payload.get("cipher_key")
        role = payload.get("role")
        validate_cipher_key(cipher_key)
        check_email_exists(email)


        if check_mfa_status(email):
            record = update_cipher_key_in_dynamodb(email, cipher_key)

            response = user_register_in_cognito(email, password, role)
            return {
                "statusCode": 200,
                "body": json.dumps(
                    {
                        "message": "Cipher key added successfully",
                        "record": record,
                        "response": response
                    }
                ),
            }

        else:
            return {
                "statusCode": 400,
                "body": json.dumps(
                    {
                        "message": "Third Factor Authentication Failed!!"
                    }
                )
            }
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}
