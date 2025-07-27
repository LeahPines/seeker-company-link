import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { api } from '@/lib/api';
import { saveAuthData, decodeJwtPayload } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

export const CompanyLoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/company/login', formData);
      
      // Extract token and decode payload
      const token = response.token || response.accessToken;
      const payload = decodeJwtPayload(token);
      
      if (!payload) {
        throw new Error('Invalid token received');
      }

      // Save auth data
      const authData = {
        token,
        userId: payload.NameIdentifier.toString(),
        role: 'Company' as const,
        email: payload.Email || formData.email
      };

      saveAuthData(authData);
      
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your company account",
      });
      
      navigate('/company/dashboard');
    } catch (error: any) {
      if (error.status === 400 || error.status === 401) {
        setErrors({ general: 'Invalid email or password' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Search className="h-8 w-8 text-blue-600 mr-3" />
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            JobHub
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center py-4 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Company Sign In</CardTitle>
            <CardDescription>Access your hiring dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                placeholder="company@email.com"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={errors.password ? 'border-destructive' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="flex flex-col space-y-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/company/signup')}
                >
                  Don't have an account? Sign up
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/')}
                  className="text-muted-foreground"
                >
                  Back to home
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};