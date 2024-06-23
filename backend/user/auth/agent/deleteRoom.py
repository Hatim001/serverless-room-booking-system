import json
import boto3
import logging
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')
table = dynamodb.Table('Room')

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class DecimalEncoder(json.JSONEncoder):
    """Encodes into decimal format"""
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)

def lambda_handler(event, context):

    try:
        body = json.loads(event['body'])
        room_id = body['id']

        logger.info(f"Deleting room with ID: {room_id}")

        """Searches for requested room by id to be deleted"""
        response = table.get_item(Key={'id': room_id})

        if 'Item' not in response:
            return prepare_response(
                status=400, message="Room does not exist"
            )

        room = response['Item']

       """deletes image_url from S3 bucket"""
        if 'image_url' in room:
            image_url = room['image_url']
            bucket_name = image_url.split('/')[2].split('.')[0]
            image_key = '/'.join(image_url.split('/')[3:])

            s3.delete_object(Bucket=bucket_name, Key=image_key)
            logger.info(f"Deleted image from S3: {image_url}")

        """Deletes room entry from DynamoDB"""
        table.delete_item(Key={'id': room_id})
        logger.info(f"Deleted room from DynamoDB: {room_id}")

        return prepare_response(
            status=200, message="Room deleted successfully!!"
        )

    except Exception as e:
        logger.error(f"Exception: {e}")
        return prepare_response(
            status=500, message="Room deletion failed"
        )


def prepare_response(status, message, headers={}, **kwargs):
    """prepares the response"""
    response = {
        "statusCode": status,
        "body": json.dumps({"message": message, **kwargs}, cls=DecimalEncoder),
        "headers": {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "OPTIONS, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:3000",
            **headers,
        },
    }
    return response

