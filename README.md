<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" width="120" alt="VayuSense Logo" />
  <h1>VayuSense</h1>
  <p><strong>Hyperlocal Urban Air Intelligence Platform for Smart City Intervention</strong></p>
  <p>Built for the Economic Times Hackathon</p>

  [![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-badge/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)
</div>

---

## 🌍 The Problem

India has over 900 Air Quality monitoring sensors (CAAQMS), generating millions of data points daily. Yet, **only 31% of Indian cities** have actionable, hyperlocal intervention protocols linked to this data. 

Currently, officials can see *that* pollution is high, but they cannot definitively answer:
1. **Who/what is causing the spike right now?**
2. **Where will the pollution move in the next 24 hours?**
3. **What specific enforcement actions should be taken?**

**VayuSense** closes this gap. It is the intelligence layer that transforms raw CPCB (Central Pollution Control Board) and satellite data into direct, verifiable enforcement actions.

---

## 💡 The Solution

VayuSense is a comprehensive AI-powered platform featuring a stunning React dashboard for city officials and a multilingual chat interface for citizens. It is powered by three core AI agents:

### 1. 🏭 PollutionBlame™ (Source Attribution)
* **What it does:** Identifies the root cause of pollution spikes in real-time at the ward level.
* **How it works:** Cross-references live CAAQMS readings with Google Maps traffic density, Sentinel-2 satellite thermal anomalies, and industrial permit zones.
* **Output:** A precise percentage breakdown (e.g., 42% Vehicular, 31% Construction Dust) identifying the primary polluters.

### 2. 🔮 AirOracle™ (Hyperlocal Forecaster)
* **What it does:** Predicts AQI levels 24-72 hours in advance at a 1km grid resolution.
* **How it works:** Utilizes an LSTM + Transformer hybrid model, ingesting IMD meteorological forecasts and seasonal emission patterns.
* **Output:** Color-coded timeline forecasts allowing schools, hospitals, and traffic police to prepare in advance.

### 3. 🚨 EnforcementCopilot™ (RAG-Powered Action Recommender)
* **What it does:** Generates specific, legally grounded intervention recommendations for city officials.
* **How it works:** Uses a RAG architecture over CPCB regulatory guidelines and registered polluter databases.
* **Output:** E.g., *"Deploy inspectors to Sanathnagar. 40% PM10 spike correlated with 3 active construction permits violating dust suppression norms."*

### 💬 CitizenSaathi (Multilingual Public Interface)
A WhatsApp-style chat interface integrated directly into the platform.
* Built using the **Cohere Command R+ API**.
* Allows citizens to ask about hyperlocal air quality and receive health advisories in **English and Telugu**.

---

## 🛠️ Architecture & Tech Stack

VayuSense is built for immense scale, extreme speed, and seamless deployment.

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 15 (App Router), React 19 |
| **Styling** | TailwindCSS v4 (Glassmorphism aesthetics) |
| **Data Visualization** | Recharts (Pie/Area charts), React-Leaflet (Geospatial Mapping) |
| **Backend / API** | Netlify Serverless Functions (Node.js) |
| **AI / LLM Layer** | Cohere API (Command R+ with web search connectors) |
| **Deployment** | Netlify (Edge-optimized) |

### System Diagram

```text
[Data Ingestion]
  CPCB API → OpenAQ → IMD Weather → OSM Traffic
        ↓
[Intelligence Layer (Netlify Functions)]
  Agent 1: Attribution Analysis
  Agent 2: Time-series Forecasting
  Agent 3: Cohere RAG (Enforcement/Citizen Bot)
        ↓
[Application Layer (Next.js Dashboard)]
  Officials Analytics UI ←→ CitizenSaathi Chat
```

---

## 🚀 Local Development

To run the VayuSense platform locally on your machine:

**1. Clone the repository**
```bash
git clone https://github.com/shriya7756/VayuSense.git
cd VayuSense
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up Environment Variables**
Create a `.env.local` file in the root directory and add your free Cohere API key:
```env
COHERE_API_KEY=your_cohere_api_key_here
```

**4. Start the development server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Deployment (Netlify)

This project is perfectly optimized for Netlify deployment.

1. Connect your GitHub repository to Netlify.
2. The `netlify.toml` file will automatically configure the build settings.
3. In the Netlify Dashboard, navigate to **Site configuration > Environment variables**.
4. Add the `COHERE_API_KEY` as a Secret variable.
5. Click **Deploy Site**.

---

## 📈 Hackathon Judging Alignment

* **Business Impact:** Directly tackles a major public health crisis causing 1.67M annual deaths in India, saving city officials thousands of hours in manual data analysis.
* **Innovation:** First-of-its-kind multi-agent attribution and forecasting system with native regional language support for Hyderabad.
* **Scalability:** Serverless architecture deployed on the edge, capable of scaling to millions of concurrent citizen requests without infrastructure overhead.
* **UX/UI Excellence:** "Dark mode" executive interface provides dense information without cognitive overload.

---
*Built with ❤️ for the Economic Times Hackathon.*
