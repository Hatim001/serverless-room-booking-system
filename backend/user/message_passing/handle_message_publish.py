import base64
import functions_framework
import json
import os
from google.cloud import firestore

PROJECT_ID = os.environ['GCP_PROJECT_ID']

# Triggered from a message on a Cloud Pub/Sub topic.
@functions_framework.cloud_event
def createChatDocuments(message):
    message_data = message.data

    # Extract parameters from message data 
    attributes=message_data.get('message',{}).get('attributes',{})

    # Access specific parameters or all parameters
    booking_id = attributes.get('bookingid')
    user_email = attributes.get('userEmail')
    user_role = attributes.get('userRole')
    agent_email = attributes.get('agentEmail')
    ticket_id = attributes.get('ticket_id')
    
    try:
        # Initializing Firestore
        db_ref = firestore.Client(project=PROJECT_ID)
        
        # chatConnections Collection
        chat_connections_ref = db_ref.collection("chatConnections")

        # Create or update document for userEmail
        user_doc_ref = chat_connections_ref.document(user_email)
        user_doc_ref.set({
            ticket_id: {
                "lastMessage": "",
                "userEmail": user_email,
                "agentEmail": agent_email,
                "lastUpdatedTimestamp": firestore.SERVER_TIMESTAMP,
                "bookingId": booking_id,
                "isResolved": False
            }
        }, merge=True)

        # Create or update document for agentEmail
        agent_doc_ref = chat_connections_ref.document(agent_email)
        agent_doc_ref.set({
            ticket_id: {
                "lastMessage": "",
                "userEmail": user_email,
                "agentEmail": agent_email,
                "lastUpdatedTimestamp": firestore.SERVER_TIMESTAMP,
                "bookingId": booking_id,
                "isResolved": False
            }
        }, merge=True)

        # chats Collection
        chats_ref = db_ref.collection("chats")
        chat_doc_ref = chats_ref.document(ticket_id)
        chat_doc_ref.set({
            "messages": []
        }, merge=True)

        print("Database updated successfully")
    except Exception as e:
        print("Error Occured:", e)
