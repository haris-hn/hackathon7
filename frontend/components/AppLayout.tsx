'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAuth } from '@/lib/authSlice';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';
import Sidebar from './Sidebar';
import { RootState } from '@/lib/store';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const { user, token, isInitialized } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(initializeAuth());
    setMounted(true);
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized) {
      if (!token && pathname !== '/login' && pathname !== '/register') {
        router.push('/login');
      } else if (token && user) {
        // Role-based protection
        const adminOnlyPaths = ['/dashboard', '/settings', '/raw-materials', '/products'];
        const isAdminPath = adminOnlyPaths.some(p => pathname.startsWith(p));
        
        if (isAdminPath && user.role !== 'admin') {
          router.push('/pos');
        }
      }
    }
  }, [token, user, pathname, router, isInitialized]);

  // Prevent hydration mismatch and 401 errors by not rendering children until auth is initialized
  if (!mounted || !isInitialized) {
    return (
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        bgcolor: '#1F1D2B',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress sx={{ color: '#EA7C69' }} />
      </Box>
    );
  }

  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#1F1D2B' }}>
      {!isAuthPage && <Sidebar />}
      <Box sx={{
        flex: 1,
        ml: (isMobile || isAuthPage) ? 0 : '104px',
        mt: isMobile && !isAuthPage ? '56px' : 0,
        p: isAuthPage ? 0 : { xs: 2, sm: 3 },
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: isMobile ? 'calc(100vh - 56px)' : '100vh',
      }}>
        {children}
      </Box>
    </Box>
  );
}
