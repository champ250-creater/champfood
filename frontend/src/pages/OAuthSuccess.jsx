import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../services/api';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Save the token first
      localStorage.setItem('token', token);

      // Now try to decode the JWT to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          id: payload.userId || payload.id,
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
        };
        localStorage.setItem('user', JSON.stringify(user));
      } catch (err) {
        // If decoding fails, store a minimal user object
        console.error('Could not decode token:', err);
        localStorage.setItem('user', JSON.stringify({ name: 'User' }));
      }

      // Redirect to home
      navigate('/');
    } else {
      navigate('/login?error=missing_token');
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Kwinjira...</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Mwihangane gato</p>
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
}