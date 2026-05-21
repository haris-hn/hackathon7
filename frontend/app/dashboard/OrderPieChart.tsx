'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ORDER_TYPE_COLORS = ['#FF7CA3', '#FFB572', '#65B0F6'];

interface Props {
  pieData: { name: string; value: number }[];
}

export default function OrderPieChart({ pieData }: Props) {
  // Ensure we have exactly 3 data points or handle accordingly
  const data = pieData.length > 0 ? pieData : [
    { name: 'Dine In', value: 0 },
    { name: 'To Go', value: 0 },
    { name: 'Delivery', value: 0 },
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ width: 180, height: 180, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Outer Ring */}
            <Pie
              data={[data[0]]}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={85}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              strokeWidth={0}
              cornerRadius={10}
            >
               <Cell fill={ORDER_TYPE_COLORS[0]} />
            </Pie>
            {/* Middle Ring */}
            <Pie
              data={[data[1]]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={70}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              strokeWidth={0}
              cornerRadius={10}
            >
               <Cell fill={ORDER_TYPE_COLORS[1]} />
            </Pie>
            {/* Inner Ring */}
            <Pie
              data={[data[2]]}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={55}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              strokeWidth={0}
              cornerRadius={10}
            >
               <Cell fill={ORDER_TYPE_COLORS[2]} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {data.map((entry, i) => (
          <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: ORDER_TYPE_COLORS[i] }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{entry.name}</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#ABBBC2', fontSize: 12, ml: 2 }}>{entry.value} customers</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
