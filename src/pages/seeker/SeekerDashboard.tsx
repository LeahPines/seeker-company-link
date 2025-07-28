import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { api } from '@/lib/api';
import { getUserId } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { User, MapPin, Clock, GraduationCap, Briefcase, Target, CheckCircle } from 'lucide-react';
import { useJobFields } from '@/hooks/use-job-fields';

interface SeekerProfile {
  id: number;
  name: string;
  sirName: string;
  email: string;
  country: string;
  dailyWorkHours: number;
  yearsOfExperience: number;
  hasDegree: boolean;
  field: number;
}

interface JobOffer {
  offersCode: string;
  jobCode: number;
  jobDescription: string;
  matchingScore: number;
  isApplied: boolean;
  applicationDate: string | null;
  jobCompanyId: number;
  companyName?: string;
  jobField: number;
  jobCountry: string;
  jobWorkHours: number;
  jobMinYearsExperience: number;
  jobRequiresDegree: boolean;
}

export const SeekerDashboard = () => {
  const [profile, setProfile] = useState<SeekerProfile | null>(null);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  const userId = getUserId();
  const { jobFields } = useJobFields();

  // Helper function to get field name by index
  const getFieldName = (fieldIndex: number) => {
    return jobFields.find(field => field.value === fieldIndex.toString())?.label || 'Unknown Field';
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!userId) return;

    try {
      const [profileResponse, offersResponse] = await Promise.all([
        api.get('/JobSeeker/GetJobSeekerById'),
        api.get('/JobSeeker/FindMatchingJobsDetailed')
      ]);

      setProfile(profileResponse);
      setJobOffers(offersResponse || []);
      
      // API Response Analysis
      console.log('=== API RESPONSE ANALYSIS ===');
      console.log('Profile API Response Status: SUCCESS');
      console.log('Profile Data Type:', typeof profileResponse);
      console.log('Profile Keys:', profileResponse ? Object.keys(profileResponse) : 'null');
      
      console.log('Job Offers API Response Status: SUCCESS');
      console.log('Job Offers Data Type:', typeof offersResponse);
      console.log('Job Offers Is Array:', Array.isArray(offersResponse));
      console.log('Job Offers Length:', offersResponse?.length || 0);
      
      if (offersResponse && offersResponse.length > 0) {
        console.log('First Job Offer Keys:', Object.keys(offersResponse[0]));
        console.log('Sample Job Data:', offersResponse[0]);
      } else {
        console.warn('⚠️ NO JOB OFFERS RETURNED FROM BACKEND - This might indicate:');
        console.warn('1. No jobs in database');
        console.warn('2. Backend API not working properly');
        console.warn('3. Database connection issues');
        console.warn('4. Matching algorithm returning empty results');
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForJob = async (offersCode: string | number) => {
    setApplying(String(offersCode));
    console.log('=== APPLYING FOR JOB ===');
    console.log('Offers Code:', offersCode);
    console.log('Using PUT method (as per backend controller)');
    
    try {
      const response = await api.put(`/JobSeeker/ApplyForJob/${offersCode}`);
      console.log('✅ Apply Job API Response:', response);
      
      // Update the job offer status locally
      setJobOffers(prev => 
        prev.map(offer => 
          offer.offersCode === String(offersCode) 
            ? { ...offer, isApplied: true }
            : offer
        )
      );

      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the company",
      });
    } catch (error) {
      console.error('❌ Apply Job API Error:', error);
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application",
        variant: "destructive",
      });
    } finally {
      setApplying(null);
    }
  };

  const getMatchScoreColor = (score: number) => {
    const percentage = score * 100; // Convert decimal to percentage
    if (percentage >= 80) return 'bg-success text-success-foreground';
    if (percentage >= 60) return 'bg-warning text-warning-foreground';
    return 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Seeker Dashboard</h1>
          <p className="text-muted-foreground">Find your perfect job match</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Your Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile && (
                  <>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {profile.name} {profile.sirName}
                      </h3>
                      <p className="text-muted-foreground">{profile.email}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.country}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span>{getFieldName(profile.field)}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.dailyWorkHours}h/day available</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.yearsOfExperience} years experience</span>
                      </div>

                      {profile.hasDegree && (
                        <div className="flex items-center space-x-2 text-sm">
                          <GraduationCap className="w-4 h-4 text-success" />
                          <span className="text-success">Has Degree</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Job Offers Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Job Opportunities</CardTitle>
                <p className="text-muted-foreground">
                  {jobOffers.length} job{jobOffers.length !== 1 ? 's' : ''} matched to your profile
                </p>
              </CardHeader>
              <CardContent>
                {jobOffers.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Job Offers Yet</h3>
                    <p className="text-muted-foreground">Check back later for new opportunities!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobOffers.map((offer) => {
                      // Debug logging for each offer
                      console.log('Rendering offer:', offer);
                      
                      // Skip rendering if essential fields are missing
                      if (!offer.offersCode) {
                        console.warn('Skipping offer with missing code:', offer);
                        return null;
                      }
                      
                      return (
                      <Card key={offer.offersCode} className="hover-lift">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {getFieldName(offer.jobField)} Position
                                </h3>
                                {offer.matchingScore !== undefined && offer.matchingScore !== null && (
                                  <Badge className={getMatchScoreColor(offer.matchingScore)}>
                                    {Math.round(offer.matchingScore * 100)}% Match
                                  </Badge>
                                )}
                              </div>
                              {offer.companyName && (
                                <p className="text-muted-foreground mb-3">{offer.companyName}</p>
                              )}
                            </div>
                          </div>

                          <p className="text-foreground mb-4 leading-relaxed">
                            {offer.jobDescription || 'No job description available'}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{offer.jobCountry || 'Location not specified'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{offer.jobWorkHours || 0}h/day</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4 text-muted-foreground" />
                              <span>{offer.jobMinYearsExperience || 0}+ years</span>
                            </div>
                            {offer.jobRequiresDegree && (
                              <div className="flex items-center space-x-2">
                                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                <span>Degree required</span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end">
                            {offer.isApplied ? (
                              <Button variant="outline" disabled className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4" />
                                <span>Applied</span>
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleApplyForJob(offer.offersCode)}
                                disabled={applying === String(offer.offersCode)}
                              >
                                {applying === String(offer.offersCode) ? (
                                  <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Applying...
                                  </>
                                ) : (
                                  'Apply Now'
                                )}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};