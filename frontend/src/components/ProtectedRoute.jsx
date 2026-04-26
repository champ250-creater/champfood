import { Navigate } from 'react-router-dom';
import { getStoredUser } from '../utils/helpers';

export default function ProtectedRoute({ children }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
