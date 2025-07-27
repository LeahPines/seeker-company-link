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
        // Redirect based on role or to home
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

    // Passed all checks
    setChecked(true);
  }, [navigate, allowedRoles, redirectTo]);

  // While auth is checked and redirect is pending, render nothing or a loader
  if (!checked) {
    return null; // or return a <LoadingSpinner /> if you have one
  }

  return <>{children}</>;
};
