'use client';
import AppLayout from '@/components/AppLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  Completed: '#50D1AA',
  Preparing: '#9290FE',
  Pending: '#FFB572',
  Cancelled: '#FF7CA3',
};

const STATUSES = ['Pending', 'Preparing', 'Completed', 'Cancelled'];

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useGetOrdersQuery(undefined, {
    pollingInterval: 10000,
  });
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  return (
    <AppLayout>
      <Box>
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} color="white" sx={{ mb: 0.5 }}>
            Order History
          </Typography>
          <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
            View and manage all customer orders
          </Typography>
        </Box>

        <Card sx={{ bgcolor: '#1F1D2B', borderRadius: 4, border: '1px solid #393C49' }}>
          <CardContent sx={{ p: 0 }}>
            {isLoading ? (
              <Box display="flex" justifyContent="center" p={8}>
                <CircularProgress sx={{ color: '#EA7C69' }} />
              </Box>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 900 }}>
                <TableHead sx={{ bgcolor: '#1F1D2B' }}>
                  <TableRow>
                    {['Order #', 'Customer', 'Items', 'Total', 'Type', 'Status', 'Date'].map((h) => (
                      <TableCell
                        key={h}
                        sx={{ 
                          color: 'white', 
                          borderColor: '#393C49', 
                          fontWeight: 700, 
                          fontSize: 14,
                          py: 3
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order._id} sx={{ '&:hover': { bgcolor: 'rgba(234, 124, 105, 0.02)' } }}>
                      <TableCell sx={{ color: '#EA7C69', borderColor: '#393C49', fontWeight: 700, fontSize: 13 }}>
                        #{order.orderNumber}
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderColor: '#393C49', py: 2.5 }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(234, 124, 105, 0.2)', color: '#EA7C69', fontWeight: 700, fontSize: 13 }}>
                            {(order.customerName || 'C')[0].toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>{order.customerName || 'Walk-in'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#ABBBC2', borderColor: '#393C49', fontSize: 13 }}>
                        <Typography variant="caption" sx={{ display: 'block', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.items?.map((i: any) => i.productName).join(', ')}
                        </Typography>
                        <Typography variant="caption" color="primary" sx={{ fontSize: 10, fontWeight: 700 }}>
                          {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderColor: '#393C49', fontWeight: 700 }}>
                        ${order.total?.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: '#ABBBC2', borderColor: '#393C49', fontSize: 13 }}>
                        {order.orderType}
                      </TableCell>
                      <TableCell sx={{ borderColor: '#393C49' }}>
                        <Select
                          value={order.status}
                          size="small"
                          variant="outlined"
                          onChange={(e) => updateOrderStatus({ id: order._id, status: e.target.value })}
                          sx={{
                            color: STATUS_COLORS[order.status],
                            fontWeight: 700,
                            fontSize: 12,
                            height: 32,
                            borderRadius: 1.5,
                            minWidth: 120,
                            bgcolor: STATUS_COLORS[order.status] + '15',
                            '.MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                            '.MuiSvgIcon-root': { color: STATUS_COLORS[order.status], fontSize: 18 },
                          }}
                        >
                          {STATUSES.map((s) => (
                            <MenuItem key={s} value={s} sx={{ fontSize: 12, fontWeight: 600 }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: STATUS_COLORS[s] }} />
                                {s}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell sx={{ color: '#ABBBC2', borderColor: '#393C49', fontSize: 12 }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
