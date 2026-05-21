'use client';
import { Suspense, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/lib/authSlice';
import { RootState } from '@/lib/store';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import ReceiptIcon from '@mui/icons-material/ReceiptOutlined';
import DashboardIcon from '@mui/icons-material/PieChartOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import StoreIcon from '@mui/icons-material/Storefront';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const navItems = [
  { icon: HomeIcon, path: '/pos', label: 'Home', roles: ['admin', 'user'] },
  { icon: LocalOfferIcon, path: '/discounts', label: 'Discounts', roles: ['admin', 'user'] },
  { icon: DashboardIcon, path: '/dashboard', label: 'Dashboard', roles: ['admin'] },
  { icon: ReceiptIcon, path: '/orders', label: 'Orders', roles: ['admin', 'user'] },
  { icon: SettingsIcon, path: '/settings', label: 'Settings', roles: ['admin'] },
];

function SidebarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const isMobile = useMediaQuery('(max-width:768px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (item: typeof navItems[0]) => {
    const basePath = item.path.split('?')[0];
    return pathname.startsWith(basePath);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const NavIcon = ({ item, onClick }: { item: typeof navItems[0]; onClick?: () => void }) => {
    const active = isActive(item);
    if (item.roles && user && !item.roles.includes(user.role)) return null;

    const Icon = item.icon;

    return (
      <Box
        key={item.path}
        onClick={() => { router.push(item.path); onClick?.(); }}
        sx={{
          width: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          mb: 1.5,
          cursor: 'pointer',
          // The "wing" effect container
          ...(active && {
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: -15,
              width: 12,
              height: 15,
              bgcolor: 'transparent',
              borderBottomRightRadius: 15,
              boxShadow: '4px 4px 0 0 #252836',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              right: 0,
              bottom: -15,
              width: 12,
              height: 15,
              bgcolor: 'transparent',
              borderTopRightRadius: 15,
              boxShadow: '4px -4px 0 0 #252836',
            }
          })
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: active ? '#EA7C69' : 'transparent',
            color: active ? '#FFF' : '#EA7C69',
            boxShadow: active ? '0 8px 24px rgba(234, 124, 105, 0.3)' : 'none',
            transition: 'all 0.2s',
            zIndex: 1,
            '&:hover': {
              bgcolor: active ? '#EA7C69' : 'rgba(234, 124, 105, 0.1)',
            },
            marginLeft: active ? '12px' : '0',
          }}
        >
          <Icon sx={{ fontSize: 24 }} />
        </Box>
        {active && (
           <Box sx={{
             position: 'absolute',
             right: 0,
             top: 0,
             bottom: 0,
             width: 12,
             bgcolor: '#252836',
             borderTopLeftRadius: 12,
             borderBottomLeftRadius: 12,
           }} />
        )}
      </Box>
    );
  };

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <Box sx={{
      width: 104, minHeight: '100%', bgcolor: '#1F1D2B',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', py: 3,
      borderRight: '1px solid #2D3048',
    }}>
      {/* Logo */}
      <Box
        onClick={() => { router.push('/pos'); onNav?.(); }}
        sx={{
          width: 56, height: 56, bgcolor: 'rgba(234, 124, 105, 0.2)', borderRadius: 2.5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 4, cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
        }}
      >
        <StoreIcon sx={{ color: '#EA7C69', fontSize: 32 }} />
      </Box>

      {/* Nav Items */}
      <Box display="flex" flexDirection="column" alignItems="center" flex={1}>
        {navItems.map((item) => <NavIcon key={item.path} item={item} onClick={onNav} />)}
      </Box>

      {/* Logout */}
      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', px: 1.5 }}>
        <Divider sx={{ width: '100%', borderColor: '#2D3048', mb: 2 }} />
        <Tooltip title="Logout" placement="right">
          <IconButton
            onClick={handleLogout}
            sx={{
              width: 56, height: 56, borderRadius: 2,
              color: '#9CA3AF',
              '&:hover': { bgcolor: 'rgba(232,115,74,0.1)', color: '#E8734A' },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Box sx={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          height: 56, bgcolor: '#1F1D2B', borderBottom: '1px solid #2D3048',
          display: 'flex', alignItems: 'center', px: 2, justifyContent: 'space-between',
        }}>
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="white" fontWeight={700}>Jaegar POS</Typography>
          <Box sx={{ width: 40 }} /> {/* spacer */}
        </Box>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}
        >
          <SidebarContent onNav={() => setDrawerOpen(false)} />
        </Drawer>
      </>
    );
  }

  return (
    <Box sx={{
      width: 104, minHeight: '100vh',
      position: 'fixed', left: 0, top: 0, zIndex: 100,
    }}>
      <SidebarContent />
    </Box>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={null}>
      <SidebarInner />
    </Suspense>
  );
}
