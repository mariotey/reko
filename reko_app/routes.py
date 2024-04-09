
import logging
import boto3

# import key_config as keys
from flask import render_template, redirect, request, url_for, session, flash
from sqlalchemy.exc import IntegrityError

from reko_app import app, db
from reko_app.models import User, File

# Configuration for S3 bucket
S3_BUCKET_NAME = 'rekos3bucket'
S3_REGION = 'us-east-1'

s3_client = boto3.client("s3")

#################################################################################################

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        session.permanent = True

        email = request.form["email"]
        password = request.form["password"]

        # Perform some database operation
        user = User.query.filter_by(email=email).first()

        # If authenticated
        if user != None and user.password == password:
            session["user"] = user.username
            session["email"] = user.email

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

        # Perform some database operation
        try:
            user = User(
                username=username,
                email=email,
                password=password
            )

            db.session.add(user)
            db.session.commit()
            print("User added successfully!")
        except IntegrityError as e:
            db.session.rollback()
            print(f"Error: {e}")
            # Handle the specific IntegrityError, such as unique constraint violation for username/email
        except Exception as e:
            db.session.rollback()
            print(f"Error: {e}")
            # Handle other exceptions

        flash(f"{user.username} created successfully!")
        return redirect(url_for("index"))

    return render_template("register.html")

#################################################################################################

@app.route("/home", methods=["GET", "POST"])
def app_home():
    if "user" not in session:
        flash(f"Error with login!")
        return redirect(url_for("index"))

    user = session["user"]
    email = session["email"]

    user_files = File.query.filter_by(owner_email=email).all()

    if request.method == "POST":
        try:
            uploaded_file = request.files["file-to-save"]
            s3_client.upload_fileobj(uploaded_file, S3_BUCKET_NAME, uploaded_file.filename)

            logging.error(f"{uploaded_file.filename} successfully uploaded!")
            flash(f"{uploaded_file.filename} successfully uploaded!")

        except:
            logging.error(f"{uploaded_file.filename} failed to upload")
            flash(f"{uploaded_file.filename} failed to upload")

        return redirect(url_for("app_home"))

    return render_template("home.html", user=user, files = user_files)

#################################################################################################

# Endpoint for deleting a file
@app.route('/delete_file/<int:file_id>', methods=['POST'])
def delete_file(file_id):
    # Retrieve the file object from the database based on the file_id
    file = File.query.get_or_404(file_id)

    # Delete the file from the database
    db.session.delete(file)
    db.session.commit()

    # Redirect the user to the page where the file list is displayed
    return redirect(url_for("app_home"))

#################################################################################################

@app.route("/logout")
def logout():
    flash("Successfully logged out!", "info")
    session.pop("user", None)

    # Perform some database operation

    return redirect(url_for("index"))

#################################################################################################
