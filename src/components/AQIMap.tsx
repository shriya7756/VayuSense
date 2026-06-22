"use client";

import dynamic from "next/dynamic";

interface Measurement {
  location: string;
  value: number;
  coordinates?: { latitude: number; longitude: number };
}

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-xl overflow-hidden glass flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Hyderabad Map...</p>
      </div>
    </div>
  ),
});

interface AQIMapProps {
  liveData?: Measurement[];
}

export default function AQIMap({ liveData }: AQIMapProps) {
  return <Map liveData={liveData} />;
}
