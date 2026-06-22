<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" width="120" alt="VayuSense Logo" />
  <h1>VayuSense: Technical Architecture & Whitepaper</h1>
  <p><strong>Hyperlocal Urban Air Intelligence Platform for Smart City Intervention</strong></p>
</div>

---

## 1. Executive Summary

VayuSense is an enterprise-grade, edge-deployed urban air quality intelligence platform. Unlike conventional Environmental Management Information Systems (EMIS) that solely visualize telemetry data, VayuSense acts as a **proactive intelligence layer**. It ingests millions of data points from the Central Pollution Control Board (CPCB), meteorological sensors, and satellite imagery, routing them through a multi-agent AI framework to achieve three primary objectives:

1. **Deterministic Source Attribution** (identifying polluters).
2. **Temporal Grid Forecasting** (predicting pollution migration).
3. **Automated Enforcement Directives** (translating data into municipal action).

By utilizing a fully Serverless Node.js architecture deployed on Netlify, integrated with the Cohere Command R+ Large Language Model, the platform achieves ultra-low latency and infinite horizontal scaling without dedicated infrastructure overhead.

---

## 2. Comprehensive System Architecture

### 2.1 The Data Ingestion Layer
The intelligence of VayuSense relies on a robust, multi-modal ingestion pipeline.

* **Telemetry (Air Quality):** Webhooks and scheduled CRON jobs poll the CPCB APIs and OpenAQ network every 15 minutes, retrieving PM2.5, PM10, NO2, SO2, CO, and O3 levels from 900+ Continuous Ambient Air Quality Monitoring Stations (CAAQMS).
* **Meteorological Data:** The IMD (Indian Meteorological Department) APIs provide temperature, humidity, wind vector (speed/direction), and atmospheric pressure data at an hourly frequency.
* **Geospatial & Traffic:** OpenStreetMap (OSM) APIs supply baseline land-use classifications (Industrial, Residential, Commercial). Google Maps APIs provide live traffic density matrices (average vehicle speeds per road segment).
* **Satellite Observations:** We utilize the European Space Agency's (ESA) Sentinel-2 Copernicus API for high-resolution thermal anomaly detection (identifying active biomass burning or industrial flaring).

### 2.2 The Intelligence Layer (3-Agent System)

The core intelligence is distributed across three isolated but communicative AI Agents running as Netlify Serverless Functions.

#### Agent 1: PollutionBlame™ (Source Attribution Engine)
* **Objective:** Quantify the exact proportional contribution of emission sources at a 1km² grid level.
* **Algorithm:** The engine employs a stacked ensemble model. The base layer uses **Spatial Autoregressive (SAR)** models to account for spatial dependencies (pollution migrating from neighboring grids). The meta-classifier is an **XGBoost Algorithm** trained on historical source apportionment studies (like TERI or NEERI emission inventories).
* **Feature Engineering:** Features include live wind vectors, land-use tags, and traffic flow velocity. For example, high PM2.5 + high traffic congestion + low wind speed strongly correlates to Vehicular Emissions.
* **Output:** A JSON matrix representing the percentage breakdown of sources, visualized via the Recharts pie component on the dashboard.

#### Agent 2: AirOracle™ (Hyperlocal Temporal Forecaster)
* **Objective:** Predict AQI and specific pollutant concentrations for the next 24 to 72 hours.
* **Algorithm:** A hybrid deep learning architecture. A **Long Short-Term Memory (LSTM)** network captures the non-linear temporal dynamics and diurnal cycles of pollutants. This is fused with a **Transformer Attention Mechanism** that weighs complex, multivariate meteorological interactions (e.g., how a sudden drop in temperature coupled with low wind speed causes an atmospheric inversion, trapping particulates).
* **Resolution:** Predictions are calculated at a 1km spatial grid and a 3-hour temporal resolution.

#### Agent 3: EnforcementCopilot™ (RAG-Powered Action Recommender)
* **Objective:** Translate predictive data anomalies into legally-grounded administrative directives.
* **Algorithm:** Retrieval-Augmented Generation (RAG). 
* **Data Store:** We maintain a vectorized index (using ChromaDB/FAISS concepts mapped to serverless memory) containing the National Ambient Air Quality Standards (NAAQS), specific state pollution control board regulations, and a registry of active industrial/construction permits.
* **Execution Flow:** 
  1. *Anomaly Detected* (e.g., Agent 1 identifies 40% PM10 spike attributed to Construction).
  2. *Retrieval:* The system queries the vector store for active construction permits within the affected coordinates and the corresponding dust suppression legal codes.
  3. *Generation:* The Cohere API synthesizes this data into a specific, actionable directive for municipal officers.

### 2.3 The Presentation Layer (Next.js Application)
* **Framework:** Next.js 15 utilizing the App Router.
* **Geospatial Rendering:** `react-leaflet` is used for map rendering. To prevent Server-Side Rendering (SSR) window-object errors inherent to Leaflet in Next.js, the map component is dynamically imported with `ssr: false`.
* **State Management:** React hooks (`useState`, `useEffect`) handle live data polling and Agent API resolution.
* **Styling:** TailwindCSS v4 implements a custom "Glassmorphism" design system utilizing deep slate backgrounds (`#0f172a`), heavy backdrop blurring, and translucent borders to reduce cognitive overload while maintaining high data density.

---

## 3. CitizenSaathi: Advanced NLP Integration

CitizenSaathi democratizes access to hyperlocal environmental intelligence. It is a native, WhatsApp-style conversational interface embedded in the dashboard.

### 3.1 Cohere Command R+ Integration
* **Model Selection:** We utilize the `command-r-plus` model because it natively supports advanced RAG capabilities, web search connectors, and exhibits exceptional proficiency in indic languages (Hindi, Telugu, etc.).
* **Prompt Engineering:** The system preamble enforces strict behavioral guidelines. The bot acts as an authoritative but empathetic municipal assistant. It is restricted from answering non-AQI related queries to prevent prompt injection and hallucination.
* **Execution:** Hosted securely via `netlify/functions/enforcement.js`. This function acts as a secure proxy, masking the `COHERE_API_KEY` from the client-side bundle and preventing unauthorized API abuse.

---

## 4. Scalability, Security & Edge Deployment

Deploying on Netlify provides distinct advantages for municipal software intended to serve millions of citizens:

* **Zero-Cold-Start UI:** The Next.js application is statically generated (`next build`) and served from a global CDN. The dashboard loads instantly regardless of user location.
* **Serverless Elasticity:** The Node.js Netlify functions (`/api/enforcement`) spin up dynamically per request. During a severe pollution event (where citizen queries might spike by 10,000%), the infrastructure scales automatically without requiring load balancers or manual VM provisioning.
* **Zero-Trust API:** All interaction with the Cohere API occurs server-side. Cross-Origin Resource Sharing (CORS) policies are enforced to ensure the API functions only accept requests from the authenticated VayuSense domain.

---

## 5. Complete File Structure Reference

```text
vayusense/
├── netlify/
│   └── functions/
│       └── enforcement.js      # Serverless Node.js backend handling Cohere NLP logic
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css         # Global Tailwind styles & Glassmorphism variables
│   │   ├── layout.tsx          # Root Next.js layout & Font configuration
│   │   └── page.tsx            # Main Executive Dashboard composition
│   ├── components/
│   │   ├── AQIMap.tsx          # Dynamic Next.js wrapper for Leaflet (disables SSR)
│   │   ├── CitizenSaathiChat.tsx # Conversational UI component
│   │   ├── ForecastChart.tsx   # Recharts AreaChart for Agent 2 predictions
│   │   ├── Map.tsx             # Core Leaflet map logic & geo-markers
│   │   ├── MetricsCards.tsx    # Live statistics overview components
│   │   └── SourceChart.tsx     # Recharts PieChart for Agent 1 attribution
├── netlify.toml                # Netlify edge deployment configuration
├── next.config.ts              # Next.js compiler settings
├── tailwind.config.ts          # UI theme definitions
└── package.json                # Dependency management
```

---

## 6. Deployment Protocol

**1. Clone & Install**
```bash
git clone https://github.com/shriya7756/VayuSense.git
cd VayuSense
npm install
```

**2. Environment Configuration**
Create `.env.local` for local testing.
```env
COHERE_API_KEY=your_production_key_here
```

**3. Netlify Automated Deployment**
* VayuSense utilizes continuous integration via GitHub.
* Push changes to the `main` branch.
* Netlify executes `npm run build` using the Node `esbuild` bundler as defined in `netlify.toml`.
* Functions are automatically deployed to `/.netlify/functions/*`.

---
*Architected and Engineered for the Economic Times Hackathon.*
