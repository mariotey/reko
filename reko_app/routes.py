
import logging
import boto3
import requests

# import key_config as keys
from flask import render_template, redirect, request, url_for, session, flash

from reko_app import app

# Configuration for S3 bucket
S3_BUCKET_NAME = 'rekos3bucket'
S3_REGION = 'us-east-1'

API_PATH = "https://ptlxa2tfg9.execute-api.us-east-1.amazonaws.com/"

s3_client = boto3.client("s3")

#################################################################################################

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        session.permanent = True

        email = request.form["email"]
        password = request.form["password"]

        user_response = requests.get(f"{API_PATH}/getPerson",
                                     params={
                                         "user_email": email
                                         }
                                    )

        user_result = user_response.json()

        if user_response.status_code == 200 and user_result["user_password"] == password:
            session["user"] = user_result["user_name"]
            session["email"] = user_result["user_email"]

            return redirect(url_for("app_home"))

        flash("Incorrect Login details")

    return render_template("index.html")

#################################################################################################

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]
        second_password = request.form["second_password"]

        if password != second_password:
            flash ("Passwords did not match!")
            return redirect(url_for("register"))

        create_response = requests.post(f"{API_PATH}/createPerson",
                                        params={"user_email": email,
                                                "user_name": username,
                                                "user_password": password
                                                }
                                        )

        if create_response.json():
            logging.error("User added successfully!")
            flash(f"{username} created successfully!")
            return redirect(url_for("index"))

        logging.error("Failed to create user")

    return render_template("register.html")

#################################################################################################

@app.route("/home", methods=["GET", "POST"])
def app_home():
    if "user" not in session:
        flash(f"Error with login!")
        return redirect(url_for("index"))

    user = session["user"]
    email = session["email"]

    files_response = requests.get(f"{API_PATH}/getFileObj",
                                     params={"user_email": email}
                                )

    files_result = files_response.json()["result"]

    if request.method == "POST":
        try:
            uploaded_file = request.files["file-to-save"]
            s3_client.upload_fileobj(uploaded_file, S3_BUCKET_NAME, uploaded_file.filename)

            dumpfile_response = requests.post(f"{API_PATH}/createFileObj",
                                            params={"filename": uploaded_file.filename,
                                                    "owner_email": email,
                                                    "bucket_url": f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{uploaded_file.filename}"
                                                    }
                                            )

            dumpfile_result = dumpfile_response.json()

            if dumpfile_result:
                logging.error(f"{uploaded_file.filename} successfully uploaded!")
            else:
                logging.error(f"{uploaded_file.filename} failed to upload")
        except:
            logging.error(f"{uploaded_file.filename} failed to upload")

        return redirect(url_for("app_home"))

    return render_template("home.html", user=user, files = files_result)

#################################################################################################

# Endpoint for deleting a file
@app.route('/delete_file/<int:file_id>', methods=['POST'])
def delete_file(file_id):
    # Retrieve the file name from the database based on the file_id
    deletefile_response = requests.post(f"{API_PATH}/deleteFileObj",
                                        params={"file_id": file_id}
                                    )
    deletefile_result = deletefile_response.json()["result"]

    if deletefile_result:
        s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=deletefile_result[0])
        logging.error("File Deleted")
    else:
        logging.error("Failed to delete file")

    # Redirect the user to the page where the file list is displayed
    return redirect(url_for("app_home"))

#################################################################################################

@app.route("/logout")
def logout():
    flash("Successfully logged out!", "info")
    session.pop("user", None)

    return redirect(url_for("index"))

#################################################################################################
