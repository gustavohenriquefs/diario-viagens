import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth.context';
import { auth } from '../firebase';
import { Load } from '../shared/components/load/load';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    auth.authStateReady().then(() => {
      setAuthReady(true);
    });
  }, []);

  if (!authReady) {
    return <Load />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};


export default ProtectedRoute;