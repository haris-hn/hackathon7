'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function RevenueChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data).map(([name, total]) => ({
    name,
    total,
  }));

  // If no data, show some placeholders for visual consistency
  const finalData = chartData.length > 0 ? chartData : [
    { name: 'Mon', total: 0 },
    { name: 'Tue', total: 0 },
    { name: 'Wed', total: 0 },
    { name: 'Thu', total: 0 },
    { name: 'Fri', total: 0 },
    { name: 'Sat', total: 0 },
    { name: 'Sun', total: 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={finalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3D4060" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1F1D2B', border: '1px solid #3D4060', borderRadius: '8px' }}
          itemStyle={{ color: '#E8734A' }}
          cursor={{ fill: 'rgba(232,115,74,0.05)' }}
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={32}>
          {finalData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#E8734A' : '#4a3229'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
