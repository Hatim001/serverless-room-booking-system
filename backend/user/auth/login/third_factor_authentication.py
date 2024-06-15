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
    required_keys = ["email", "plain_text","user_input"]
    for key in required_keys:
        if key not in payload or not payload.get(key):
            raise Exception(f"{key} not present in payload!!")

def check_email_exists(email):
    """validates if email already exists in system"""
    response = user_table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("Email doesn't exists in system")

def check_mfa_status(email):
    """Validates if MFA1 and MFA2 are passed by the user or not"""
    response = session_table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("Session does not exist")
    item = response["Item"]
    if not (item.get("mfa_1") and item.get("mfa_2")):
        return False
    else:
        # Set mfa_3 as true
        session_table.update_item(
            Key={"email": email},
            UpdateExpression="SET mfa_3 = :val",
            ExpressionAttributeValues={":val": True}
        )
        return True

# Reference: https://www.geeksforgeeks.org/caesar-cipher-in-cryptography/
def caeser_cipher_encryption(email,plain_text):
    """validates if key exists in table"""
    response = user_table.get_item(Key={"email": email})
    item = response.get("Item")
    if not item or "cipher_key" not in item:
        raise Exception("Cipher key not present in system")
    else:
        """text encryption using caeser cipher"""
        cipher_key = int(item.get("cipher_key"))
        result = ""

        # traverse the plain text
        for i in range(len(plain_text)):
            char = plain_text[i]

            # Uppercase characters encryption
            if (char.isupper()):
                result += chr((ord(char) + cipher_key-65) % 26 + 65)
            # Lowercase characters encryption
            else:
                result += chr((ord(char) + cipher_key-97) % 26 + 97)
        return result

def encryption_validation(result,user_input):
    """String matching for encryption validation"""
    if result == user_input:
        return True
    else:
        return

def get_password_from_user_table(email):
    """Retrieves the password from the user table"""
    response = user_table.query(
        KeyConditionExpression=Key('email').eq(email)
    )
    if 'Items' in response and response['Items']:
        return response['Items'][0]['password']
    else:
        raise Exception("Email not found in user table")


def authenticate_user(email, password, role):
    """Authenticate the user to get token from Cognito"""
    auth_params = {
        'USERNAME': email,
        'PASSWORD': password,
    }

    response = client.initiate_auth(
        ClientId=os.getenv("COGNITO_CLIENT_ID"),
        AuthFlow='USER_PASSWORD_AUTH',
        AuthParameters=auth_params
    )

    auth_result = response['AuthenticationResult']
    access_token = auth_result['AccessToken']
    expires_in = auth_result['ExpiresIn']

    return access_token, expires_in

def update_session_with_token(email, token, expiry_time):
    """Updates the session table with token and expiry time"""
    session_table.update_item(
        Key={"email": email},
        UpdateExpression="SET #tk = :token, expiry_time = :expiry_time",
        ExpressionAttributeNames={"#tk": "token"},
        ExpressionAttributeValues={
            ":token": token,
            ":expiry_time": expiry_time
        }
    )

def lambda_handler(event, context):
    payload = json.loads(event.get("body"))
    try:
        validate_event(payload)
        email = payload.get("email")
        password = get_password_from_user_table(email)
        role = payload.get("role")
        plain_text = payload.get("plain_text")
        user_input = payload.get("user_input")
        check_email_exists(email)
        result = caeser_cipher_encryption(email,plain_text)
        validation_message = encryption_validation(result,user_input)
        if(validation_message):
            mfa_status = check_mfa_status(email)
            if mfa_status:
                access_token, expires_in = authenticate_user(email, password, role)
                update_session_with_token(email, access_token, expires_in)
                return {
                    "statusCode": 200,
                    "body": json.dumps({"access_token": access_token})
                }
            else:
                return {
                    "statusCode": 200,
                    "body": json.dumps({"message": "MFA1 and MFA2 not passed"})
                }
        else:
            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Encryption validation failed"})
            }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}






