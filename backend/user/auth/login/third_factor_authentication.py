import json
import boto3

dynamodb = boto3.resource("dynamodb")
table_name = "dvh-user"
table = dynamodb.Table(table_name)

def validate_event(payload):
    """validates if the payload consist of the keys required by lambda"""
    required_keys = ["email", "plain_text","user_input"]
    for key in required_keys:
        if key not in payload or not payload.get(key):
            raise Exception(f"{key} not present in payload!!")

def check_email_exists(email):
    """validates if email already exists in system"""
    response = table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("Email doesn't exists in system")

# Reference: https://www.geeksforgeeks.org/caesar-cipher-in-cryptography/
def caeser_cipher_encryption(email,plain_text):
    """validates if key exists in table"""
    response = table.get_item(Key={"email": email})
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
        return "Third factor authentication successful"
    else:
        return "Third factor authentication failed"


def lambda_handler(event, context):
    payload = json.loads(event.get("body"))
    try:
        validate_event(payload)
        email = payload.get("email")
        plain_text = payload.get("plain_text")
        user_input = payload.get("user_input")
        check_email_exists(email)
        result = caeser_cipher_encryption(email,plain_text)
        validation_message = encryption_validation(result,user_input)
        return {
            "statusCode": 200,
            "body": json.dumps(validation_message)

        }
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}






