'use client';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EmotionCacheProvider from '@/lib/emotionCache';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#EA7C69' },
    secondary: { main: '#9290FE' },
    background: {
      default: '#1F1D2B',
      paper: '#1F1D2B',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#ABBBC2',
    },
  },
  typography: {
    fontFamily: '"Barlow", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { 
          textTransform: 'none', 
          borderRadius: 8,
          fontWeight: 600
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { 
          borderRadius: 16, 
          backgroundColor: '#1F1D2B', 
          backgroundImage: 'none',
          boxShadow: 'none'
        },
      },
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider>
      <Provider store={store}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </Provider>
    </EmotionCacheProvider>
  );
}
