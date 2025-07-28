import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isAuthenticated, getUserRole } from '@/lib/auth';
import { Building2, Search, TrendingUp, Users, Target, BarChart3, ArrowLeft } from 'lucide-react';

export const CompanyLanding = () => {
  const navigate = useNavigate();

  useEffect(() => {
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
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">JobHub</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Find Your Next
              <span className="block text-primary">Great Hire</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Connect with talented professionals who match your company's needs. 
              Post jobs, discover candidates, and build your dream team.
            </p>
          </div>

          {/* Company Action Card */}
          <div className="max-w-md mx-auto animate-slide-up">
            <Card className="card-hover glass-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Start Hiring Today</CardTitle>
                <CardDescription className="text-base">
                  Join hundreds of companies finding top talent through our platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/company/signup')}
                  >
                    Sign Up
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/company/login')}
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
            <h2 className="text-3xl font-bold mb-4">Why Companies Choose JobHub?</h2>
            <p className="text-muted-foreground text-lg">Professional hiring tools for modern companies</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Precise Matching</h3>
              <p className="text-muted-foreground">Advanced candidate matching based on skills, experience, and culture fit</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hiring Analytics</h3>
              <p className="text-muted-foreground">Track your hiring pipeline with detailed metrics and performance insights</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Candidates</h3>
              <p className="text-muted-foreground">Access a curated pool of verified professionals across all industries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Streamline Your Hiring Process</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Post Jobs Easily</h3>
              <p className="text-muted-foreground mb-4">
                Create detailed job postings with our intuitive form. Specify requirements, 
                work conditions, and company culture to attract the right candidates.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Smart Candidate Discovery</h3>
              <p className="text-muted-foreground mb-4">
                Our matching system finds candidates who meet your specific criteria, 
                saving you time and improving hire quality.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Application Management</h3>
              <p className="text-muted-foreground mb-4">
                Organize and track all applications in one place. Review candidate profiles, 
                manage communications, and make informed hiring decisions.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Company Branding</h3>
              <p className="text-muted-foreground mb-4">
                Showcase your company profile and build your employer brand to attract 
                top talent who align with your values and mission.
              </p>
            </Card>
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
