from reko_app import app, db

class File(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    og_filename = db.Column(db.String(100))
    filename = db.Column(db.String(100))
    bucket = db.Column(db.String(100))
    region = db.Column(db.String(100))