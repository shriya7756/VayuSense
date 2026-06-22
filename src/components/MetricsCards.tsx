import { Wind, AlertTriangle, Droplets, ThermometerSun } from "lucide-react";

export default function MetricsCards() {
  const metrics = [
    { label: "City Avg AQI", value: "185", unit: "Moderate", icon: Wind, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "PM2.5 Level", value: "86.4", unit: "µg/m³", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Humidity", value: "42", unit: "%", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Temperature", value: "34", unit: "°C", icon: ThermometerSun, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((m, i) => (
        <div key={i} className="glass rounded-xl p-5 flex items-center gap-4 transition-transform hover:scale-[1.02] cursor-default">
          <div className={`p-3 rounded-full ${m.bg}`}>
            <m.icon className={`w-6 h-6 ${m.color}`} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">{m.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{m.value}</span>
              <span className="text-sm text-slate-300">{m.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
