import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { BasicCombobox } from '@/components/ui/basic-combobox';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useCountries } from '@/hooks/use-countries';
import { useJobFields } from '@/hooks/use-job-fields';
import { Search } from 'lucide-react';

export const SeekerSignupForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { countries, loading: loadingCountries } = useCountries();
  const { jobFields } = useJobFields();
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    sirName: '',
    email: '',
    password: '',
    country: '',
    dailyWorkHours: '',
    yearsOfExperience: '',
    hasDegree: false,
    field: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.sirName.trim()) newErrors.sirName = 'Surname is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.dailyWorkHours) newErrors.dailyWorkHours = 'Daily work hours is required';
    else {
      const hours = parseInt(formData.dailyWorkHours);
      if (isNaN(hours) || hours < 0 || hours > 24) newErrors.dailyWorkHours = 'Must be between 0-24 hours';
    }
    if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
    else {
      const years = parseInt(formData.yearsOfExperience);
      if (isNaN(years) || years < 0 || years > 100) newErrors.yearsOfExperience = 'Must be between 0-100 years';
    }
    if (!formData.field) newErrors.field = 'Field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Ensure field is a number and use correct endpoint
      const payload = {
        id: Number(formData.id),
        name: formData.name.trim(),
        sirName: formData.sirName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        country: formData.country.trim(),
        dailyWorkHours: Number(formData.dailyWorkHours),
        yearsOfExperience: Number(formData.yearsOfExperience),
        hasDegree: Boolean(formData.hasDegree),
        field: Number(formData.field)
      };

      const response = await api.post('/Auth/SignUpJobSeeker', payload);

      toast({
        title: "Account Created!",
        description: "Welcome! Redirecting to jobs...",
      });

      // Optionally save token if returned
      if (response && response.token) {
        localStorage.setItem('token', response.token);
      }
      navigate('/seeker/dashboard');
    } catch (error: any) {
      if (error.status === 400) {
        // Handle validation errors from backend
        setErrors({ general: error.message || 'Validation failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <header className="border-b bg-card/30 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
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

      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Job Seeker Account</CardTitle>
            <CardDescription>Join our platform to find your dream job</CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">ID</Label>
                <Input
                  id="id"
                  type="number"
                  min="1"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  className={errors.id ? 'border-destructive' : ''}
                  placeholder="Enter your ID (integer)"
                />
                {errors.id && <p className="text-sm text-destructive">{errors.id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">First Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your first name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sirName">Last Name</Label>
                <Input
                  id="sirName"
                  placeholder="Enter your last name"
                  value={formData.sirName}
                  onChange={(e) => handleInputChange('sirName', e.target.value)}
                  className={errors.sirName ? 'border-destructive' : ''}
                />
                {errors.sirName && <p className="text-sm text-destructive">{errors.sirName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Country</Label>
                <div className={errors.country ? 'border rounded-md border-destructive' : ''}>
                  <BasicCombobox
                    options={Array.isArray(countries) ? countries : []}
                    value={formData.country}
                    onValueChange={(value) => handleInputChange('country', value)}
                    placeholder={loadingCountries ? "Loading countries..." : "Select country"}
                    emptyMessage={loadingCountries ? "Loading..." : "No country found."}
                    disabled={loadingCountries}
                  />
                </div>
                {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
              </div>

              <div className="space-y-2">
                <Label>Field</Label>
                <div className={errors.field ? 'border rounded-md border-destructive' : ''}>
                  <BasicCombobox
                    options={Array.isArray(jobFields) ? jobFields : []}
                    value={formData.field}
                    onValueChange={(value) => handleInputChange('field', value)}
                    placeholder="Select field"
                    emptyMessage="No field found."
                  />
                </div>
                {errors.field && <p className="text-sm text-destructive">{errors.field}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyWorkHours">Daily Work Hours (0-24)</Label>
                <Input
                  id="dailyWorkHours"
                  type="number"
                  min="0"
                  max="24"
                  placeholder="e.g., 8"
                  value={formData.dailyWorkHours}
                  onChange={(e) => handleInputChange('dailyWorkHours', e.target.value)}
                  className={errors.dailyWorkHours ? 'border-destructive' : ''}
                />
                {errors.dailyWorkHours && <p className="text-sm text-destructive">{errors.dailyWorkHours}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience (0-100)</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 5"
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                  className={errors.yearsOfExperience ? 'border-destructive' : ''}
                />
                {errors.yearsOfExperience && <p className="text-sm text-destructive">{errors.yearsOfExperience}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDegree"
                checked={formData.hasDegree}
                onCheckedChange={(checked) => handleInputChange('hasDegree', checked)}
              />
              <Label htmlFor="hasDegree">I have a degree</Label>
            </div>

            <div className="flex flex-col space-y-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/seeker/login')}
                >
                  Already have an account? Sign in
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