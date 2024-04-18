"""
Flask Application

This script initializes and configures the Flask web application.
It sets up the Flask app, configures the secret key, and defines the SQLite database URI for data
storage.

"""

from datetime import timedelta
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure Secret Key
app.config['SECRET_KEY'] = "teletubby98"

# Configure Session lifetime
app.permanent_session_lifetime = timedelta(days=1)

# Set up the application context
app.app_context().push()

from reko_app import routes
