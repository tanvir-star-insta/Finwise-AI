# FinWise AI

FinWise AI is a modern, responsive, and intelligent financial advisory platform designed to help users evaluate their financial health, calculate EMIs, diagnose credit factors, and interact directly with a cutting-edge AI financial advisor. 

The platform features a stunning glassmorphism UI with smooth animations and dynamic data visualizations, all backed by a secure Python proxy server that connects to the Google Gemini AI API.

## 🚀 Key Features

*   **Intelligent Loan Eligibility Evaluator**: Input your income, existing debts, and credit score to instantly determine your loan eligibility, complete with a detailed visual breakdown and risk assessment.
*   **Credit Diagnostics Hub**: Analyze the factors impacting your credit score. Receive actionable, AI-generated tips on how to improve your financial standing.
*   **Dynamic EMI Calculator**: A highly interactive slider-based calculator that instantly visualizes your monthly repayment schedules, total interest, and total payable amounts.
*   **Interactive AI Advisory Chat**: Chat directly with the "FinWise AI Advisor" powered by Google's Gemini API. The AI provides tailored savings templates, credit repair guidelines, and investment allocation plans.
*   **Secure Backend Proxy**: Your API keys are never exposed in the browser! A lightweight Python Flask backend securely proxies all requests to Google services.

## 🛠️ Architecture & Technologies

*   **Frontend**: Vanilla HTML5, CSS3, and JavaScript. 
    *   Features a custom-built, lightweight CSS design system (glassmorphism, CSS variables, flexbox/grid layouts).
    *   Uses `marked.js` to perfectly render Markdown responses from the AI.
*   **Backend Proxy**: Python 3 and Flask.
    *   Serves as a secure bridge to hide API keys.
    *   Handles CORS, JSON parsing, and API error forwarding.
*   **External APIs**:
    *   **Google Gemini API** (`gemini-flash-latest`) for all generative AI advisory and chat features.
    *   **Google Apps Script** for syncing user financial data to a Google Sheet database.

## ⚙️ Local Setup Instructions

Follow these steps to run the complete FinWise AI stack locally.

### 1. Prerequisites
*   [Python 3.14+](https://www.python.org/downloads/) installed.
*   A valid [Google Gemini API Key](https://aistudio.google.com/app/apikey).
*   (Optional) A Google Apps Script Webhook URL for the database sync feature.

### 2. Environment Configuration
1. Clone this repository.
2. In the project root, open the `.env` file (if it doesn't exist, create it based on `.env.example`).
3. Add your secrets:
   ```env
   GEMINI_API_KEY=your_real_api_key_here
   GOOGLE_APPS_SCRIPT_URL=your_webhook_url_here
   ```

### 3. Start the Secure Backend Proxy
The Python backend handles the secure API calls.
1. Open a terminal in the project root.
2. Install the required Python dependencies:
   ```bash
   python -m pip install flask flask-cors python-dotenv requests
   ```
3. Start the Flask server:
   ```bash
   python app.py
   ```
   *The proxy will run on `http://localhost:3000`.*

### 4. Start the Frontend Application
The frontend is a static site. You can serve it using Python's built-in HTTP server.
1. Open a **new** terminal in the project root (leave the proxy running).
2. Start the static server:
   ```bash
   python -m http.server 8080
   ```
3. Open your browser and navigate to: `http://localhost:8080/index.html`

## 🔒 Security Notes
*   **Never commit your `.env` file to version control.** It is already included in the `.gitignore` to prevent accidental uploads.
*   The frontend uses the `js/config.js` file to route all AI traffic exclusively through the local `localhost:3000` proxy, ensuring zero credential leakage in network tabs.

Developed as part of the SmartBridge VIP Program.
