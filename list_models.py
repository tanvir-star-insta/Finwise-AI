import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("No GEMINI_API_KEY found.")
    exit(1)

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    print("Available Models:")
    for model in data.get("models", []):
        if "generateContent" in model.get("supportedGenerationMethods", []):
            print(f"- {model['name']}")
else:
    print(f"Error fetching models: {response.text}")
