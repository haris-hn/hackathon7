'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useGetProductsQuery, useCreateOrderMutation } from '@/lib/api';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItem, removeItem, updateQuantity, updateNote,
  setOrderType, setDiscount, setTableNo, setCustomerName,
  setPaymentMethod, clearCart, selectCartSubtotal,
} from '@/lib/cartSlice';
import type { RootState } from '@/lib/store';

const CATEGORIES = ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'];

function ProductImage({ src, alt, size = 120 }: { src?: string; alt: string; size?: number }) {
  return (
    <Box sx={{
      width: size, height: size, borderRadius: '50%', bgcolor: '#45442fff',
      mx: 'auto', overflow: 'hidden', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, flexShrink: 0,
      mt: `-${size * 0.5}px`,
      mb: 2,
      position: 'relative',
      zIndex: 1,
    }}>
      {src ? <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🍜'}
    </Box>
  );
}

// ── Order Panel (right side) ──────────────────────────────────────────────────
function OrderPanel({
  cart, subtotal, orderNo,
  onPayment, dispatch,
}: {
  cart: RootState['cart']; subtotal: number; orderNo: string;
  onPayment: () => void; dispatch: ReturnType<typeof useDispatch>;
}) {
  return (
    <Box sx={{
      width: '100%', height: '100%', bgcolor: '#1F1D2B', borderRadius: 2,
      p: 2.5, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Title */}
      <Typography fontWeight={700} color="white" mb={2} fontSize={20}>
        Orders #{orderNo}
      </Typography>

      {/* Order type chips */}
      <Box display="flex" gap={1} mb={2.5}>
        {(['Dine In', 'To Go', 'Delivery'] as const).map((t) => (
          <Chip key={t} label={t} size="small"
            onClick={() => dispatch(setOrderType(t))}
            sx={{
              bgcolor: cart.orderType === t ? '#EA7C69' : 'transparent',
              color: cart.orderType === t ? 'white' : '#EA7C69',
              border: '1px solid',
              borderColor: cart.orderType === t ? '#EA7C69' : '#393C49',
              cursor: 'pointer', fontSize: 14, height: 34, px: 1,
              fontWeight: 600,
              borderRadius: '8px',
              '&:hover': { bgcolor: cart.orderType === t ? '#EA7C69' : 'rgba(234, 124, 105, 0.1)' },
            }}
          />
        ))}
      </Box>

      {/* Column headers */}
      <Box display="flex" alignItems="center" mb={2} px={0.5} borderBottom="1px solid #393C49" pb={1.5}>
        <Typography variant="caption" color="white" fontWeight={600} fontSize={16} flex={1}>Item</Typography>
        <Box display="flex" gap={4}>
          <Typography variant="caption" color="white" fontWeight={600} fontSize={16} sx={{ width: 40, textAlign: 'center' }}>Qty</Typography>
          <Typography variant="caption" color="white" fontWeight={600} fontSize={16} sx={{ width: 60, textAlign: 'right' }}>Price</Typography>
        </Box>
      </Box>

      {/* Cart items */}
      <Box flex={1} overflow="auto" sx={{
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#3D4060', borderRadius: 2 },
      }}>
        {cart.items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={6} fontSize={14}>
            No items added yet
          </Typography>
        ) : (
          cart.items.map((item) => (
            <Box key={item.productId} mb={3}>
              {/* Item row */}
              <Box display="flex" alignItems="flex-start" gap={1.2}>
                {/* Image + Info */}
                <Box display="flex" gap={1} flex={1}>
                   <Box sx={{
                    width: 40, height: 40, borderRadius: '50%', bgcolor: '#3D4060',
                    overflow: 'hidden', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : '🍜'}
                  </Box>
                  <Box minWidth={0}>
                    <Typography fontWeight={600} color="white" noWrap fontSize={14} lineHeight={1.2}>
                      {item.productName}
                    </Typography>
                    <Typography color="#ABBBC2" fontSize={12}>
                      $ {item.price.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                {/* Qty and Price container */}
                <Box display="flex" alignItems="center" gap={4}>
                   {/* Qty Box */}
                  <Box sx={{
                    width: 48, height: 48, bgcolor: '#2D303E', borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid #393C49',
                  }}>
                    <Typography color="white" fontWeight={600} fontSize={16}>{item.quantity}</Typography>
                  </Box>

                  {/* Total Price */}
                  <Typography color="white" fontWeight={600} fontSize={16} sx={{ width: 60, textAlign: 'right' }}>
                    $ {(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Note field + delete row */}
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <TextField
                  size="small"
                  placeholder="Order Note..."
                  value={item.note}
                  onChange={(e) => dispatch(updateNote({ productId: item.productId, note: e.target.value }))}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#2D303E',
                      fontSize: 14,
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#393C49' },
                      '&:hover fieldset': { borderColor: '#ABBBC2' },
                      '&.Mui-focused fieldset': { borderColor: '#EA7C69' },
                    },
                    '& .MuiInputBase-input': { py: 1.2, px: 1.5, color: '#FFFFFF' },
                  }}
                />
                {/* Delete button */}
                <IconButton size="small" onClick={() => dispatch(removeItem(item.productId))}
                  sx={{
                    color: '#EA7C69', bgcolor: 'transparent',
                    border: '1px solid #EA7C69', borderRadius: 2,
                    width: 48, height: 48, flexShrink: 0,
                    '&:hover': { bgcolor: 'rgba(234, 124, 105, 0.1)' },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Divider sx={{ borderColor: '#393C49', my: 2 }} />

      <Box display="flex" justifyContent="space-between" mb={1.5}>
        <Typography color="#ABBBC2" fontSize={14}>Discount</Typography>
        <Typography color="white" fontWeight={600} fontSize={16}>$ {(cart.discount || 0).toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography color="#ABBBC2" fontSize={14}>Sub total</Typography>
        <Typography color="white" fontWeight={600} fontSize={16}>$ {(subtotal || 0).toFixed(2)}</Typography>
      </Box>

      <Button fullWidth variant="contained"
        disabled={cart.items.length === 0}
        onClick={onPayment}
        sx={{
          bgcolor: '#EA7C69', '&:hover': { bgcolor: '#d4623b' },
          '&:disabled': { bgcolor: 'rgba(234, 124, 105, 0.3)', color: 'rgba(255,255,255,0.3)' },
          py: 1.8, fontWeight: 700, fontSize: 16, borderRadius: 2, textTransform: 'none',
          boxShadow: '0 8px 24px rgba(234, 124, 105, 0.3)',
        }}
      >
        Continue to Payment
      </Button>
    </Box>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState('Hot Dishes');
  const [search, setSearch] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(max-width:1024px)');

  const { data: products = [], isLoading } = useGetProductsQuery(undefined, { pollingInterval: 5000 });
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

  const dispatch = useDispatch();
  const cart = useSelector((s: RootState) => s.cart);
  const subtotal = useSelector(selectCartSubtotal);

  const filtered = products.filter((p: any) => {
    const matchCat = p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleConfirmPayment = async () => {
    setOrderError('');
    try {
      await createOrder({
        items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity, note: i.note })),
        discount: cart.discount, orderType: cart.orderType,
        tableNo: cart.tableNo, customerName: cart.customerName, paymentMethod: cart.paymentMethod,
      }).unwrap();
      dispatch(clearCart());
      setShowConfirmation(false);
      setCartDrawerOpen(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (err: any) {
      setOrderError(err?.data?.message || 'Order failed. Check stock availability.');
    }
  };

  const [today, setToday] = useState('');
  const [orderNo, setOrderNo] = useState('');
  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }));
    setOrderNo(String(Math.floor(Math.random() * 90000 + 10000)));
  }, []);

  const cartItemCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  const orderPanelProps = { cart, subtotal, orderNo, onPayment: () => setShowConfirmation(true), dispatch };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#252836', borderRadius: 1.5, fontSize: 13,
      '& fieldset': { borderColor: '#3D4060' },
      '&:hover fieldset': { borderColor: '#5A6080' },
      '&.Mui-focused fieldset': { borderColor: '#E8734A', borderWidth: 1.5 },
    },
    '& .MuiInputBase-input': { color: 'white', py: 1.1, px: 1.4 },
    '& .MuiInputBase-input::placeholder': { color: '#6B7280', opacity: 1 },
  };

  const ConfirmationOverlay = (
    <Box sx={{
      position: 'fixed', inset: 0, zIndex: 1200,
      display: 'flex', alignItems: 'stretch',
      pointerEvents: 'none',
    }}>
      {/* Dark overlay covering everything (sidebar + main content) except the panels */}
      <Box sx={{
        flex: 1, backdropFilter: 'blur(2px)', bgcolor: 'rgba(5,5,10,0.55)',
        pointerEvents: 'auto',
        cursor: 'pointer',
      }} onClick={() => setShowConfirmation(false)} />

      {/* Confirmation Panel */}
      <Box sx={{
        width: 420, flexShrink: 0, bgcolor: '#1F1D2B',
        p: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        pointerEvents: 'auto', 
        borderLeft: '1px solid #393C49',
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24,
      }}>
        <Box display="flex" alignItems="center"  gap={1} mb={0.5}>
          <IconButton size="small" onClick={() => setShowConfirmation(false)} sx={{ color: 'white', p: 0.5 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" fontWeight={700} color="white" fontSize={24}>Confirmation</Typography>
        </Box>
        <Typography variant="caption" color="#ABBBC2" mb={3} display="block">
          Orders #{orderNo}
        </Typography>

        <Box flex={1} overflow="auto" sx={{
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#3D4060', borderRadius: 2 },
        }}>
          {cart.items.map((item) => (
            <Box key={item.productId} mb={3}>
              <Box display="flex" alignItems="flex-start" gap={1.5}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: '50%', bgcolor: '#3D4060',
                  overflow: 'hidden', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '🍜'}
                </Box>
                <Box flex={1} minWidth={0}>
                  <Typography fontWeight={600} color="white" noWrap fontSize={14} lineHeight={1.3}>
                    {item.productName}
                  </Typography>
                  <Typography variant="caption" color="#ABBBC2" fontSize={12}>$ {item.price.toFixed(2)}</Typography>
                </Box>
                <Box sx={{
                  width: 48, height: 48, bgcolor: '#2D303E', borderRadius: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #393C49',
                }}>
                  <Typography color="white" fontWeight={600} fontSize={16}>{item.quantity}</Typography>
                </Box>
                <Typography color="white" fontWeight={600} fontSize={16} minWidth={60} textAlign="right">
                  $ {(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: '#393C49', my: 2 }} />
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="#ABBBC2" fontSize={14}>Discount</Typography>
          <Typography color="white" fontWeight={600} fontSize={16}>$ {(cart.discount || 0).toFixed(2)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography color="#ABBBC2" fontSize={14}>Sub total</Typography>
          <Typography color="white" fontWeight={700} fontSize={20}>$ {(subtotal || 0).toFixed(2)}</Typography>
        </Box>
      </Box>

      {/* Payment Panel */}
      <Box sx={{
        width: 400, flexShrink: 0, bgcolor: '#1F1D2B',
        p: 3, display: 'flex', flexDirection: 'column', overflow: 'auto',
        pointerEvents: 'auto',
        borderLeft: '1px solid #393C49',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#3D4060', borderRadius: 2 },
      }}>
        <Typography variant="h5" fontWeight={700} color="white" mb={0.5} fontSize={24}>Payment</Typography>
        <Typography variant="caption" color="#ABBBC2" mb={3} display="block">
          3 payment method available
        </Typography>
        <Divider sx={{ borderColor: '#393C49', mb: 3 }} />

        <Typography color="white" fontWeight={600} fontSize={16} mb={2}>Payment Method</Typography>
        <Box display="flex" gap={1.5} mb={4}>
          {(['Credit Card', 'Paypal', 'Cash'] as const).map((m) => (
            <Button key={m} size="small"
              onClick={() => dispatch(setPaymentMethod(m))}
              sx={{
                flex: 1, py: 1.5, flexDirection: 'column', gap: 0.5,
                bgcolor: cart.paymentMethod === m ? '#2D303E' : 'transparent',
                border: '1px solid',
                borderColor: cart.paymentMethod === m ? '#EA7C69' : '#393C49',
                color: 'white', fontSize: 12, textTransform: 'none', borderRadius: 2,
                position: 'relative',
                '&:hover': { bgcolor: 'rgba(234, 124, 105, 0.05)' },
              }}
            >
              {cart.paymentMethod === m && (
                <Box sx={{ position: 'absolute', top: 4, right: 4, color: '#EA7C69', fontSize: 14 }}>✔</Box>
              )}
              {m === 'Credit Card' && <Box component="span" sx={{ fontSize: 24 }}>💳</Box>}
              {m === 'Paypal' && <Box component="span" sx={{ fontSize: 24 }}>🅿</Box>}
              {m === 'Cash' && <Box component="span" sx={{ fontSize: 24 }}>💵</Box>}
              <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 600 }}>{m}</Typography>
            </Button>
          ))}
        </Box>

        {cart.paymentMethod === 'Credit Card' && (
          <>
            <Typography color="#FFFFFF" fontSize={14} mb={1}>Cardholder Name</Typography>
            <TextField size="small" fullWidth value={cart.customerName}
              onChange={(e) => dispatch(setCustomerName(e.target.value))}
              placeholder="Levi Ackerman"
              sx={{ mb: 2.5, ...inputSx, '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2 } }}
            />
            <Typography color="#FFFFFF" fontSize={14} mb={1}>Card Number</Typography>
            <TextField size="small" fullWidth placeholder="2564 1421 0897 1244"
              inputProps={{ maxLength: 19 }}
              sx={{ mb: 2.5, ...inputSx, '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2 } }}
            />
            <Box display="flex" gap={2} mb={2.5}>
              <Box flex={1}>
                <Typography color="#FFFFFF" fontSize={14} mb={1}>Expiration Date</Typography>
                <TextField size="small" fullWidth placeholder="02/2022"
                  inputProps={{ maxLength: 7 }}
                  sx={{ ...inputSx, '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2 } }}
                />
              </Box>
              <Box flex={1}>
                <Typography color="#FFFFFF" fontSize={14} mb={1}>CVV</Typography>
                <TextField size="small" fullWidth placeholder="• • •"
                  type="password" inputProps={{ maxLength: 4 }}
                  sx={{ ...inputSx, '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2 } }}
                />
              </Box>
            </Box>
          </>
        )}

        {cart.paymentMethod !== 'Credit Card' && (
          <>
            <Typography color="#FFFFFF" fontSize={14} mb={1}>Customer Name</Typography>
            <TextField size="small" fullWidth value={cart.customerName}
              onChange={(e) => dispatch(setCustomerName(e.target.value))}
              placeholder="Customer Name"
              sx={{ mb: 2.5, ...inputSx, '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2 } }}
            />
          </>
        )}

        <Box display="flex" gap={2} mb={3}>
          <Box flex={1}>
            <Typography color="#FFFFFF" fontSize={14} mb={1}>Order Type</Typography>
            <Select size="small" value={cart.orderType} fullWidth
              onChange={(e) => dispatch(setOrderType(e.target.value as any))}
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                bgcolor: '#2D303E', color: 'white', borderRadius: 2, fontSize: 14,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#393C49' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ABBBC2' },
                '& .MuiSvgIcon-root': { color: '#FFFFFF' },
                '& .MuiSelect-select': { py: 1.2, px: 1.5 },
              }}
            >
              <MenuItem value="Dine In">Dine In</MenuItem>
              <MenuItem value="To Go">To Go</MenuItem>
              <MenuItem value="Delivery">Delivery</MenuItem>
            </Select>
          </Box>
          <Box flex={1}>
            <Typography color="#FFFFFF" fontSize={14} mb={1}>Table no.</Typography>
            <TextField size="small" fullWidth value={cart.tableNo}
              placeholder="140"
              onChange={(e) => dispatch(setTableNo(e.target.value))}
              sx={{ ...inputSx, '& .MuiOutlinedInput-root': { bgcolor: '#2D303E', borderRadius: 2 } }}
            />
          </Box>
        </Box>

        {orderError && <Alert severity="error" sx={{ mb: 2, fontSize: 13, borderRadius: 2 }}>{orderError}</Alert>}

        <Box display="flex" gap={2} mt="auto" pt={2}>
          <Button fullWidth variant="outlined" onClick={() => setShowConfirmation(false)}
            sx={{
              borderColor: '#EA7C69', color: '#EA7C69', textTransform: 'none',
              py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 14,
              '&:hover': { bgcolor: 'rgba(234, 124, 105, 0.05)', borderColor: '#EA7C69' },
            }}
          >
            Cancel
          </Button>
          <Button fullWidth variant="contained" onClick={handleConfirmPayment} disabled={isOrdering}
            sx={{
              bgcolor: '#EA7C69', '&:hover': { bgcolor: '#d4623b' },
              textTransform: 'none', py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 14,
              boxShadow: '0 8px 24px rgba(234, 124, 105, 0.3)',
            }}
          >
            {isOrdering ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Confirm Payment'}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <AppLayout>
      <Box display="flex" gap={2} height="calc(100vh - 48px)" overflow="hidden" position="relative">

        {/* ── LEFT: Product Selection ── */}
        <Box flex={1} overflow="auto" px={3} pr={{ xs: 3, lg: 3 }}
          sx={{ '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#3D4060', borderRadius: 2 } }}
        >
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} flexWrap="wrap" gap={1}>
            <Box>
              <Typography variant="h5" fontWeight={700} color="white" lineHeight={1.2} fontSize={{ xs: 18, sm: 22 }}>
                Jaegar Resto
              </Typography>
              <Typography variant="caption" color="text.secondary">{today}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} flex={1} justifyContent="flex-end">
              <TextField
                size="small"
                placeholder="Search for food, coffee, etc..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ 
                  startAdornment: <SearchIcon sx={{ color: '#FFFFFF', mr: 1, fontSize: 20 }} />,
                  sx: { color: '#FFFFFF' }
                }}
                sx={{
                  width: { xs: '100%', sm: 220 },
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#2D303E', 
                    borderRadius: 2, 
                    fontSize: 14,
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&.Mui-focused fieldset': { borderColor: '#EA7C69' },
                  },
                }}
              />
              {/* Mobile cart FAB */}
              {(isMobile || isTablet) && (
                <IconButton onClick={() => setCartDrawerOpen(true)}
                  sx={{ bgcolor: '#E8734A', color: 'white', borderRadius: 2, position: 'relative', flexShrink: 0,
                    '&:hover': { bgcolor: '#d4623b' } }}
                >
                  <ShoppingCartIcon fontSize="small" />
                  {cartItemCount > 0 && (
                    <Box sx={{
                      position: 'absolute', top: -4, right: -4, bgcolor: 'white', color: '#E8734A',
                      borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {cartItemCount}
                    </Box>
                  )}
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Category Tabs */}
          <Box display="flex" gap={{ xs: 2, sm: 4 }} mb={3}
            sx={{ borderBottom: '1px solid #393C49', pb: 0, overflowX: 'auto',
              '&::-webkit-scrollbar': { height: 0 } }}
          >
            {CATEGORIES.map((cat) => (
              <Typography key={cat} variant="body2" onClick={() => setActiveCategory(cat)}
                sx={{
                  cursor: 'pointer', color: activeCategory === cat ? '#EA7C69' : '#FFFFFF',
                  borderBottom: activeCategory === cat ? '3px solid #EA7C69' : '3px solid transparent',
                  pb: 1.5, fontWeight: activeCategory === cat ? 600 : 500,
                  whiteSpace: 'nowrap', fontSize: { xs: 13, sm: 14 }, transition: 'all 0.2s',
                  '&:hover': { color: '#EA7C69' }
                }}
              >
                {cat}
              </Typography>
            ))}
          </Box>

          {/* Choose Dishes + order type toggle */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
            <Typography variant="h5" fontWeight={600} color="white" fontSize={{ xs: 18, sm: 22 }}>
              Choose Dishes
            </Typography>
            <Button endIcon={<KeyboardArrowDownIcon />}
              sx={{
                bgcolor: '#1F1D2B', color: 'white', border: '1px solid #393C49',
                borderRadius: 2, px: 2.5, py: 1.2, fontSize: 16, textTransform: 'none',
                fontWeight: 500,
                '&:hover': { bgcolor: '#2D303E' },
              }}
              onClick={() => {
                const types = ['Dine In', 'To Go', 'Delivery'] as const;
                const idx = types.indexOf(cart.orderType as any);
                dispatch(setOrderType(types[(idx + 1) % types.length]));
              }}
            >
              {cart.orderType}
            </Button>
          </Box>

          {orderSuccess && (
            <Alert severity="success" sx={{ mb: 2, fontSize: 13 }}>Order placed successfully!</Alert>
          )}

          {isLoading ? (
            <Box display="flex" justifyContent="center" mt={6}>
              <CircularProgress sx={{ color: '#E8734A' }} />
            </Box>
          ) : (
            <Grid container columnSpacing={4} rowSpacing={7} sx={{ overflow: 'visible', pt: { xs: '45px', sm: '60px' } }}>
              {filtered.map((product: any) => {
                const inStock = product.availableUnits == null || product.availableUnits > 0;
                return (
                  <Grid item key={product._id} xs={4}
                    sx={{ overflow: 'visible' }}
                  >
                    <Card
                      elevation={0}
                      onClick={() => inStock && dispatch(addItem({
                        productId: product._id, productName: product.name,
                        price: product.price, imageUrl: product.imageUrl,
                      }))}
                      sx={{
                        bgcolor: '#1F1D2B', cursor: inStock ? 'pointer' : 'not-allowed',
                        opacity: inStock ? 1 : 0.55, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: 4,
                        border: '1px solid #393C49',
                        overflow: 'visible',
                        height: 260,
                        position: 'relative',
                        '&:hover': inStock ? { transform: 'translateY(-10px)', borderColor: '#EA7C69' } : {},
                      }}
                    >
                      {/* Out of Stock badge */}
                      {!inStock && (
                        <Box sx={{
                          position: 'absolute', top: 12, right: 12, zIndex: 2,
                          bgcolor: '#FF4C4C', color: 'white',
                          fontSize: 10, fontWeight: 700, px: 1, py: 0.5,
                          borderRadius: 1, letterSpacing: 0.5, textTransform: 'uppercase',
                        }}>
                          Out of Stock
                        </Box>
                      )}
                      <CardContent sx={{
                        textAlign: 'center',
                        p: 3,
                        pb: '20px !important',
                        overflow: 'visible',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '100%',
                        boxSizing: 'border-box',
                      }}>
                        <ProductImage src={product.imageUrl} alt={product.name} size={isMobile ? 100 : 132} />
                        <Box>
                          <Typography variant="body2" fontWeight={600} color="#FFFFFF" mb={1}
                            sx={{
                              fontSize: { xs: 13, sm: 15 }, lineHeight: 1.4,
                              display: '-webkit-box', WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden',
                              maxWidth: 160, mx: 'auto'
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="#FFFFFF" fontSize={{ xs: 14, sm: 15 }} mb={1}>
                            $ {product.price.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" fontSize={14}
                            sx={{ color: '#ABBBC2' }}
                          >
                            {inStock ? `${product.availableUnits ?? 999} Bowls available` : '0 Bowls available'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        {/* ── RIGHT: Order Panel (desktop/large tablet) ── */}
        {!isMobile && !isTablet && !showConfirmation && (
          <Box sx={{ width: 320, flexShrink: 0 }}>
            <OrderPanel {...orderPanelProps} />
          </Box>
        )}

        {/* ── Confirmation + Payment overlay ── */}
      </Box>

      {showConfirmation && ConfirmationOverlay}

      {/* ── Mobile/Tablet Cart Drawer ── */}
      <Drawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '90vw', sm: 340 }, bgcolor: '#1F1D2B', p: 0 } }}
      >
        <Box height="100%" p={0}>
          <Box display="flex" alignItems="center" gap={1} p={2} pb={0}>
            <IconButton size="small" onClick={() => setCartDrawerOpen(false)} sx={{ color: 'white' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700} color="white" fontSize={15}>Cart</Typography>
          </Box>
          <Box height="calc(100% - 48px)" p={1.5}>
            <OrderPanel {...orderPanelProps} />
          </Box>
        </Box>
      </Drawer>

    </AppLayout>
  );
}

