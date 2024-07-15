import functions_framework
import base64
import json
from google.cloud import pubsub_v1
import os
import requests

PROJECT_ID = os.environ['GCP_PROJECT_ID']
TOPIC_ID = os.environ['PUBSUB_TOPIC_ID']
API_ENDPOINT = os.environ['API_ENDPOINT']

@functions_framework.http
def publish_message(request):
   
    request_json = request.get_json(silent=True)
    request_args = request.args


    sessionInfo=request_json.get('sessionInfo')
    parameters=sessionInfo.get('parameters')
    bookingId=parameters.get('bookingid')
    userEmail=parameters.get('userEmail')
    userRole=parameters.get('userRole')

    if userRole!='user':
        return prepare_response('Sorry! only registered customers can chat with agent')
    
    try:
        # validating booking details and assigning agent
        response = requests.post(API_ENDPOINT, json={"email": userEmail})
        response_json = response.json()

        if response_json.get('message') != 'success':
            return prepare_response(response_json.get('errorMessage'))

        # publishing message on topic
        publisher = pubsub_v1.PublisherClient()
        topic_path = publisher.topic_path(PROJECT_ID, TOPIC_ID)

        message_data = 'create ticket'.encode('utf-8')
        future = publisher.publish(topic_path, message_data, **parameters)
        future.result()
        # print("Message sent")

        bot_response = "Thank you reaching out! We have created a new ticket #{} and agent:{} will be assisting you with this ticket. You can have chat with agent by clicking on the Tickets option in navigation bar".format(response_json.get('ticket_id'),response_json.get('agent_email'))

        return prepare_response(bot_response)
    except Exception as e:
        print("Error caught:",e)
        return prepare_response('Something went wrong! Please try again later')
    

def prepare_response(message):
    jsonResponse = {
        'fulfillment_response': {
            'messages': [
                {
                    'text': {
                        'text': [message]
                    }
                }
            ]
        }
    }
    return jsonResponse, 200, {'Content-Type': 'application/json'}
