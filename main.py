from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
import requests
import os
from dotenv import load_dotenv

# Load local environment variables if .env file exists
load_dotenv()

app = FastAPI(title="CloudCast API")

# Use environment variable first, fallback to the working placeholder key for convenience
API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

@app.get("/api/forecast")
def get_forecast(place: str):
    if not place:
        raise HTTPException(status_code=400, detail="Place query parameter is required")
    
    # Request metric units to receive temperature directly in Celsius from OpenWeatherMap
    url = f"https://api.openweathermap.org/data/2.5/forecast?q={place}&appid={API_KEY}&units=metric"
    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"City '{place}' not found. Please check spelling.")
        elif response.status_code == 401:
            raise HTTPException(status_code=401, detail="Invalid API Key. Please check backend environment configuration.")
        elif response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Unable to retrieve forecast data from weather service.")
            
        data = response.json()
        
        # Structure payload to return to front-end
        return {
            "city_name": data.get("city", {}).get("name", place),
            "list": data.get("list", [])
        }
        
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Request to weather service timed out. Please try again.")
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=503, detail="Weather service is currently offline or unreachable.")



@app.get("/api/suggest")
def get_suggestions(query: str):
    if not query or len(query) < 2:
        return []
        
    static_cities = [
        "Amsterdam", "Berlin", "Cairo", "Cape Town", "Chicago", "Dubai", 
        "Hong Kong", "Istanbul", "London", "Los Angeles", "Melbourne", 
        "Mumbai", "New York", "Paris", "Rio de Janeiro", "Rome", 
        "San Francisco", "Seoul", "Singapore", "Sydney", "Tokyo", "Toronto"
    ]
    
    url = f"http://api.openweathermap.org/geo/1.0/direct?q={query}&limit=5&appid={API_KEY}"
    
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            suggestions = []
            for item in data:
                name = item.get("name", "")
                state = item.get("state")
                country = item.get("country", "")
                
                if state:
                    label = f"{name}, {state}, {country}"
                else:
                    label = f"{name}, {country}"
                suggestions.append(label)
            return suggestions
    except Exception:
        pass
        
    return [c for c in static_cities if query.lower() in c.lower()][:5]

# Mount static files at root. Note: this must be defined AFTER API routes to prevent intercepting API requests.
app.mount("/", StaticFiles(directory="static", html=True), name="static")
