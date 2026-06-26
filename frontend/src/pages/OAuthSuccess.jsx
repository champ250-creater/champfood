import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Read the URL to find the "?token=..." part
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 2. Save the token to local storage so the api.js file can use it
      localStorage.setItem('token', token);
      
      // 3. Teleport the user to the home page
      navigate('/');
    } else {
      // If no token is found, send them back to login
      navigate('/login?error=missing_token');
    }
  }, [navigate, location]);

  // A quick loading screen while the redirect happens
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">Kwinjira...</h2>
      <p className="text-gray-500 text-sm mt-2">Mwihangane gato</p>
    </div>
  );
}