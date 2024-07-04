import os
import json
import boto3
import traceback
from datetime import datetime, UTC

dynamodb = boto3.resource("dynamodb")
sns = boto3.client("sns")
sns_topic_arn = os.getenv("SNS_TOPIC_ARN")


class DynamoDBService:
    def __init__(self):
        self.dynamodb = dynamodb

    def get_item(self, table_name, key):
        table = self.dynamodb.Table(table_name)
        response = table.get_item(Key=key)
        return response.get("Item")

    def update_item(
        self,
        table_name,
        key,
        update_expression,
        expression_attribute_values,
        expression_attribute_names=None,
    ):
        table = self.dynamodb.Table(table_name)
        table.update_item(
            Key=key,
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ExpressionAttributeNames=expression_attribute_names,
        )


class BookingService:
    def __init__(self):
        self.db_service = DynamoDBService()

    def approve_booking(self, booking_id):
        timestamp = datetime.now(UTC).isoformat()
        self.db_service.update_item(
            "dvh-booking",
            {"id": booking_id},
            "SET #status = :status, updated_at = :timestamp",
            {":status": "RESERVED", ":timestamp": timestamp},
            {"#status": "status"},
        )


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
    try:
        for record in event["Records"]:
            message = json.loads(record["body"])
            booking_id = message.get("id")
            email = message.get("user", {}).get("email")

            booking_service = BookingService()
            booking_service.approve_booking(booking_id)

            sns.publish(
                TopicArn=sns_topic_arn,
                Subject="Booking Approved",
                Message=f"Booking {booking_id} has been approved.",
                MessageAttributes={
                    "email": {"DataType": "String", "StringValue": email}
                },
            )

        return ResponseBuilder.prepare_response(
            status=200, message="Booking approved successfully!!"
        )
    except Exception as e:
        traceback.print_exc()
        return ResponseBuilder.prepare_response(status=500, message=str(e))
