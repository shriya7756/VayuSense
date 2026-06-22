"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HYDERABAD_CENTER: [number, number] = [17.3850, 78.4867];

const mockSensors = [
  { id: 1, name: "Sanathnagar (Industrial)", lat: 17.456, lng: 78.444, aqi: 210, pm25: 145 },
  { id: 2, name: "Zoo Park (Green Zone)", lat: 17.350, lng: 78.452, aqi: 85, pm25: 35 },
  { id: 3, name: "Madhapur (IT Corridor)", lat: 17.448, lng: 78.390, aqi: 155, pm25: 89 },
  { id: 4, name: "Bollaram (Industrial)", lat: 17.550, lng: 78.360, aqi: 280, pm25: 190 },
  { id: 5, name: "Charminar (High Traffic)", lat: 17.361, lng: 78.474, aqi: 195, pm25: 120 }
];

const getMarkerColor = (aqi: number) => {
  if (aqi <= 50) return "#10b981"; // Good (Green)
  if (aqi <= 100) return "#fbbf24"; // Moderate (Yellow)
  if (aqi <= 200) return "#f97316"; // Unhealthy for Sensitive (Orange)
  if (aqi <= 300) return "#ef4444"; // Unhealthy (Red)
  return "#8b5cf6"; // Hazardous (Purple)
};

export default function Map() {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden glass">
      <MapContainer 
        center={HYDERABAD_CENTER} 
        zoom={11} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {mockSensors.map((sensor) => (
          <CircleMarker
            key={sensor.id}
            center={[sensor.lat, sensor.lng]}
            radius={12}
            pathOptions={{ 
              color: getMarkerColor(sensor.aqi),
              fillColor: getMarkerColor(sensor.aqi),
              fillOpacity: 0.7,
              weight: 2
            }}
          >
            <Popup className="glass text-slate-800">
              <div className="font-semibold text-base mb-1">{sensor.name}</div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-600">AQI:</span>
                <span className="font-bold text-lg" style={{ color: getMarkerColor(sensor.aqi) }}>{sensor.aqi}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">PM2.5:</span>
                <span className="font-semibold">{sensor.pm25} µg/m³</span>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
