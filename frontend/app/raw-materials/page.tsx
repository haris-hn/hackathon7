'use client';
import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import {
  useGetRawMaterialsQuery,
  useCreateRawMaterialMutation,
  useUpdateRawMaterialMutation,
  useDeleteRawMaterialMutation,
} from '@/lib/api';

const UNITS = ['g', 'ml', 'pcs', 'kg', 'L'];

const emptyForm = { name: '', unit: 'g', quantity: 0, minStockAlert: 0, costPerUnit: 0 };

export default function RawMaterialsPage() {
  const { data: materials = [], isLoading } = useGetRawMaterialsQuery();
  const [createMaterial] = useCreateRawMaterialMutation();
  const [updateMaterial] = useUpdateRawMaterialMutation();
  const [deleteMaterial] = useDeleteRawMaterialMutation();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleOpen = (mat?: any) => {
    if (mat) {
      setEditId(mat._id);
      setForm({
        name: mat.name,
        unit: mat.unit,
        quantity: mat.quantity,
        minStockAlert: mat.minStockAlert,
        costPerUnit: mat.costPerUnit,
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (editId) {
      await updateMaterial({ id: editId, data: form });
    } else {
      await createMaterial(form);
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this raw material?')) {
      await deleteMaterial(id);
    }
  };

  return (
    <AppLayout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="white" sx={{ mb: 0.5 }}>
              Raw Materials
            </Typography>
            <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
              Manage your inventory and stock levels
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
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
            Add Material
          </Button>
        </Box>

        {/* Low Stock Alert */}
        {materials.filter((m: any) => m.quantity <= m.minStockAlert && m.minStockAlert > 0).length > 0 && (
          <Card sx={{ 
            bgcolor: 'rgba(255, 181, 114, 0.1)', 
            border: '1px solid rgba(255, 181, 114, 0.2)', 
            mb: 3,
            borderRadius: 3
          }}>
            <CardContent sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <WarningIcon sx={{ color: '#FFB572' }} />
                <Typography variant="body2" sx={{ color: '#FFB572', fontWeight: 600 }}>
                  {materials.filter((m: any) => m.quantity <= m.minStockAlert && m.minStockAlert > 0).length} materials are running low on stock
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        <Card sx={{ bgcolor: '#1F1D2B', borderRadius: 4, border: '1px solid #393C49' }}>
          <CardContent sx={{ p: 0 }}>
            {isLoading ? (
              <Box display="flex" justifyContent="center" p={8}>
                <CircularProgress sx={{ color: '#EA7C69' }} />
              </Box>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 700 }}>
                <TableHead sx={{ bgcolor: '#1F1D2B' }}>
                  <TableRow>
                    {['Item Name', 'Unit', 'Current Stock', 'Min Alert', 'Cost/Unit', 'Status', 'Actions'].map((h) => (
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
                  {materials.map((mat: any) => {
                    const isLow = mat.minStockAlert > 0 && mat.quantity <= mat.minStockAlert;
                    return (
                      <TableRow key={mat._id} sx={{ '&:hover': { bgcolor: 'rgba(234, 124, 105, 0.02)' } }}>
                        <TableCell sx={{ color: 'white', borderColor: '#393C49', py: 2.5, fontWeight: 500 }}>
                          {mat.name}
                        </TableCell>
                        <TableCell sx={{ color: '#ABBBC2', borderColor: '#393C49' }}>
                          {mat.unit}
                        </TableCell>
                        <TableCell sx={{ color: 'white', borderColor: '#393C49', fontWeight: 700 }}>
                          {mat.quantity.toLocaleString()} {mat.unit}
                        </TableCell>
                        <TableCell sx={{ color: '#ABBBC2', borderColor: '#393C49' }}>
                          {mat.minStockAlert} {mat.unit}
                        </TableCell>
                        <TableCell sx={{ color: '#ABBBC2', borderColor: '#393C49' }}>
                          ${mat.costPerUnit.toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ borderColor: '#393C49' }}>
                          <Chip
                            label={isLow ? 'Low Stock' : 'In Stock'}
                            size="small"
                            sx={{
                              bgcolor: isLow ? 'rgba(255, 124, 163, 0.1)' : 'rgba(80, 209, 170, 0.1)',
                              color: isLow ? '#FF7CA3' : '#50D1AA',
                              fontWeight: 700,
                              fontSize: 12,
                              borderRadius: 1.5,
                              px: 1
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderColor: '#393C49' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpen(mat)}
                            sx={{ 
                              color: '#EA7C69', 
                              mr: 1, 
                              bgcolor: 'rgba(234, 124, 105, 0.1)',
                              '&:hover': { bgcolor: 'rgba(234, 124, 105, 0.2)' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(mat._id)}
                            sx={{ 
                              color: '#FF7CA3',
                              bgcolor: 'rgba(255, 124, 163, 0.1)',
                              '&:hover': { bgcolor: 'rgba(255, 124, 163, 0.2)' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                </Table>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#1F1D2B', borderRadius: 4, backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, p: 3, borderBottom: '1px solid #393C49' }}>
          {editId ? 'Edit Raw Material' : 'Add New Material'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Material Name</Typography>
              <TextField
                fullWidth
                placeholder="e.g. Tomato, Olive Oil"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                inputProps={{ style: { color: 'white' } }}
              />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Unit</Typography>
                <TextField
                  select
                  fullWidth
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                  SelectProps={{ style: { color: 'white' } }}
                >
                  {UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Cost Per Unit ($)</Typography>
                <TextField
                  type="number"
                  fullWidth
                  value={form.costPerUnit}
                  onChange={(e) => setForm({ ...form, costPerUnit: Number(e.target.value) })}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                  inputProps={{ style: { color: 'white' } }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Current Quantity</Typography>
                <TextField
                  type="number"
                  fullWidth
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                  inputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Min Stock Alert</Typography>
                <TextField
                  type="number"
                  fullWidth
                  value={form.minStockAlert}
                  onChange={(e) => setForm({ ...form, minStockAlert: Number(e.target.value) })}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                  inputProps={{ style: { color: 'white' } }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, borderTop: '1px solid #393C49' }}>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            sx={{ borderColor: '#393C49', color: 'white', borderRadius: 2, px: 3, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ 
              bgcolor: '#EA7C69', 
              '&:hover': { bgcolor: '#d4623b' },
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            {editId ? 'Save Changes' : 'Add Material'}
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}
