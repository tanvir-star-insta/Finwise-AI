/**
 * Secure Configuration Module
 * 
 * Instead of hardcoding API keys and webhook URLs directly in the frontend,
 * this module points all API requests to our local secure Node.js (Python) backend proxy.
 * The backend proxy securely reads the real credentials from the .env file.
 */
export const CONFIG = {
    API_BASE_URL: "http://localhost:3000/api",
    ENDPOINTS: {
        GEMINI_ADVISOR: "/gemini/advisor",
        GEMINI_CHAT: "/gemini/chat",
        SHEETS_SYNC: "/sync"
    }
};
