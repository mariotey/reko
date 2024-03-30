"""
This script is used to run the Flask application.

It imports the Flask app object from the  module and runs it using the Flask
development server. By default, it runs the application on 0.0.0.0 (accessible from any network
interface) and port 8000.

"""

from reko import app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)