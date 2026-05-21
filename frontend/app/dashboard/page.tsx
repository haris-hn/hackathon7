'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { useGetDashboardStatsQuery } from '@/lib/api';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const OrderPieChart = dynamic(() => import('./OrderPieChart'), { ssr: false });

const STATUS_COLORS: Record<string, string> = {
  Completed: '#50D1AA',
  Preparing: '#9290FE',
  Pending: '#FFB572',
  Cancelled: '#FF7CA3',
};

function DashboardContent() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress sx={{ color: '#E8734A' }} />
        </Box>
      </AppLayout>
    );
  }

  const pieData = stats
    ? [
        { name: 'Dine In', value: stats.orderTypeBreakdown?.['Dine In'] || 0 },
        { name: 'To Go', value: stats.orderTypeBreakdown?.['To Go'] || 0 },
        { name: 'Delivery', value: stats.orderTypeBreakdown?.['Delivery'] || 0 },
      ]
    : [];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
  });

  const revenue = (stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', fontSize: { xs: 22, sm: 28 } }}>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{today}</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <StatCard 
                  label="Total Revenue" 
                  value={`$${revenue}`} 
                  change="+32.40%" 
                  positive 
                  icon={<AttachMoneyIcon sx={{ color: '#9290FE' }} />} 
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard 
                  label="Total Dish Ordered" 
                  value={(stats?.totalOrders || 0).toLocaleString()} 
                  change="-12.40%" 
                  positive={false} 
                  icon={<AssignmentIcon sx={{ color: '#FFB572' }} />} 
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard 
                  label="Total Customer" 
                  value={(stats?.totalCustomers || 0).toLocaleString()} 
                  change="+2.40%" 
                  positive 
                  icon={<PeopleIcon sx={{ color: '#50D1AA' }} />} 
                />
              </Grid>
            </Grid>

            <Card sx={{ bgcolor: '#1F1D2B', borderRadius: 2, border: '1px solid #393C49' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', fontSize: 20 }}>Order Report</Typography>
                  <Button 
                    startIcon={<FilterListIcon />} 
                    variant="outlined" 
                    size="small" 
                    sx={{ 
                      borderColor: '#393C49', 
                      color: 'white', 
                      textTransform: 'none',
                      bgcolor: '#1F1D2B',
                      borderRadius: 1.5,
                      px: 2,
                      '&:hover': { bgcolor: '#252836', borderColor: '#ABBBC2' }
                    }}
                  >
                    Filter Order
                  </Button>
                </Box>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Customer', 'Menu', 'Total Payment', 'Status'].map((h) => (
                          <th key={h} style={{ textAlign: 'left', padding: '0 12px 16px 12px', color: 'white', fontSize: 14, fontWeight: 600, borderBottom: '1px solid #393C49' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(stats?.recentOrders || []).map((order: any) => (
                        <tr key={order._id}>
                          <td style={{ padding: '16px 12px', color: '#E0E6E9', fontSize: 14 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: '#393C49', fontSize: 13 }}>
                                {(order.customerName || 'C')[0].toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" sx={{ color: '#E0E6E9', fontSize: 14 }}>
                                {order.customerName || 'Customer'}
                              </Typography>
                            </Box>
                          </td>
                          <td style={{ padding: '16px 12px', color: '#E0E6E9', fontSize: 14 }}>
                             <Typography variant="body2" sx={{ color: '#E0E6E9', fontSize: 14, maxWidth: 180, noWrap: true }}>
                                {order.items?.[0]?.productName || '-'}
                             </Typography>
                          </td>
                          <td style={{ padding: '16px 12px', color: '#E0E6E9', fontSize: 14 }}>
                             ${order.total?.toFixed(2)}
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            <Box sx={{ 
                              display: 'inline-flex', 
                              px: 1.5, py: 0.5, 
                              borderRadius: 10, 
                              bgcolor: STATUS_COLORS[order.status] + '20',
                              color: STATUS_COLORS[order.status],
                              fontSize: 12,
                              fontWeight: 500
                            }}>
                              {order.status}
                            </Box>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#1F1D2B', borderRadius: 2, border: '1px solid #393C49', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', fontSize: 20 }}>Most Ordered</Typography>
                  <Button 
                    endIcon={<KeyboardArrowDownIcon />} 
                    variant="outlined" 
                    size="small" 
                    sx={{ 
                      borderColor: '#393C49', 
                      color: 'white', 
                      fontSize: 14, 
                      textTransform: 'none',
                      borderRadius: 1.5,
                      px: 2
                    }}
                  >
                    Today
                  </Button>
                </Box>
                <Divider sx={{ borderColor: '#393C49', mb: 3 }} />
                {(stats?.mostSoldProducts || []).map((p: any, i: number) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                    <Avatar
                      src={p.imageUrl || undefined}
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        bgcolor: '#393C49', 
                        borderRadius: '50%'
                      }}
                    >
                      {!p.imageUrl && '🍜'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#E0E6E9', fontSize: 14, mb: 0.5 }}>{p.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#ABBBC2', fontSize: 12 }}>{p.count} dishes ordered</Typography>
                    </Box>
                  </Box>
                ))}
                <Button 
                  fullWidth 
                  variant="outlined" 
                  sx={{ 
                    mt: 1, 
                    borderColor: '#EA7C69', 
                    color: '#EA7C69', 
                    textTransform: 'none', 
                    fontWeight: 600,
                    py: 1.2,
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'rgba(234, 124, 105, 0.1)', borderColor: '#EA7C69' }
                  }}
                >
                  View All
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#1F1D2B', borderRadius: 2, border: '1px solid #393C49' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', fontSize: 20 }}>Most Type of Order</Typography>
                  <Button 
                    endIcon={<KeyboardArrowDownIcon />} 
                    variant="outlined" 
                    size="small" 
                    sx={{ 
                      borderColor: '#393C49', 
                      color: 'white', 
                      fontSize: 14, 
                      textTransform: 'none',
                      borderRadius: 1.5,
                      px: 2
                    }}
                  >
                    Today
                  </Button>
                </Box>
                <Divider sx={{ borderColor: '#393C49', mb: 3 }} />
                <OrderPieChart pieData={pieData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}

function StatCard({ label, value, change, positive, icon }: { label: string; value: string; change: string; positive: boolean; icon: React.ReactNode }) {
  return (
    <Card sx={{ bgcolor: '#1F1D2B', borderRadius: 2, border: '1px solid #393C49' }}>
      <CardContent sx={{ p: '16px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box sx={{ 
            width: 38, height: 38, borderRadius: 1.5, 
            bgcolor: '#252836', display: 'flex', 
            alignItems: 'center', justifyContent: 'center'
          }}>
            {icon}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: positive ? '#50D1AA' : '#FF7CA3', fontWeight: 600, fontSize: 12 }}>
              {change}
            </Typography>
            <Box sx={{ 
              width: 18, height: 18, borderRadius: '50%', 
              bgcolor: positive ? 'rgba(80, 209, 170, 0.2)' : 'rgba(255, 124, 163, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {positive ? <TrendingUpIcon sx={{ fontSize: 12, color: '#50D1AA' }} /> : <TrendingDownIcon sx={{ fontSize: 12, color: '#FF7CA3' }} />}
            </Box>
          </Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 0.5, fontSize: 24 }}>{value}</Typography>
        <Typography variant="body2" sx={{ color: '#ABBBC2', fontSize: 14 }}>{label}</Typography>
      </CardContent>
    </Card>
  );
}
