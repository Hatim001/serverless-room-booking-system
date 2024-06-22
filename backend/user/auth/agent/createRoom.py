import json
import boto3
from botocore.exceptions import ClientError
from uuid import uuid4
import base64
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    dynamodb = boto3.resource('dynamodb')
    entries_table = dynamodb.Table('Room')

    try:
       """stores request body data into DynamoDB"""
        body = json.loads(event['body'])

        uniqueKey = uuid4()
        room_type = body['type']
        amenities = body['amenities']
        price = body['price']
        beds = body['beds']
        image_url = body['image_url']
        imageType = body['imageType']
        file_extension = imageType.split("/")[1]

        """generates file name for image to be stored in bucket"""
        filename = f"{uuid4()}.{file_extension}"

       """Decodes the uploaded image"""
        decoded_image = base64.b64decode(image_url.split(",")[1])

       """stores the image into bucket"""
        s3.put_object(
            Body=decoded_image,
            Bucket='roomimg1',
            Key=filename,
            ContentType=imageType
        )

        bucket_name = "roomimg1"
        image_url = f"https://{bucket_name}.s3.amazonaws.com/{filename}"
        print(image_url, imageType)

       """adds elements into Room table"""
        entries_table.put_item(Item={
            'id': str(uniqueKey),
            'type': room_type,
            'amenities': amenities,
            'price': str(price),
            'beds': str(beds),
            'image_url': image_url,
        })

        return prepare_response(
            status=200, message="Room added successfully"
        )

    except ClientError as e:
        print(f"ClientError: {e}")
        return prepare_response(
            status=500, message=f"Error adding room: {e.response['Error']['Message']}"
        )

    except Exception as e:
        print(f"Exception: {e}")
        return prepare_response(
            status=500, message=f"Error adding room: {str(e)}"
        )

def prepare_response(status, message, headers={}, **kwargs):
    """prepares the response"""
    response = {
        "statusCode": status,
        "body": json.dumps({"message": message, **kwargs}, cls=DecimalEncoder),
        "headers": {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "OPTIONS, POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
            **headers,
        },
    }
    return response

