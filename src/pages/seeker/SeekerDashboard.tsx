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
  jobDescription: string;
  matchingScore: number;
  isApplied: boolean;
  companyName?: string;
  field: number;
  country: string;
  workHours: number;
  minYearsExperience: number;
  requiresDegree: boolean;
}

const FIELD_NAMES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
  'Sales', 'Engineering', 'Design', 'Operations', 'Human Resources'
];

export const SeekerDashboard = () => {
  const [profile, setProfile] = useState<SeekerProfile | null>(null);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  const userId = getUserId();

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
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForJob = async (offersCode: string) => {
    setApplying(offersCode);
    try {
      await api.post(`/JobSeeker/ApplyForJob/${offersCode}`);
      
      // Update the job offer status locally
      setJobOffers(prev => 
        prev.map(offer => 
          offer.offersCode === offersCode 
            ? { ...offer, isApplied: true }
            : offer
        )
      );

      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the company",
      });
    } catch (error) {
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
    if (score >= 80) return 'bg-success text-success-foreground';
    if (score >= 60) return 'bg-warning text-warning-foreground';
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
                        <span>{FIELD_NAMES[profile.field] || 'Unknown Field'}</span>
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
                    {jobOffers.map((offer) => (
                      <Card key={offer.offersCode} className="hover-lift">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {FIELD_NAMES[offer.field]} Position
                                </h3>
                                <Badge className={getMatchScoreColor(offer.matchingScore)}>
                                  {offer.matchingScore}% Match
                                </Badge>
                              </div>
                              {offer.companyName && (
                                <p className="text-muted-foreground mb-3">{offer.companyName}</p>
                              )}
                            </div>
                          </div>

                          <p className="text-foreground mb-4 leading-relaxed">
                            {offer.jobDescription}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{offer.country}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{offer.workHours}h/day</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4 text-muted-foreground" />
                              <span>{offer.minYearsExperience}+ years</span>
                            </div>
                            {offer.requiresDegree && (
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
                                disabled={applying === offer.offersCode}
                              >
                                {applying === offer.offersCode ? (
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
                    ))}
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