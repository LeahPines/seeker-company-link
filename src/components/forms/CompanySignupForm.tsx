import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { saveAuthData } from '@/lib/auth';

export const CompanySignupForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    email: '',
    password: '',
    rate: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) newErrors.code = 'Company code is required';
    else {
      const code = parseInt(formData.code);
      if (isNaN(code) || code <= 0) newErrors.code = 'Code must be a positive integer';
    }
    
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    else if (formData.name.trim().length > 50) newErrors.name = 'Name must be at most 50 characters';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    else if (formData.email.length > 50) newErrors.email = 'Email must be at most 50 characters';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    else if (formData.password.length > 100) newErrors.password = 'Password must be at most 100 characters';
    
    if (formData.rate === null || formData.rate === undefined) newErrors.rate = 'Rate is required';
    else {
      const rate = parseInt(formData.rate as any);
      if (isNaN(rate) || rate < 0 || rate > 5) newErrors.rate = 'Rate must be an integer between 0-5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        Code: parseInt(formData.code),
        Name: formData.name.trim(),
        Email: formData.email.trim(),
        Password: formData.password,
        Rate: parseInt(formData.rate as any)
      };

      const response = await api.post('/Auth/SignUpCompany', payload);
      
      if (response && response.token) {
        let role = 'Company';
        let userId = '';
        let email = formData.email;
        try {
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          role = payload.Role || 'Company';
          userId = payload.UserId || payload.NameIdentifier?.toString() || payload.nameid?.toString() || payload.CompanyId?.toString() || '';
        } catch (e) {
        }
        saveAuthData({ token: response.token, role: role as 'Company', userId, email });
      }
      toast({
        title: "Company Account Created!",
        description: "Welcome to your dashboard!",
      });
      navigate('/company/dashboard', { replace: true });
    } catch (error: any) {
      if (error.status === 400) {
        setErrors({ general: error.message || 'Validation failed. Please check your input.' });
      } else {
        setErrors({ general: 'Failed to create account. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'rate' ? parseInt(value) || 0 : value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Company Account</CardTitle>
          <CardDescription>Join our platform to find the best talent</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="code">Company Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                className={errors.code ? 'border-destructive' : ''}
                placeholder="Unique company identifier"
              />
              {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
                placeholder="Your company name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

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
                placeholder="Minimum 6 characters"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Company Rating (0-5)</Label>
              <Input
                id="rate"
                type="number"
                min="0"
                max="5"
                step="1"
                value={formData.rate}
                onChange={(e) => handleInputChange('rate', e.target.value)}
                className={errors.rate ? 'border-destructive' : ''}
                placeholder="4"
              />
              {errors.rate && <p className="text-sm text-destructive">{errors.rate}</p>}
            </div>

            <div className="flex flex-col space-y-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Company Account'
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/company/login')}
                >
                  Already have an account? Sign in
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
