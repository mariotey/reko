"""
Flask Application

This script initializes and configures the Flask web application.
It sets up the Flask app, configures the secret key, and defines the SQLite database URI for data
storage.

"""

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure Secret Key
app.config['SECRET_KEY'] = "teletubby98"

# Set up the application context
app.app_context().push()

from reko import routes