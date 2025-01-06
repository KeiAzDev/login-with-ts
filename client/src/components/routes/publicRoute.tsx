import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../services/authService.tsx';

const PublicRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await isAuthenticated();
        setIsAuth(response.authenticated);
      } catch (error) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return null; // または LoadingSpinner コンポーネントなど
  }

  return isAuth ? <Navigate to="/home" replace /> : children;
};

export default PublicRoute;