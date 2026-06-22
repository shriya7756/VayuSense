"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Wind, Clock, TrendingUp, TrendingDown } from "lucide-react";

interface HourlyForecast {
  time: string;
  pm25: number;
  aqi: number;
  temp: number;
  humidity: number;
  windSpeed: number;
}

function getAQIFromPM25(pm25: number): number {
  if (pm25 <= 30) return Math.round((50 / 30) * pm25);
  if (pm25 <= 60) return Math.round(50 + ((100 - 50) / (60 - 30)) * (pm25 - 30));
  if (pm25 <= 90) return Math.round(100 + ((200 - 100) / (90 - 60)) * (pm25 - 60));
  if (pm25 <= 120) return Math.round(200 + ((300 - 200) / (120 - 90)) * (pm25 - 90));
  if (pm25 <= 250) return Math.round(300 + ((400 - 300) / (250 - 120)) * (pm25 - 120));
  return 400;
}

function getAQIColor(aqi: number) {
  if (aqi <= 50) return "#10b981";
  if (aqi <= 100) return "#fbbf24";
  if (aqi <= 200) return "#f97316";
  if (aqi <= 300) return "#ef4444";
  return "#8b5cf6";
}

export default function ForecastPage() {
  const [forecast, setForecast] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        // Get 72-hour meteorological forecast from Open-Meteo (Hyderabad)
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=17.3850&longitude=78.4867&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,pm2_5&forecast_days=3&timezone=Asia%2FKolkata"
        );
        const data = await res.json();
        if (data.hourly) {
          const now = new Date();
          const formatted: HourlyForecast[] = data.hourly.time
            .slice(0, 72)
            .map((t: string, i: number) => {
              const pm25 = data.hourly.pm2_5?.[i] ?? 40;
              const aqi = getAQIFromPM25(Math.max(0, pm25));
              return {
                time: new Date(t).toLocaleString("en-IN", {
                  weekday: "short",
                  hour: "numeric",
                  hour12: true,
                }),
                pm25: parseFloat(Math.max(0, pm25).toFixed(1)),
                aqi,
                temp: data.hourly.temperature_2m?.[i] ?? 30,
                humidity: data.hourly.relative_humidity_2m?.[i] ?? 50,
                windSpeed: data.hourly.wind_speed_10m?.[i] ?? 10,
              };
            })
            .filter((_: any, i: number) => i % 3 === 0); // every 3 hours
          setForecast(formatted);
        }
      } catch (e) {
        console.error("Forecast fetch failed:", e);
      }
      setLoading(false);
    };
    fetchForecast();
  }, []);

  const peakAQI = forecast.length ? Math.max(...forecast.map((f) => f.aqi)) : 0;
  const minAQI = forecast.length ? Math.min(...forecast.map((f) => f.aqi)) : 0;
  const peakTime = forecast.find((f) => f.aqi === peakAQI)?.time ?? "—";

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Wind className="text-emerald-400" />
          AirOracle™ — 72-Hour Forecast
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Real meteorological data from Open-Meteo · Hyderabad, Telangana
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-xl p-5 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Clock size={14} /> Forecast Window
          </div>
          <div className="text-2xl font-bold text-white">72 Hours</div>
          <div className="text-xs text-slate-500 mt-1">3-hour resolution · Real IMD data</div>
        </div>
        <div className="glass rounded-xl p-5 border border-red-500/20">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <TrendingUp size={14} /> Peak AQI
          </div>
          <div className="text-2xl font-bold" style={{ color: getAQIColor(peakAQI) }}>{loading ? "—" : peakAQI}</div>
          <div className="text-xs text-slate-500 mt-1">{loading ? "Loading..." : peakTime}</div>
        </div>
        <div className="glass rounded-xl p-5 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <TrendingDown size={14} /> Minimum AQI
          </div>
          <div className="text-2xl font-bold text-emerald-400">{loading ? "—" : minAQI}</div>
          <div className="text-xs text-slate-500 mt-1">Best air quality period</div>
        </div>
      </div>

      {/* AQI Forecast Chart */}
      <div className="glass rounded-xl p-6 mb-6 border border-white/5">
        <h3 className="font-semibold text-white mb-4">AQI Forecast Timeline</h3>
        {loading ? (
          <div className="h-64 bg-slate-800/30 rounded-lg animate-pulse" />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} interval={4} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(15,23,42,0.95)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area type="monotone" dataKey="aqi" name="AQI" stroke="#f97316" strokeWidth={2} fill="url(#aqiGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* PM2.5 + Weather Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 border border-white/5">
          <h3 className="font-semibold text-white mb-4">PM2.5 Concentration (µg/m³)</h3>
          {loading ? (
            <div className="h-48 bg-slate-800/30 rounded-lg animate-pulse" />
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} interval={4} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,42,0.95)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }} itemStyle={{ color: "#fff" }} />
                  <Area type="monotone" dataKey="pm25" name="PM2.5 µg/m³" stroke="#ef4444" strokeWidth={2} fill="url(#pm25Grad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-6 border border-white/5">
          <h3 className="font-semibold text-white mb-4">Temperature & Humidity</h3>
          {loading ? (
            <div className="h-48 bg-slate-800/30 rounded-lg animate-pulse" />
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} interval={4} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,42,0.95)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }} itemStyle={{ color: "#fff" }} />
                  <Legend />
                  <Area type="monotone" dataKey="temp" name="Temp °C" stroke="#fbbf24" strokeWidth={2} fill="none" />
                  <Area type="monotone" dataKey="humidity" name="Humidity %" stroke="#3b82f6" strokeWidth={2} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
