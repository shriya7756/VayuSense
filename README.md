<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" width="120" alt="VayuSense Logo" />
  <h1>VayuSense</h1>
  <p><strong>Hyperlocal Urban Air Intelligence Platform for Smart City Intervention</strong></p>
</div>

---

## 🌍 Abstract

VayuSense is an advanced, AI-driven urban air quality intelligence platform designed to bridge the gap between raw environmental data collection and actionable municipal enforcement. While standard platforms report historical or real-time Air Quality Index (AQI) metrics, VayuSense acts as a proactive intelligence layer. It utilizes multi-agent AI systems to provide real-time source attribution, highly accurate temporal forecasting, and legally-grounded enforcement recommendations for city officials. Furthermore, it democratizes access to this intelligence via a native, multilingual conversational interface for citizens.

---

## 🚨 The Core Problem

Metropolitan areas deploy vast networks of Continuous Ambient Air Quality Monitoring Stations (CAAQMS) which generate immense volumes of raw data. However, the data alone is insufficient for effective governance:

1. **Lack of Attribution:** Knowing that PM2.5 is elevated does not explain *why*. Is it vehicular traffic, a specific construction site, or a temperature inversion trapping industrial exhaust?
2. **Reactive Governance:** Municipal bodies typically react to pollution spikes after they occur. By the time emergency measures (like GRAP in Delhi) are implemented, public health has already been compromised.
3. **Information Asymmetry:** Citizens receive generic "Poor AQI" warnings without hyperlocal context or actionable health advisories in their native languages.

VayuSense solves these structural inefficiencies.

---

## 🧠 Core System Architecture

VayuSense is built around three distinct AI Agents working in concert, accessed via a centralized, low-latency dashboard.

### Agent 1: PollutionBlame™ (Source Attribution Engine)
Unlike traditional static emission inventories, PollutionBlame™ dynamically calculates the proportional contribution of various pollution sources in real-time.

* **Data Ingestion Pipeline:** 
  * Real-time CAAQMS telemetry via CPCB APIs.
  * Spatial traffic density mapping via OSM/Google Maps APIs.
  * Land-use classification and thermal anomaly detection via Sentinel-2 satellite imagery.
* **Algorithmic Approach:** Utilizes an XGBoost classifier combined with spatial regression models trained on historical emission inventories.
* **Operational Output:** Granular, ward-level source attribution (e.g., 42% Vehicular Emissions, 31% Construction Dust, 18% Industrial Exhaust, 9% Biomass Burning).

### Agent 2: AirOracle™ (Hyperlocal Forecaster)
AirOracle™ shifts the paradigm from reactive to predictive governance by providing 24 to 72-hour AQI forecasts at a 1km grid resolution.

* **Data Ingestion Pipeline:**
  * Meteorological forecasts (temperature, wind speed, wind direction, humidity) via IMD APIs.
  * Historical diurnal pollution curves.
* **Algorithmic Approach:** Employs a hybrid deep learning model combining Long Short-Term Memory (LSTM) networks for capturing temporal dependencies and Transformer attention mechanisms to weigh complex meteorological interactions.
* **Operational Output:** Continuous time-series predictions allowing municipal bodies to proactively implement traffic diversions or halt construction *before* critical thresholds are breached.

### Agent 3: EnforcementCopilot™ (RAG-Powered Action Recommender)
EnforcementCopilot™ is the actionable brain of the system, translating data anomalies into specific administrative directives.

* **Data Ingestion Pipeline:**
  * Outputs from PollutionBlame™ and AirOracle™.
  * Vectorized database of municipal environmental regulations, CPCB norms, and registered industrial/construction permits.
* **Algorithmic Approach:** Implements Retrieval-Augmented Generation (RAG). When an anomaly is detected, the system retrieves relevant legal frameworks and known polluter registries, feeding them as context to a Large Language Model.
* **Operational Output:** Legally grounded, highly specific directives. *(Example: "Deploy inspection team to Ward 12. Model indicates 85% probability that the current 40% PM10 spike is linked to 3 active construction permits violating mandatory dust suppression protocols.")*

---

## 💬 CitizenSaathi: Multilingual Public Interface

To ensure public participation, VayuSense features **CitizenSaathi**, a conversational AI assistant integrated directly into the platform.

* **Technology:** Powered by the **Cohere Command R+ API** with built-in web search connectors.
* **Functionality:** Users can query the bot regarding hyperlocal air quality using natural language.
* **Localization:** Native support for regional languages (e.g., Telugu, Hindi, English). The LLM automatically detects the input language and generates culturally contextualized health advisories (e.g., advising parents on school outdoor activities based on tomorrow's forecast).

---

## 🛠️ Technology Stack & Engineering Design

The platform is engineered for high availability, zero-maintenance scaling, and seamless developer operations.

### Frontend Layer (Next.js & React)
* **Framework:** Next.js 15 (App Router) ensuring optimal server-side rendering and SEO performance.
* **Styling:** TailwindCSS v4 implementing a "Glassmorphism" aesthetic. The dark-mode UI reduces cognitive load for officials monitoring dense data streams.
* **Geospatial Mapping:** React-Leaflet provides dynamic, interactive ward-level heatmaps without heavy client-side performance penalties.
* **Data Visualization:** Recharts is utilized for rendering complex predictive area charts and source attribution pie charts smoothly.

### Backend Layer (Serverless Architecture)
* **Infrastructure:** Deployed entirely on Netlify using Edge and Serverless Functions (Node.js).
* **Why Serverless?:** Circumvents the complexity and cost of maintaining dedicated Python/FastAPI servers. The stateless architecture scales infinitely to handle traffic spikes during severe pollution events without infrastructure overhead or deployment errors.
* **LLM Integration:** Direct, secure API integration with Cohere for the CitizenSaathi NLP layer.

---

## 🚀 Deployment & Installation Guide

VayuSense is open-source and ready for immediate deployment.

### Local Development Setup

**1. Clone the Repository**
```bash
git clone https://github.com/shriya7756/VayuSense.git
cd VayuSense
```

**2. Install Dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Create a `.env.local` file in the project root. You will need a free API key from Cohere.
```env
COHERE_API_KEY=your_cohere_api_key_here
```

**4. Initialize the Development Server**
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

### Production Deployment (Netlify)

The repository includes a pre-configured `netlify.toml` file, making production deployment instantaneous.

1. Create a new site on Netlify and link the `VayuSense` GitHub repository.
2. The build settings will automatically populate:
   * **Build command:** `npm run build`
   * **Publish directory:** `.next`
   * **Functions directory:** `netlify/functions`
3. Navigate to **Site configuration > Environment variables**.
4. Add `COHERE_API_KEY` as a Secret variable.
5. Trigger the deployment.

---

## 🔮 Future Roadmap

* **IoT Integration:** Direct ingestion of low-cost, decentralized sensor networks (e.g., PurpleAir) to increase spatial resolution beyond official CAAQMS stations.
* **Computer Vision Edge Nodes:** Deploying OpenCV-enabled traffic cameras to quantify vehicle emissions and detect active construction dust in real-time.
* **Automated Notice Generation:** Allowing EnforcementCopilot™ to automatically draft show-cause notices for identified industrial violators based on predictive attribution.
