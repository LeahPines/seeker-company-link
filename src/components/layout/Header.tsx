import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { clearAuthData, getAuthData, getUserRole } from '@/lib/auth';
import { LogOut, User, Briefcase } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Header = () => {
  const navigate = useNavigate();
  const authData = getAuthData();
  const userRole = getUserRole();

  const handleLogout = () => {
    clearAuthData();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const handleLogoClick = () => {
    if (authData) {
      if (userRole === 'JobSeeker') {
        navigate('/seeker/dashboard');
      } else if (userRole === 'Company') {
        navigate('/company/dashboard');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">JobHub</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {authData ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{authData.email}</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                    {userRole}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/')}
                >
                  Get Started
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};