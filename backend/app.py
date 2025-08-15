from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.get("/")
def index():
    return {"message": "TicketEase API running", "try": ["/api/health", "/api/events"]}


@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/events")
def events():
    return jsonify([
        {"id": 1, "title": "EDM Night", "venue": "QK7 Stadium", "price": 300000},
        {"id": 2, "title": "Acoustic Live", "venue": "Crescent Mall", "price": 200000},
    ])

if __name__ == "__main__":
    app.run(debug=True, port=5000)
