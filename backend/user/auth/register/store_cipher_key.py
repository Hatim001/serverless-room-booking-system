import json
import boto3

dynamodb = boto3.resource("dynamodb")
table_name = "dvh-user"
table = dynamodb.Table(table_name)

def validate_event(payload):
    """validates if the payload consist of the keys required by lambda"""
    required_keys = ["email", "cipher_key"]
    for key in required_keys:
        if key not in payload or not payload.get(key):
            raise Exception(f"{key} not present in payload!!")

def validate_cipher_key(cipher_key):
    """validates the cipher key value"""
    cipher_key_int = int(cipher_key)
    if cipher_key_int <= 1:
        raise Exception("Please enter cipher key value greater than 1")
    if cipher_key_int >= 25:
        raise Exception("Please enter cipher key value less than 25")

def check_email_exists(email):
    """validates if email already exists in system"""
    response = table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("Email doesn't exists in system")

def update_cipher_key_in_dynamodb(email, cipher_key):
    """updates the cipher key in dynamodb"""
    response = table.update_item(
        Key={"email": email},
        UpdateExpression="SET cipher_key = :key",
        ExpressionAttributeValues={":key": cipher_key},
        ReturnValues="ALL_NEW"
    )
    return response

def lambda_handler(event, context):
    payload = json.loads(event.get("body"))
    try:
        validate_event(payload)
        email = payload.get("email")
        cipher_key = payload.get("cipher_key")
        validate_cipher_key(cipher_key)
        check_email_exists(email)
        record = update_cipher_key_in_dynamodb(email, cipher_key)
        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": "Cipher key added successfully",
                    "record": record,
                }
            ),
        }
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}

