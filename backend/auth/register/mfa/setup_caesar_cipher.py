import os
import json
import boto3
from boto3.dynamodb.conditions import Key
import traceback

table_name = "dvh-user"
sns_topic_arn = os.getenv("SNS_TOPIC_ARN")

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)
sns_client = boto3.client("sns")
client = boto3.client("cognito-idp")


def validate_payload(payload):
    """Validates if the payload contains the required keys"""
    required_keys = ["email", "cipher_decryption_key"]
    for key in required_keys:
        if key not in payload or not payload.get(key):
            raise Exception(f"{key} not present in payload!!")

    validate_cipher_key(payload.get("cipher_decryption_key"))


def validate_cipher_key(cipher_key):
    """Validates the cipher key value"""
    cipher_key_int = int(cipher_key)
    if cipher_key_int < 1:
        raise Exception("Please enter a cipher key value greater than 1")
    if cipher_key_int > 25:
        raise Exception("Please enter a cipher key value less than 25")


def validate_and_get_user(email):
    """Validates if email already exists in the system"""
    response = table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("User doesn't exist in the system")

    user = response.get("Item")
    if not user.get("mfa_1", {}).get("configured"):
        raise Exception("MFA #1 not configured. Please configure it first.")

    if user.get("mfa_2", {}).get("configured"):
        raise Exception("Cipher key already set for the user")

    return user


def configure_caesar_cipher(payload):
    """Configures the Caesar cipher key for the user"""
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


def sns_notification_and_subscription(email):
    """Checks for email subscription and sends notification"""
    try:
        subscriptions = sns_client.list_subscriptions_by_topic(TopicArn=sns_topic_arn)
        already_subscribed = False
        for subscription in subscriptions["Subscriptions"]:
            if subscription["Endpoint"] == email:
                subscription_arn = subscription["SubscriptionArn"]
                if (
                    subscription_arn != "PendingConfirmation"
                    and ":" in subscription_arn
                ):
                    already_subscribed = True
                    break

        if not already_subscribed:
            # Filter policy applied to send email to respective user
            subscribe_response = sns_client.subscribe(
                TopicArn=sns_topic_arn,
                Protocol="email",
                Endpoint=email,
                ReturnSubscriptionArn=True,
                Attributes={"FilterPolicy": json.dumps({"email": [email]})},
            )

            subscription_arn = subscribe_response["SubscriptionArn"]
            print(f"Subscription ARN: {subscription_arn}")

        # Publish registration confirmation email
        sns_response = sns_client.publish(
            TopicArn=sns_topic_arn,
            Subject="Registration Successful",
            Message=f"Dear user,\n\nYour registration was successful. Thank you for registering!\n\nSincerely,\nTeam SDP-32",
            MessageAttributes={"email": {"DataType": "String", "StringValue": email}},
        )

        print(f"SNS publish response: {sns_response}")

        return sns_response

    except Exception as e:
        print(f"Error in sns_notification_and_subscription: {str(e)}")
        return {"message": str(e)}


class ResponseBuilder:
    @staticmethod
    def prepare_response(status, message, **kwargs):
        response = {
            "statusCode": status,
            "body": json.dumps({"message": message, **kwargs}),
            "headers": {
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "http://localhost:3000",
            },
        }
        return response


def lambda_handler(event, context):
    payload = json.loads(event.get("body"))
    try:
        validate_payload(payload)
        validate_and_get_user(payload.get("email"))

        # Update DynamoDB with Caesar cipher configuration
        configure_caesar_cipher(payload)

        # Subscribe and send confirmation email to the newly registered user
        sns_response = sns_notification_and_subscription(payload.get("email"))

        return ResponseBuilder.prepare_response(
            200,
            "Registration successful. Confirmation email sent.",
            sns_response=sns_response,
        )
    except Exception as e:
        traceback.print_exc()
        return ResponseBuilder.prepare_response(500, str(e))
