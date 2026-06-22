import Link from "next/link";
import { Activity, Wind, BarChart2, ShieldAlert, MessageSquare, ArrowRight, Globe } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "PollutionBlame™",
    description: "Real-time source attribution using live CPCB sensor readings, satellite thermal data, and traffic density maps.",
    href: "/attribution",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Wind,
    title: "AirOracle™",
    description: "24-72 hour hyperlocal AQI forecasting at 1km grid resolution using meteorological models and historical trends.",
    href: "/forecast",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: ShieldAlert,
    title: "EnforcementCopilot™",
    description: "RAG-powered enforcement directives cross-referencing pollution anomalies with CPCB registered polluter registries.",
    href: "/enforcement",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    icon: MessageSquare,
    title: "CitizenSaathi",
    description: "Multilingual conversational AI interface providing hyperlocal health advisories in Telugu, Hindi, and English.",
    href: "/citizen",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const stats = [
  { label: "CPCB Stations Monitored", value: "900+", sub: "Across India" },
  { label: "Cities Connected", value: "132", sub: "Live telemetry" },
  { label: "Data Refresh Rate", value: "15 min", sub: "Real-time pipeline" },
  { label: "Reduction in Response Time", value: "74%", sub: "vs. manual review" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 md:px-16 py-24 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Globe size={14} />
            Live Data · Hyderabad, India
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            From Monitoring
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              to Action
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            VayuSense is India's first hyperlocal urban air quality intelligence platform — attributing pollution sources, forecasting migration, and generating enforcement directives in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              Open Live Dashboard <ArrowRight size={18} />
            </Link>
            <Link
              href="/citizen"
              className="flex items-center justify-center gap-2 px-6 py-3 glass text-white font-semibold rounded-xl transition-all hover:bg-white/10"
            >
              Ask CitizenSaathi <MessageSquare size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-[1200px] mx-auto px-6 pb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-sm font-semibold text-slate-300">{s.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section className="max-w-[1200px] mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Platform Intelligence Modules</h2>
        <p className="text-slate-400 text-center mb-10">Four specialized AI agents working in concert to close the data-to-action gap.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`glass rounded-2xl p-6 border ${f.border} hover:scale-[1.02] transition-transform group`}
            >
              <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                {f.title}
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
