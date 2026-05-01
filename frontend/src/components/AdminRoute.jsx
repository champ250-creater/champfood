import { Navigate } from 'react-router-dom';
import { getStoredUser } from '../utils/helpers';

export default function AdminRoute({ children }) {
  const user = getStoredUser();
  
  // 🔥 IMPORTANT: Put your exact login email here!
  const isAdmin = user && user.email === 'byishimovedaste19@gmail.com';

  if (!isAdmin) {
    // If they aren't you, kick them back to the home page!
    return <Navigate to="/" replace />;
  }

  return children;
}