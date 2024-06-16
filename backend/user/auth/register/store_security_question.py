import os
import traceback
import re
import json
import boto3

dynamodb = boto3.resource("dynamodb")
table_name = os.getenv("DYNAMODB_TABLE_NAME")
table = dynamodb.Table(table_name)

def validate_event(payload):
    """validates if the payload consist of the keys required by lambda"""
    required_keys = ["email", "security_question", "security_answer"]
    for key in required_keys:
        if key not in payload or not payload.get(key):
            raise Exception(f"{key} not present in payload!!")
    validate_security_details(payload.get("security_question"),payload.get("security_answer"))

def validate_security_details(question,answer):
    if len(question)==0:
        raise Exception("Question can't be empty!!")
    if len(answer)==0:
        raise Exception("Answer can't be empty!!")

def check_email_exists(email):
    """validates if email already exists in system"""
    response = table.get_item(Key={"email": email})
    if "Item" not in response:
        raise Exception("Email doesn't exists in system")

def update_security_details_in_dynamodb(payload):
    security_question=payload.get("security_question")
    security_answer=payload.get("security_answer")
    
    response = table.update_item(
        Key={'email': payload.get("email")},
        UpdateExpression="SET mfa_1.security_question = :security_question, mfa_1.security_answer = :security_answer",
        ExpressionAttributeValues={
            ':security_question': security_question,
            ':security_answer': security_answer
        },
        ReturnValues="ALL_NEW"
    )
    return response
    
def prepare_response(status, message, **kwargs):
    """prepares the response"""
    response = {
        "statusCode": status,
        "body": json.dumps({"message": message, **kwargs}),
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
        },
    }
    return response
    

def lambda_handler(event, context):
    payload = json.loads(event.get("body"))
    try:
        validate_event(payload)
        email = payload.get("email")
        check_email_exists(email)
        record = update_security_details_in_dynamodb(payload)
        return prepare_response(
            status=200, message="Security details added successfully", record=record
        )
        
    except Exception as e:
        traceback.print_exc()
        return prepare_response(status=500, message=str(e))
