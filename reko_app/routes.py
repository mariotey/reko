
import logging
import boto3
import uuid
import key_config as keys
from flask import render_template, redirect, request, url_for

from reko_app import app
# from reko_app.models import File

# Configuration for S3 bucket
S3_BUCKET_NAME = 'rekos3bucket'
S3_REGION = 'us-east-1'

s3_client = boto3.client("s3",
                            aws_access_key_id=keys.aws_access_key_id,
                            aws_secret_access_key=keys.aws_secret_access_key,
                            aws_session_token=keys.aws_session_token
                        )

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/home", methods=["GET", "POST"])
def app_home():
    if request.method == "POST":
        try:
            uploaded_file = request.files["file-to-save"]

            new_filename = uuid.uuid4().hex + '.' + uploaded_file.filename.rsplit(".",1)[1].lower()

            s3_client.upload_fileobj(uploaded_file, S3_BUCKET_NAME, new_filename)

            logging.error(f"{new_filename} succesfully uploaded")
        except:
            logging.error(f"{new_filename} failed to upload")

        return redirect(url_for("app_home"))

    # files = File.query.all()

    return render_template("home.html")
