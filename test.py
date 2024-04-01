import requests

API_GATEWAY_URL = "https://ptlxa2tfg9.execute-api.us-east-1.amazonaws.com"


response = requests.get(f"{API_GATEWAY_URL}/getPerson?personId=personId123")
json_response = response.json()

print("Complete")