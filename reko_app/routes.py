
import logging
import boto3
import uuid
# import key_config as keys
from flask import render_template, redirect, request, url_for, session, flash

from reko_app import app
# from reko_app.models import File

# Configuration for S3 bucket
S3_BUCKET_NAME = 'rekos3bucket'
S3_REGION = 'us-east-1'

s3_client = boto3.client("s3")

#################################################################################################

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        session.permanent = True

        user = request.form["username"]
        password = request.form["password"]

        # Perform some database operation

        # If authenticated
        if user:
            session["user"] = user
            return redirect(url_for("app_home"))

        flash("Incorrect Login details")

    return render_template("index.html")

#################################################################################################

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        user = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]
        second_password = request.form["second_password"]

        if password != second_password:
            flash ("Passwords did not match!")
            return redirect(url_for("register"))

        # Perform some database operation

        flash(f"{user} created successfully!")
        return redirect(url_for("index"))

    return render_template("register.html")

#################################################################################################

@app.route("/home", methods=["GET", "POST"])
def app_home():
    if "user" in session:
        user = session["user"]
        flash(f"Welcome, {user}!")
    else:
        flash(f"Error with login!")
        return redirect(url_for("index"))

    # Consider shifting this to Javascript
    if request.method == "POST":
        try:
            uploaded_file = request.files["file-to-save"]
            new_filename = uuid.uuid4().hex + '.' + uploaded_file.filename.rsplit(".",1)[1].lower()

            s3_client.upload_fileobj(uploaded_file, S3_BUCKET_NAME, new_filename)

            logging.error(f"{uploaded_file.filename} successfully uploaded!")

        except:
            logging.error(f"{uploaded_file.filename} failed to upload")

        return redirect(url_for("app_home"))

    return render_template("home.html", user=user)

#################################################################################################

@app.route("/logout")
def logout():
    flash("Successfully logged out!", "info")
    session.pop("user", None)

    # Perform some database operation

    return redirect(url_for("index"))

#################################################################################################
