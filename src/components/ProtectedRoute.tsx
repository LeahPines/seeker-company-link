import { ReactNode, useEffect, useState } from 'react';
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
  redirectTo = '/',
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    if (!auth) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (allowedRoles) {
      const userRole = getUserRole();
      if (!userRole || !allowedRoles.includes(userRole)) {
        if (userRole === 'JobSeeker') {
          navigate('/seeker/dashboard', { replace: true });
        } else if (userRole === 'Company') {
          navigate('/company/dashboard', { replace: true });
        } else {
          navigate(redirectTo, { replace: true });
        }
        return;
      }
    }

    setChecked(true);
  }, [navigate, allowedRoles, redirectTo]);

  if (!checked) {
    return null; 
  }

  return <>{children}</>;
};
