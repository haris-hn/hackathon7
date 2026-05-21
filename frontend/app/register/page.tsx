'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '@/lib/api';
import { setCredentials } from '@/lib/authSlice';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await register({ name, email, password, role: 'user' }).unwrap();
      dispatch(setCredentials(result));
      router.push('/pos');
    } catch (err: any) {
      setError(err?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#1F1D2B',
    }}>
      <Paper elevation={0} sx={{
        p: 5,
        width: 420,
        borderRadius: 4,
        bgcolor: '#252836',
        border: '1px solid #393C49',
        textAlign: 'center',
      }}>
        <Typography variant="h4" fontWeight={700} color="white" mb={1} sx={{ letterSpacing: 1 }}>
          Jaegar POS
        </Typography>
        <Typography variant="body1" sx={{ color: '#ABBBC2', mb: 5 }}>
          Create an account to get started
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Full Name</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: '#2D303E',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#393C49' },
                  '&:hover fieldset': { borderColor: '#EA7C69' },
                  '&.Mui-focused fieldset': { borderColor: '#EA7C69' },
                },
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Email Address</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: '#2D303E',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#393C49' },
                  '&:hover fieldset': { borderColor: '#EA7C69' },
                  '&.Mui-focused fieldset': { borderColor: '#EA7C69' },
                },
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'left', mb: 4 }}>
            <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>Password</Typography>
            <TextField
              fullWidth
              type="password"
              variant="outlined"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: '#2D303E',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#393C49' },
                  '&:hover fieldset': { borderColor: '#EA7C69' },
                  '&.Mui-focused fieldset': { borderColor: '#EA7C69' },
                },
              }}
            />
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1.8,
              bgcolor: '#EA7C69',
              '&:hover': { bgcolor: '#d4623b' },
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 16,
              textTransform: 'none',
              mb: 3,
              boxShadow: '0 8px 24px rgba(234, 124, 105, 0.3)',
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#EA7C69', textDecoration: 'none', fontWeight: 600 }}>
            Login here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
