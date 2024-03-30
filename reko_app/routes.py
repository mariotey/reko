import logging
from datetime import datetime
import json
from flask import render_template, redirect, request, make_response
from sqlalchemy import distinct
import requests

from reko_app import app

@app.route("/")
def index():
    return "Hello World! xD"