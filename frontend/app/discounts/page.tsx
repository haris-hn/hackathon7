'use client';
import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const MOCK_DISCOUNTS = [
  { id: '1', code: 'JAEGAR20', type: 'percentage', value: 20, description: '20% off on all orders', status: 'Active', expiry: '2026-12-31' },
  { id: '2', code: 'WELCOME10', type: 'amount', value: 10, description: '$10 off for new customers', status: 'Active', expiry: '2026-12-31' },
  { id: '3', code: 'LUNCH5', type: 'percentage', value: 5, description: '5% off on lunch menu', status: 'Inactive', expiry: '2024-05-01' },
];

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState(MOCK_DISCOUNTS);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All' ? discounts : discounts.filter(d => d.status === activeTab);

  return (
    <AppLayout>
      <Box sx={{ p: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="white" sx={{ mb: 0.5 }}>
              Discounts & Promotions
            </Typography>
            <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
              Create and manage promotional offers for your customers
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ 
              bgcolor: '#EA7C69', 
              '&:hover': { bgcolor: '#d4623b' },
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(234, 124, 105, 0.3)'
            }}
          >
            Create Discount
          </Button>
        </Box>

        {/* Tabs */}
        <Box display="flex" gap={4} mb={4} sx={{ borderBottom: '1px solid #393C49', pb: 0 }}>
          {['All', 'Active', 'Inactive'].map((tab) => (
            <Typography 
              key={tab} 
              variant="body2" 
              onClick={() => setActiveTab(tab)}
              sx={{ 
                cursor: 'pointer', 
                color: activeTab === tab ? '#EA7C69' : '#ABBBC2', 
                borderBottom: activeTab === tab ? '3px solid #EA7C69' : '3px solid transparent', 
                pb: 1.5, 
                fontWeight: 600,
                fontSize: 16
              }}>
              {tab}
            </Typography>
          ))}
        </Box>

        <Grid container spacing={3}>
          {filtered.map((discount) => (
            <Grid item xs={12} sm={6} md={4} key={discount.id}>
              <Card sx={{ 
                bgcolor: '#1F1D2B', 
                borderRadius: 4, 
                border: '1px solid #393C49',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-5px)', borderColor: '#EA7C69' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                    <Box sx={{ 
                      bgcolor: 'rgba(234, 124, 105, 0.1)', 
                      p: 1.5, borderRadius: 2,
                      color: '#EA7C69'
                    }}>
                      <LocalOfferIcon />
                    </Box>
                    <Chip 
                      label={discount.status} 
                      size="small"
                      sx={{ 
                        bgcolor: discount.status === 'Active' ? 'rgba(80, 209, 170, 0.1)' : 'rgba(255, 124, 163, 0.1)',
                        color: discount.status === 'Active' ? '#50D1AA' : '#FF7CA3',
                        fontWeight: 700,
                        borderRadius: 1.5
                      }}
                    />
                  </Box>

                  <Typography variant="h5" fontWeight={700} color="white" mb={1}>
                    {discount.code}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 3, height: 40, overflow: 'hidden' }}>
                    {discount.description}
                  </Typography>

                  <Box sx={{ bgcolor: '#252836', p: 2, borderRadius: 2, mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" sx={{ color: '#ABBBC2' }}>Value</Typography>
                      <Typography variant="body2" fontWeight={700} color="white">
                        {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: '#ABBBC2' }}>Expires</Typography>
                      <Typography variant="body2" fontWeight={700} color="white">{discount.expiry}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" gap={1.5}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<EditIcon sx={{ fontSize: 18 }} />}
                      sx={{ borderColor: '#393C49', color: 'white', textTransform: 'none', borderRadius: 2 }}
                    >
                      Edit
                    </Button>
                    <IconButton sx={{ bgcolor: 'rgba(255, 124, 163, 0.1)', color: '#FF7CA3', borderRadius: 2 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Empty State / Add Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Box 
              onClick={() => setOpen(true)}
              sx={{ 
                height: '100%',
                minHeight: 300,
                border: '1px dashed #EA7C69',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { bgcolor: 'rgba(234, 124, 105, 0.05)' }
              }}
            >
              <AddIcon sx={{ color: '#EA7C69', fontSize: 40, mb: 2 }} />
              <Typography variant="body1" fontWeight={600} color="#EA7C69">
                Add New Promotion
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Create Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#1F1D2B', borderRadius: 4, backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, p: 3, borderBottom: '1px solid #393C49' }}>
          Create New Promotion
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Discount Code</Typography>
              <TextField 
                fullWidth 
                placeholder="e.g. SUMMER25" 
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                inputProps={{ style: { color: 'white' } }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Description</Typography>
              <TextField 
                fullWidth 
                multiline
                rows={2}
                placeholder="What is this discount for?" 
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                inputProps={{ style: { color: 'white' } }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Type</Typography>
                <TextField 
                  select
                  fullWidth 
                  defaultValue="percentage"
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                  SelectProps={{ style: { color: 'white' } }}
                >
                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                  <MenuItem value="amount">Fixed Amount ($)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Value</Typography>
                <TextField 
                  fullWidth 
                  type="number"
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                  inputProps={{ style: { color: 'white' } }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, borderTop: '1px solid #393C49' }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderColor: '#393C49', color: 'white', borderRadius: 2, px: 3, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" sx={{ bgcolor: '#EA7C69', '&:hover': { bgcolor: '#d4623b' }, borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>
            Create Promotion
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}
