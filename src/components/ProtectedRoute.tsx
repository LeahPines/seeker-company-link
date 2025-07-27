import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('JobSeeker' | 'Company')[];
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/' 
}: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(redirectTo);
      return;
    }

    if (allowedRoles) {
      const userRole = getUserRole();
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        const role = getUserRole();
        if (role === 'JobSeeker') {
          navigate('/seeker/dashboard');
        } else if (role === 'Company') {
          navigate('/company/dashboard');
        } else {
          navigate('/');
        }
        return;
      }
    }
  }, [navigate, allowedRoles, redirectTo]);

  if (!isAuthenticated()) {
    return null;
  }

  if (allowedRoles) {
    const userRole = getUserRole();
    if (!userRole || !allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
};