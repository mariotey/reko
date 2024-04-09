from reko_app import app, db

class File(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    filename = db.Column(db.String(10000))
    owner_email = db.Column(db.String(100))
    bucket_url = db.Column(db.String(10000))

class User(db.Model):
    email = db.Column(db.String(100), primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
