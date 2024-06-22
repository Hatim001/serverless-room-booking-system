import json
import boto3
import base64
import logging


dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')
table = dynamodb.Table('Room')
S3_BUCKET_NAME = 'roomimg1'


logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    operation = event['httpMethod']
    if operation == 'PUT':
        return update_room(event)
    else:
        return {
            'statusCode': 400,
            'body': json.dumps('Unsupported method')
        }

def update_room(event):
    try:
        body = json.loads(event['body'])
        room_id = body['id']
        update_expression = 'SET '
        expression_attribute_names = {}
        expression_attribute_values = {}


        if 'type' in body:
            update_expression += '#type = :type, '
            expression_attribute_names['#type'] = 'type'
            expression_attribute_values[':type'] = body['type']
        if 'amenities' in body:
            update_expression += '#amenities = :amenities, '
            expression_attribute_names['#amenities'] = 'amenities'
            expression_attribute_values[':amenities'] = body['amenities']
        if 'price' in body:
            update_expression += '#price = :price, '
            expression_attribute_names['#price'] = 'price'
            expression_attribute_values[':price'] = body['price']
        if 'beds' in body:
            update_expression += '#beds = :beds, '
            expression_attribute_names['#beds'] = 'beds'
            expression_attribute_values[':beds'] = body['beds']


        if 'image_url' in body:
            image_data = body['image_url']
            file_extension = image_data.split(";")[0].split("/")[1]
            decoded_image = base64.b64decode(image_data.split(",")[1])
            s3_key = f"{room_id}.{file_extension}"


            logger.info(f"Uploading image to S3 with key: {s3_key}")

            s3.put_object(Bucket=S3_BUCKET_NAME, Key=s3_key, Body=decoded_image, ContentType=f'image_url/{file_extension}')
            image_url = f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
            update_expression += '#image_url = :image_url, '
            expression_attribute_names['#image_url'] = 'image_url'
            expression_attribute_values[':image_url'] = image_url


            logger.info(f"Image URL: {image_url}")


        update_expression = update_expression.rstrip(', ')


        logger.info(f"UpdateExpression: {update_expression}")
        logger.info(f"ExpressionAttributeValues: {expression_attribute_values}")


        table.update_item(
            Key={'id': room_id},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values
        )

        return {
            'statusCode': 200,
            'body': json.dumps('Room updated successfully')
        }

    except Exception as e:
        logger.error(f"Error updating room: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
