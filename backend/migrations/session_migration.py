import json
import boto3
import pymysql
import os
from datetime import datetime

# Environment variables for RDS connection
rds_host = os.environ["RDS_HOST"]
db_username = os.environ["DB_USERNAME"]
db_password = os.environ["DB_PASSWORD"]
db_name = os.environ["DB_NAME"]
db_port = os.environ["DB_PORT"]

# Initialize DynamoDB and RDS clients
dynamodb = boto3.client("dynamodb")
rds = pymysql.connect(
    host=rds_host, user=db_username, passwd=db_password, db=db_name, port=int(db_port)
)


def lambda_handler(event, context):
    rds_table_name = "dvh_session"

    # Prepare SQL insert/update statement for RDS
    upsert_query = f"""
    INSERT INTO {rds_table_name} (id, user_id, login_time)
    VALUES (%s, %s, %s)
    ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        login_time = VALUES(login_time)
    """

    # Prepare SQL delete statement for RDS
    delete_query = f"DELETE FROM {rds_table_name} WHERE id = %s"

    with rds.cursor() as cursor:
        for record in event["Records"]:
            if record["eventName"] in ["INSERT", "MODIFY"]:
                new_image = record["dynamodb"]["NewImage"]
                id = new_image["id"]["S"]
                user_id = new_image["user"]["M"]["id"]["S"]
                login_time_str = new_image["expiry_date"]["S"]
                login_time = datetime.strptime(login_time_str, "%Y-%m-%d %H:%M:%S")

                mfa_1_configured = new_image["mfa_1"]["M"]["configured"]["BOOL"]
                mfa_1_verified = new_image["mfa_1"]["M"]["verified"]["BOOL"]
                mfa_2_configured = new_image["mfa_2"]["M"]["configured"]["BOOL"]
                mfa_2_verified = new_image["mfa_2"]["M"]["verified"]["BOOL"]

                # Check if both MFA configurations are set and verified
                if (
                    mfa_1_configured
                    and mfa_1_verified
                    and mfa_2_configured
                    and mfa_2_verified
                ):
                    # Execute SQL upsert statement
                    cursor.execute(
                        upsert_query,
                        (id, user_id, login_time),
                    )

        rds.commit()

    return {"statusCode": 200, "body": json.dumps("Data migration complete")}
