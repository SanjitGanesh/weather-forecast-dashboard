# 🌦️ CloudCast — Premium Weather Dashboard

CloudCast is a modern, responsive, and beautifully designed weather forecasting web application. It transitions the original Streamlit codebase into a production-ready, full-stack Single Page Application (SPA) powered by a secure **FastAPI** backend and a custom **HTML5/Vanilla CSS3/JavaScript** frontend.

Deploy it instantly on **Render** using the provided blueprint configurations!

---

## 🚀 Live Demo
👉 **[View the Live Demo on Render](https://weather-forecast-dashboard-rloo.onrender.com/)**

---

## ✨ Features

*   **Premium Glassmorphic Design:** A modern dark-mode aesthetic featuring custom background gradient glows, frosted-glass cards (`backdrop-filter`), smooth hover transitions, and a premium indigo glow on the active card.
*   **Animated SVG Weather Icons:** Implements hand-crafted **Meteocons** SVG weather animations loaded via CDN, complete with dynamic day/night asset selection and intelligent cloud cover condition mapping.
*   **Interactive Forecast Charts:** Uses **ApexCharts** to plot smooth, responsive temperature trends over 1-5 days with interactive tooltips and under-curve gradients.
*   **Secure API Proxying:** Queries OpenWeatherMap forecast data securely through the backend, keeping API keys hidden from client-side inspectors.
*   **Full Mobile Optimization:** Stacked forms, responsive columns, and flexible layouts specifically tailored to look stunning on tablets and mobile screens.

---

## 🛠️ Technology Stack

*   **Frontend:** HTML5, Vanilla CSS3, Javascript, [ApexCharts](https://apexcharts.com/), [Lucide Icons](https://lucide.dev/), [Meteocons](https://meteocons.com/)
*   **Backend:** Python 3.13, [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/), [Requests](https://requests.readthedocs.io/)
*   **Package Manager:** [uv](https://github.com/astral-sh/uv) (supports standard `pip` fallbacks)
*   **Deployment:** [Render Blueprint](https://render.com/docs/blueprints) (`render.yaml`)

---

## 💻 Local Installation & Setup

### Prerequisites
*   Python `>= 3.13`
*   An active [OpenWeatherMap API Key](https://openweathermap.org/api)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/weather-forecast-dashboard.git
cd weather-forecast-dashboard
```

### 2. Configure Environment Variables
Copy the template configuration file to `.env`:
```bash
cp local.env.example .env
```
Open the `.env` file and insert your API key:
```env
OPENWEATHERMAP_API_KEY="your_api_key_here"
```

### 3. Install Dependencies & Run
If using **`uv`** (recommended):
```bash
uv sync
uv run uvicorn main:app --reload
```

Or using standard **`pip`**:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Once started, open **`http://localhost:8000`** in your browser.

---

## ☁️ Deployment on Render (Blueprint)

This project includes a `render.yaml` specification for zero-config deployments:

1.  Push your repository changes to GitHub.
2.  Log in to [Render Dashboard](https://dashboard.render.com/) and click **New** -> **Blueprint**.
3.  Connect your repository. Render will automatically configure the builder:
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4.  In the environment configuration step, paste your OpenWeatherMap API Key in the `OPENWEATHERMAP_API_KEY` field.
5.  Click **Deploy**!
