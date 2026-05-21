'use client';
import { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PaletteIcon from '@mui/icons-material/Palette';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GridViewIcon from '@mui/icons-material/GridView';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetRawMaterialsQuery,
} from '@/lib/api';

const CATEGORIES = ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'];
const emptyForm = {
  name: '',
  price: 0,
  category: 'Hot Dishes',
  imageUrl: '',
  recipe: [] as { rawMaterialId: string; quantity: number }[],
};

function ProductsManagementContent() {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const { data: rawMaterials = [] } = useGetRawMaterialsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [activeCategory, setActiveCategory] = useState('Hot Dishes');
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, { method: 'POST', body: formData });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Upload failed with status ${res.status}`);
      }
      const data = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err: any) { 
      console.error('Upload catch error:', err);
      alert(`Image upload failed: ${err.message}`); 
    }
    finally { setUploading(false); }
  };

  const filtered = products.filter((p: any) => p.category === activeCategory);

  const handleOpen = (product?: any) => {
    if (product) {
      setEditId(product._id);
      setForm({ name: product.name, price: product.price, category: product.category, imageUrl: product.imageUrl || '', recipe: product.recipe || [] });
    } else {
      setEditId(null);
      setForm({ ...emptyForm, category: activeCategory });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    // Filter out ingredients that don't have a rawMaterialId selected
    const cleanedRecipe = form.recipe.filter(r => r.rawMaterialId !== '');
    const dataToSave = { ...form, recipe: cleanedRecipe };

    if (editId) await updateProduct({ id: editId, data: dataToSave });
    else await createProduct(dataToSave);
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) await deleteProduct(id);
  };

  const addIngredient = () => setForm({ ...form, recipe: [...form.recipe, { rawMaterialId: '', quantity: 0 }] });
  const updateIngredient = (index: number, field: string, value: any) => {
    const updated = [...form.recipe];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, recipe: updated });
  };
  const removeIngredient = (index: number) => setForm({ ...form, recipe: form.recipe.filter((_, i) => i !== index) });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700} color="white">Products Management</Typography>
        <Button variant="outlined" sx={{ borderColor: '#3D4060', color: 'white' }}>Manage Categories</Button>
      </Box>

      <Box display="flex" gap={4} mb={4} sx={{ borderBottom: '1px solid #393C49', pb: 0, overflowX: 'auto', '&::-webkit-scrollbar': { height: 0 } }}>
        {CATEGORIES.map((cat) => (
          <Typography 
            key={cat} 
            variant="body2" 
            onClick={() => setActiveCategory(cat)}
            sx={{ 
              cursor: 'pointer', 
              color: activeCategory === cat ? '#EA7C69' : '#ABBBC2', 
              borderBottom: activeCategory === cat ? '3px solid #EA7C69' : '3px solid transparent', 
              pb: 1.5, 
              fontWeight: 600, 
              whiteSpace: 'nowrap',
              fontSize: 16
            }}>
            {cat}
          </Typography>
        ))}
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress sx={{ color: '#EA7C69' }} /></Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Box 
              onClick={() => handleOpen()} 
              sx={{ 
                border: '1px dashed #EA7C69', 
                borderRadius: 2, 
                cursor: 'pointer', 
                minHeight: 280, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                '&:hover': { bgcolor: 'rgba(234, 124, 105, 0.05)' } 
              }}
            >
              <AddIcon sx={{ color: '#EA7C69', fontSize: 32, mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#EA7C69', fontWeight: 600 }}>Add new dish</Typography>
            </Box>
          </Grid>
          {filtered.map((product: any) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Card sx={{ 
                bgcolor: '#1F1D2B', 
                minHeight: 280, 
                borderRadius: 2, 
                border: '1px solid #393C49',
                textAlign: 'center',
                position: 'relative',
                pt: 2,
                '&:hover .delete-btn': { opacity: 1 }
              }}>
                <IconButton 
                  className="delete-btn"
                  onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }}
                  sx={{ 
                    position: 'absolute', top: 12, right: 12, 
                    bgcolor: 'rgba(255, 124, 163, 0.1)', color: '#FF7CA3',
                    opacity: 0, transition: 'opacity 0.2s',
                    '&:hover': { bgcolor: 'rgba(255, 124, 163, 0.2)' }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ 
                    width: 120, height: 120, borderRadius: '50%', 
                    bgcolor: '#45442f', mx: 'auto', mb: 2, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: 48, overflow: 'hidden',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                  }}>
                    {product.imageUrl ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🍜'}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'white', mb: 0.5, fontSize: 16 }}>{product.name}</Typography>
                  <Box display="flex" justifyContent="center" gap={1} mb={2}>
                    <Typography variant="body2" sx={{ color: '#ABBBC2' }}>${product.price.toFixed(2)}</Typography>
                    <Box sx={{ color: '#ABBBC2' }}>•</Box>
                    <Typography variant="body2" sx={{ color: '#ABBBC2' }}>{product.availableUnits} dishes</Typography>
                  </Box>
                  <Button 
                    fullWidth 
                    size="medium" 
                    startIcon={<EditIcon sx={{ fontSize: 18 }} />} 
                    onClick={() => handleOpen(product)}
                    sx={{ 
                      bgcolor: 'rgba(234, 124, 105, 0.15)', 
                      color: '#EA7C69', 
                      borderRadius: 2, 
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.2,
                      '&:hover': { bgcolor: 'rgba(234, 124, 105, 0.25)' } 
                    }}
                  >
                    Edit dish
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#1F1D2B', borderRadius: 4, backgroundImage: 'none' } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700, p: 3, borderBottom: '1px solid #393C49' }}>
          {editId ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Product Name</Typography>
            <TextField fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} 
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }} 
              inputProps={{ style: { color: 'white' } }}
            />
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Price ($)</Typography>
                <TextField type="number" fullWidth value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} 
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }} 
                  inputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Category</Typography>
                <TextField select fullWidth value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} 
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                  SelectProps={{ style: { color: 'white' } }}
                >
                  {CATEGORIES.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>

            <Box mb={4}>
              <Typography variant="body2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>Product Image</Typography>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={{ 
                  width: 100, height: 100, borderRadius: 2, 
                  bgcolor: '#2D303E', border: '1px dashed #EA7C69', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  overflow: 'hidden', flexShrink: 0 
                }}>
                  {form.imageUrl ? <img src={form.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <CloudUploadIcon sx={{ color: '#EA7C69', fontSize: 32 }} />}
                </Box>
                <Box>
                  <Button variant="outlined" size="medium" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    startIcon={uploading ? <CircularProgress size={16} sx={{ color: '#EA7C69' }} /> : <CloudUploadIcon />}
                    sx={{ borderColor: '#EA7C69', color: '#EA7C69', mb: 1, textTransform: 'none', borderRadius: 2 }}>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  <Typography variant="caption" sx={{ color: '#ABBBC2', display: 'block' }}>JPG, PNG up to 5MB</Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>Recipe (Ingredients)</Typography>
            {form.recipe.map((ing, i) => (
              <Box key={i} display="flex" gap={1} mb={2} alignItems="center">
                <TextField select label="Raw Material" size="small" value={ing.rawMaterialId} onChange={(e) => updateIngredient(i, 'rawMaterialId', e.target.value)} 
                  sx={{ flex: 2, '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                  SelectProps={{ style: { color: 'white' } }}
                >
                  {rawMaterials.map((m: any) => <MenuItem key={m._id} value={m._id}>{m.name} ({m.unit})</MenuItem>)}
                </TextField>
                <TextField label="Qty" type="number" size="small" value={ing.quantity} onChange={(e) => updateIngredient(i, 'quantity', Number(e.target.value))} 
                  sx={{ flex: 1, '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2, '& fieldset': { borderColor: '#393C49' } } }}
                  inputProps={{ style: { color: 'white' } }}
                />
                <IconButton size="small" onClick={() => removeIngredient(i)} sx={{ color: '#FF7CA3' }}><DeleteIcon fontSize="small" /></IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} size="small" onClick={addIngredient} sx={{ color: '#EA7C69', fontWeight: 600, textTransform: 'none' }}>Add Ingredient</Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, borderTop: '1px solid #393C49' }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderColor: '#393C49', color: 'white', borderRadius: 2, px: 3, textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#EA7C69', '&:hover': { bgcolor: '#d4623b' }, borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>
            {editId ? 'Save Changes' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const MENU_ITEMS = [
  { icon: <PaletteIcon />, label: 'Appearance', sub: 'Dark and Light mode, Font size' },
  { icon: <RestaurantIcon />, label: 'Your Restaurant', sub: 'Dark and Light mode, Font size' },
  { icon: <GridViewIcon />, label: 'Products Management', sub: 'Manage your product, pricing, etc', active: true },
  { icon: <NotificationsIcon />, label: 'Notifications', sub: 'Customize your notifications' },
  { icon: <LockIcon />, label: 'Security', sub: 'Configure Password, PIN etc' },
  { icon: <InfoIcon />, label: 'About Us', sub: 'Find out more about Posly' },
];

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState('Products Management');

  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'products') setActive('Products Management');
  }, [searchParams]);

  return (
    <AppLayout>
      <Typography variant="h4" fontWeight={700} color="white" mb={3}>
        Settings
      </Typography>
      <Box display="flex" gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
        {/* Left Menu */}
        <Card sx={{ bgcolor: '#1F1D2B', width: { xs: '100%', md: 300 }, flexShrink: 0, borderRadius: 4, border: 'none' }}>
          <List sx={{ p: 0 }}>
            {MENU_ITEMS.map((item) => (
              <ListItem
                key={item.label}
                onClick={() => setActive(item.label)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 0,
                  p: 3,
                  position: 'relative',
                  bgcolor: active === item.label ? 'rgba(234, 124, 105, 0.15)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(234, 124, 105, 0.05)' },
                }}
              >
                {active === item.label && (
                  <Box sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 3, bgcolor: '#EA7C69', borderRadius: '4px 0 0 4px' }} />
                )}
                <ListItemIcon sx={{ color: active === item.label ? '#EA7C69' : '#ABBBC2', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: active === item.label ? '#EA7C69' : 'white', fontSize: 14 }}
                    >
                      {item.label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#ABBBC2', fontSize: 11 }}>
                      {item.sub}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Card>

        {/* Right Content */}
        <Card sx={{ bgcolor: '#1F1D2B', flex: 1, minWidth: 0, borderRadius: 4, border: 'none' }}>
          <CardContent sx={{ p: 4 }}>
            {active === 'Products Management' ? (
              <ProductsManagementContent />
            ) : (
              <Box>
                <Typography variant="h5" fontWeight={700} color="white" mb={3}>
                  {active}
                </Typography>
                <Typography variant="body1" sx={{ color: '#ABBBC2' }}>
                  Configure {active.toLowerCase()} settings here.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
