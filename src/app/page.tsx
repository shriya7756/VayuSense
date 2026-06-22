import AQIMap from "@/components/AQIMap";
import MetricsCards from "@/components/MetricsCards";
import SourceChart from "@/components/SourceChart";
import ForecastChart from "@/components/ForecastChart";
import CitizenSaathiChat from "@/components/CitizenSaathiChat";
import { Activity, ShieldAlert, Navigation } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-400" />
            VayuSense
          </h1>
          <p className="text-slate-400 mt-1">Hyperlocal Urban Air Intelligence — Hyderabad</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-full glass text-sm font-medium border border-red-500/30 text-red-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            3 Anomalies Detected
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <MetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[500px] relative">
            <AQIMap />
            <div className="absolute top-4 left-4 z-[1000] glass px-4 py-2 rounded-lg pointer-events-none">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Navigation size={16} className="text-blue-400"/>
                Live CPCB Sensor Network
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Attribution (Agent 1) */}
            <div className="glass p-5 rounded-xl border border-white/5">
              <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                PollutionBlame™ Attribution
              </h3>
              <p className="text-xs text-slate-400 mb-4">Agent 1: Real-time source analysis</p>
              <SourceChart />
            </div>

            {/* Forecast (Agent 2) */}
            <div className="glass p-5 rounded-xl border border-white/5">
              <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                AirOracle™ 24hr Forecast
              </h3>
              <p className="text-xs text-slate-400 mb-4">Agent 2: LSTM + Transformer Prediction</p>
              <ForecastChart />
            </div>
          </div>
        </div>

        {/* Right Column: Copilot & CitizenSaathi */}
        <div className="space-y-6">
          {/* Enforcement Copilot (Agent 3) */}
          <div className="glass p-5 rounded-xl border border-red-500/20 bg-gradient-to-b from-red-950/20 to-transparent">
            <h3 className="font-semibold text-lg mb-1 flex items-center gap-2 text-red-400">
              <ShieldAlert size={20} />
              EnforcementCopilot™
            </h3>
            <p className="text-xs text-slate-400 mb-4">Agent 3: Priority Interventions</p>
            
            <div className="space-y-3">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/10">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 block">Priority 1</span>
                <p className="text-sm text-slate-300">
                  Deploy inspectors to <span className="text-white font-semibold">Sanathnagar Ind. Area</span>. 
                  Evidence: 40% PM10 spike correlated with 3 active construction permits violating dust suppression norms.
                </p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-orange-500/10">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 block">Priority 2</span>
                <p className="text-sm text-slate-300">
                  Traffic diversion recommended at <span className="text-white font-semibold">Charminar Zone</span>.
                  Prediction: Gridlock will cause AQI to cross 250 (Hazardous) between 18:00 and 20:00.
                </p>
              </div>
            </div>
          </div>

          {/* CitizenSaathi Bot */}
          <CitizenSaathiChat />
        </div>
      </div>
    </div>
  );
}
