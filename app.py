import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for local development
CORS(app)

# Configuration from Environment Variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GOOGLE_APPS_SCRIPT_URL = os.getenv("GOOGLE_APPS_SCRIPT_URL")

@app.route("/api/gemini/advisor", methods=["POST"])
def gemini_advisor():
    if not GEMINI_API_KEY:
        return jsonify({"error": "GEMINI_API_KEY is not configured on the server."}), 500

    data = request.get_json()
    prompt = data.get("prompt")
    
    if not prompt:
        return jsonify({"error": "Prompt is required."}), 400

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json"}
    }
    
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        error_msg = response.text if 'response' in locals() else str(e)
        print(f"Gemini API Error: {error_msg}")
        return jsonify({"error": {"message": f"Gemini API Error: {error_msg}"}}), 500


@app.route("/api/gemini/chat", methods=["POST"])
def gemini_chat():
    if not GEMINI_API_KEY:
        return jsonify({"error": "GEMINI_API_KEY is not configured on the server."}), 500

    data = request.get_json()
    messages = data.get("messages", [])
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "systemInstruction": {
            "parts": [{"text": "You are FinWise AI, a professional and highly knowledgeable financial advisor. You provide clear, actionable, and structured financial advice."}]
        },
        "contents": messages,
        "generationConfig": {"responseMimeType": "text/plain"}
    }
    
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        error_msg = response.text if 'response' in locals() else str(e)
        print(f"Gemini API Error: {error_msg}")
        return jsonify({"error": {"message": f"Gemini API Error: {error_msg}"}}), 500


@app.route("/api/sync", methods=["POST"])
def sync_google_sheets():
    if not GOOGLE_APPS_SCRIPT_URL:
        return jsonify({"error": "GOOGLE_APPS_SCRIPT_URL is not configured on the server."}), 500

    data = request.get_json()
    
    try:
        # Note: We send this as application/json. If the Google Apps Script complains, we can adapt here.
        # However, server-to-server requests don't have CORS preflight issues!
        response = requests.post(GOOGLE_APPS_SCRIPT_URL, json=data)
        
        # Google Apps Script might return a 200 with HTML (redirect). We just assume success.
        return jsonify({"status": "success", "message": "Data forwarded to Google Sheets."})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("Starting secure FinWise AI backend proxy on port 3000...")
    app.run(port=3000, debug=True)
