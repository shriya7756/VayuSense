"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '12:00', aqi: 150 },
  { time: '15:00', aqi: 180 },
  { time: '18:00', aqi: 220 },
  { time: '21:00', aqi: 240 },
  { time: '00:00', aqi: 190 },
  { time: '03:00', aqi: 160 },
  { time: '06:00', aqi: 140 },
  { time: '09:00', aqi: 175 },
  { time: '12:00', aqi: 155 },
];

export default function ForecastChart() {
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
          />
          <Area type="monotone" dataKey="aqi" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
