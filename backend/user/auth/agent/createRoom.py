import json
import boto3
from botocore.exceptions import ClientError
from uuid import uuid4
import base64

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    dynamodb = boto3.resource('dynamodb')
    entries_table = dynamodb.Table('Room')

    try:
        # Parse the incoming event body
        body = json.loads(event['body'])

        uniqueKey = uuid4()
        room_type = body['type']
        amenities = body['amenities']
        price = body['price']
        image_url = body['image_url']
        imageType = body['imageType']
        file_extension = imageType.split("/")[1]

        # Generate a unique filename
        filename = f"{uuid4()}.{file_extension}"

        # Decode the base64 encoded image
        decoded_image = base64.b64decode(image_url.split(",")[1])

        # Upload image to S3 bucket
        s3.put_object(
            Body=decoded_image,
            Bucket='roomimg1',
            Key=filename,
            ContentType=imageType
        )

        bucket_name = "roomimg1"
        image_url = f"https://{bucket_name}.s3.amazonaws.com/{filename}"
        print(image_url, imageType)

        # Store entry details in DynamoDB
        entries_table.put_item(Item={
            'id': str(uniqueKey),
            'type': room_type,
            'amenities': amenities,
            'price': str(price),
            'image_url': image_url,
        })

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({'message': 'Entry added successfully'})
        }

    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({'error': f'Error adding entry: {e}'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({'error': f'Error processing request: {e}'})
        }
