import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isAuthenticated, getUserRole } from '@/lib/auth';
import { Users, Building2, Search, TrendingUp } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated()) {
      const role = getUserRole();
      if (role === 'JobSeeker') {
        navigate('/seeker/dashboard');
      } else if (role === 'Company') {
        navigate('/company/dashboard');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/30 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">JobHub</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/company')}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <Building2 className="w-4 h-4" />
              <span>Looking to Hire?</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Find Your Dream
              <span className="block text-primary">Career</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Discover thousands of job opportunities that match your skills and aspirations. 
              Connect with top companies and advance your professional journey.
            </p>
          </div>

          {/* Job Seeker Action Card */}
          <div className="max-w-md mx-auto animate-slide-up">
            <Card className="card-hover glass-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Start Your Job Search</CardTitle>
                <CardDescription className="text-base">
                  Join thousands of professionals who found their dream jobs through our platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/seeker/signup')}
                  >
                    Sign Up
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/seeker/login')}
                  >
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose JobHub?</h2>
            <p className="text-muted-foreground text-lg">Everything you need to find your next career opportunity</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Job Matching</h3>
              <p className="text-muted-foreground">Advanced matching system finds jobs that perfectly match your skills and preferences</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
              <p className="text-muted-foreground">Track your applications and discover opportunities for professional development</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top Companies</h3>
              <p className="text-muted-foreground">Connect with leading employers across industries looking for talent like you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 JobHub. Created by Leah Pines and Rachel Fried.</p>
        </div>
      </footer>
    </div>
  );
};