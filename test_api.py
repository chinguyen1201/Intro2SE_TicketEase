import requests
import json

# Test GET events endpoint
print("Testing GET /api/events:")
response = requests.get("http://localhost:5000/api/events")
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# Test POST events endpoint - create a draft event
print("\nTesting POST /api/events (draft):")
draft_data = {
    'title': 'Test Draft Event',
    'status': 'draft'
}

response = requests.post("http://localhost:5000/api/events", data=draft_data)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# Test GET events endpoint again to see the new event
print("\nTesting GET /api/events after creating draft:")
response = requests.get("http://localhost:5000/api/events")
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
