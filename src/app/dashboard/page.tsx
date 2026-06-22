"use client";

import { useEffect, useState } from "react";
import AQIMap from "@/components/AQIMap";
import { Wind, AlertTriangle, Droplets, ThermometerSun, RefreshCw, ExternalLink } from "lucide-react";

interface Measurement {
  location: string;
  city: string;
  parameter: string;
  value: number;
  lastUpdated: string;
  coordinates?: { latitude: number; longitude: number };
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
}

function getAQIFromPM25(pm25: number): number {
  // Convert PM2.5 µg/m³ to AQI (India NAAQ standard)
  if (pm25 <= 30) return Math.round((50 / 30) * pm25);
  if (pm25 <= 60) return Math.round(50 + ((100 - 50) / (60 - 30)) * (pm25 - 30));
  if (pm25 <= 90) return Math.round(100 + ((200 - 100) / (90 - 60)) * (pm25 - 60));
  if (pm25 <= 120) return Math.round(200 + ((300 - 200) / (120 - 90)) * (pm25 - 90));
  if (pm25 <= 250) return Math.round(300 + ((400 - 300) / (250 - 120)) * (pm25 - 120));
  return Math.round(400 + ((500 - 400) / (380 - 250)) * Math.min(pm25 - 250, 130));
}

function getAQILabel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "Good", color: "text-emerald-400" };
  if (aqi <= 100) return { label: "Satisfactory", color: "text-yellow-400" };
  if (aqi <= 200) return { label: "Moderate", color: "text-orange-400" };
  if (aqi <= 300) return { label: "Poor", color: "text-red-400" };
  if (aqi <= 400) return { label: "Very Poor", color: "text-red-600" };
  return { label: "Severe", color: "text-purple-500" };
}

export default function Dashboard() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch real AQI data from OpenAQ for Hyderabad
      const aqRes = await fetch(
        "https://api.openaq.org/v2/latest?city=Hyderabad&country=IN&limit=20&parameter=pm25",
        { headers: { "accept": "application/json" } }
      );
      const aqData = await aqRes.json();
      if (aqData.results) {
        const flattened: Measurement[] = aqData.results.flatMap((r: any) =>
          r.measurements.map((m: any) => ({
            location: r.name,
            city: r.city || "Hyderabad",
            parameter: m.parameter,
            value: m.value,
            lastUpdated: m.lastUpdated,
            coordinates: r.coordinates,
          }))
        );
        setMeasurements(flattened.filter((m) => m.value > 0));
      }
    } catch (e) {
      console.error("OpenAQ fetch failed:", e);
    }

    try {
      // Fetch real weather from Open-Meteo (free, no API key)
      const wxRes = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=17.3850&longitude=78.4867&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&timezone=Asia%2FKolkata"
      );
      const wxData = await wxRes.json();
      if (wxData.current) {
        setWeather({
          temperature: wxData.current.temperature_2m,
          humidity: wxData.current.relative_humidity_2m,
          windSpeed: wxData.current.wind_speed_10m,
          windDirection: wxData.current.wind_direction_10m,
        });
      }
    } catch (e) {
      console.error("Weather fetch failed:", e);
    }

    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15 * 60 * 1000); // refresh every 15 min
    return () => clearInterval(interval);
  }, []);

  const avgPM25 = measurements.length
    ? Math.round(measurements.reduce((a, b) => a + b.value, 0) / measurements.length)
    : 0;
  const avgAQI = getAQIFromPM25(avgPM25);
  const aqiInfo = getAQILabel(avgAQI);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Live Air Quality Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            Source: OpenAQ · Open-Meteo · Updated {lastRefresh.toLocaleTimeString()}
            <a href="https://openaq.org" target="_blank" className="text-blue-400 hover:underline flex items-center gap-1">
              <ExternalLink size={12} /> OpenAQ
            </a>
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-orange-500/10">
              <Wind className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-sm text-slate-400">City Avg AQI</span>
          </div>
          <div className="text-3xl font-bold text-white">{loading ? "—" : avgAQI}</div>
          <div className={`text-sm font-medium mt-1 ${aqiInfo.color}`}>{loading ? "Loading..." : aqiInfo.label}</div>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-sm text-slate-400">Avg PM2.5</span>
          </div>
          <div className="text-3xl font-bold text-white">{loading ? "—" : avgPM25}</div>
          <div className="text-sm text-slate-400 mt-1">µg/m³ live</div>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-blue-500/10">
              <Droplets className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-slate-400">Humidity</span>
          </div>
          <div className="text-3xl font-bold text-white">{weather ? `${weather.humidity}%` : "—"}</div>
          <div className="text-sm text-slate-400 mt-1">Real-time</div>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-yellow-500/10">
              <ThermometerSun className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-sm text-slate-400">Temperature</span>
          </div>
          <div className="text-3xl font-bold text-white">{weather ? `${weather.temperature}°C` : "—"}</div>
          <div className="text-sm text-slate-400 mt-1">Wind: {weather ? `${weather.windSpeed} km/h` : "—"}</div>
        </div>
      </div>

      {/* Map + Station Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px]">
          <AQIMap liveData={measurements} />
        </div>

        <div className="glass rounded-xl p-5 overflow-hidden">
          <h3 className="font-semibold text-white mb-4">Live Station Readings</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : measurements.length === 0 ? (
            <p className="text-slate-400 text-sm">No live data available. OpenAQ may be temporarily unavailable.</p>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[440px] pr-1">
              {measurements.map((m, i) => {
                const aqi = getAQIFromPM25(m.value);
                const info = getAQILabel(aqi);
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white truncate">{m.location}</div>
                      <div className="text-xs text-slate-500">PM2.5: {m.value.toFixed(1)} µg/m³</div>
                    </div>
                    <div className="text-right ml-3">
                      <div className={`text-lg font-bold ${info.color}`}>{aqi}</div>
                      <div className={`text-xs ${info.color}`}>{info.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
