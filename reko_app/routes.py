import logging
from datetime import datetime
import json
from flask import render_template, redirect, request, make_response
from sqlalchemy import distinct
import requests

from reko_app import app

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/home")
def app_home():
    return render_template("home.html")