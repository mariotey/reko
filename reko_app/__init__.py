"""
Flask Application

This script initializes and configures the Flask web application.
It sets up the Flask app, configures the secret key, and defines the SQLite database URI for data
storage.

"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta

app = Flask(__name__)

# Configure Secret Key
app.config['SECRET_KEY'] = "teletubby98"

# Configure Session lifetime
app.permanent_session_lifetime = timedelta(days=1)

# Configure the SQLite database URI
# app.config['SQLALCHEMY_DATABASE_URI'] = ('sqlite:///db.sqlite3')

# db = SQLAlchemy(app)

# Set up the application context
app.app_context().push()

from reko_app import routes
