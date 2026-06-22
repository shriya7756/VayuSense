"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HYDERABAD_CENTER: [number, number] = [17.3850, 78.4867];

const FALLBACK_SENSORS = [
  { location: "Sanathnagar (Industrial)", lat: 17.456, lng: 78.444, value: 90 },
  { location: "Zoo Park (Green Zone)", lat: 17.350, lng: 78.452, value: 22 },
  { location: "Madhapur (IT Corridor)", lat: 17.448, lng: 78.390, value: 55 },
  { location: "Bollaram (Industrial)", lat: 17.550, lng: 78.360, value: 130 },
  { location: "Charminar (Traffic Hub)", lat: 17.361, lng: 78.474, value: 85 },
];

interface Measurement {
  location: string;
  value: number;
  coordinates?: { latitude: number; longitude: number };
}

interface MapProps {
  liveData?: Measurement[];
}

function getAQIFromPM25(pm25: number): number {
  if (pm25 <= 30) return Math.round((50 / 30) * pm25);
  if (pm25 <= 60) return Math.round(50 + ((100 - 50) / (60 - 30)) * (pm25 - 30));
  if (pm25 <= 90) return Math.round(100 + ((200 - 100) / (90 - 60)) * (pm25 - 60));
  if (pm25 <= 120) return Math.round(200 + ((300 - 200) / (120 - 90)) * (pm25 - 90));
  return Math.round(300 + Math.min((pm25 - 120) * 0.8, 200));
}

const getColor = (aqi: number) => {
  if (aqi <= 50) return "#10b981";
  if (aqi <= 100) return "#fbbf24";
  if (aqi <= 200) return "#f97316";
  if (aqi <= 300) return "#ef4444";
  return "#8b5cf6";
};

export default function Map({ liveData }: MapProps) {
  const hasLive = liveData && liveData.filter((m) => m.coordinates).length > 0;

  const markers = hasLive
    ? liveData!
        .filter((m) => m.coordinates && m.value > 0)
        .map((m) => ({
          location: m.location,
          lat: m.coordinates!.latitude,
          lng: m.coordinates!.longitude,
          value: m.value,
        }))
    : FALLBACK_SENSORS;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <MapContainer center={HYDERABAD_CENTER} zoom={11} style={{ height: "100%", width: "100%" }} zoomControl={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {markers.map((sensor, i) => {
          const aqi = getAQIFromPM25(sensor.value);
          return (
            <CircleMarker
              key={i}
              center={[sensor.lat, sensor.lng]}
              radius={14}
              pathOptions={{ color: getColor(aqi), fillColor: getColor(aqi), fillOpacity: 0.75, weight: 2 }}
            >
              <Popup>
                <div style={{ fontFamily: "sans-serif", minWidth: 160 }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{sensor.location}</p>
                  <p style={{ color: getColor(aqi), fontWeight: 700, fontSize: 20 }}>AQI {aqi}</p>
                  <p style={{ color: "#555", fontSize: 12 }}>PM2.5: {sensor.value.toFixed(1)} µg/m³</p>
                  {hasLive && <p style={{ color: "#888", fontSize: 11, marginTop: 4 }}>Source: OpenAQ Live</p>}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
