import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { api } from '@/lib/api';
import { getUserId } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { useJobFields } from '@/hooks/use-job-fields';
import { SeekerProfileCard } from './SeekerProfileCard';
import { JobOffersList } from './JobOffersList';
import { JobOfferCard } from './JobOfferCard';

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
  isActive: boolean;
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
  const [activating, setActivating] = useState(false);

  const userId = getUserId();
  const { jobFields } = useJobFields();
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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForJob = async (offersCode: string | number) => {
    setApplying(String(offersCode));
    try {
      await api.put(`/JobSeeker/ApplyForJob/${offersCode}`);
      setJobOffers(prev =>
        prev.map(offer =>
          String(offer.offersCode) === String(offersCode)
            ? {
                ...offer,
                isApplied: true,
                applicationDate: new Date().toISOString()
              }
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

  const handleActivate = async () => {
    setActivating(true);
    try {
      await api.put('/JobSeeker/Activate');
      setProfile(prev => prev ? { ...prev, isActive: true } : null);
      toast({
        title: "Profile Activated!",
        description: "Your profile is now active and visible to employers",
      });
    } catch (error) {
      toast({
        title: "Activation Failed",
        description: "There was an error activating your profile",
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
  };

  const handleDeactivate = async () => {
    setActivating(true);
    try {
      await api.put('/JobSeeker/Deactivate');
      setProfile(prev => prev ? { ...prev, isActive: false } : null);
      toast({
        title: "Profile Deactivated",
        description: "Your profile is now hidden from employers",
      });
    } catch (error) {
      toast({
        title: "Deactivation Failed",
        description: "There was an error deactivating your profile",
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
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
            <SeekerProfileCard
              profile={profile}
              getFieldName={getFieldName}
              activating={activating}
              handleActivate={handleActivate}
              handleDeactivate={handleDeactivate}
            />
          </div>
          {/* Job Offers Section */}
          <div className="lg:col-span-2">
            <JobOffersList
              jobOffers={jobOffers}
              getFieldName={getFieldName}
              applying={applying}
              handleApplyForJob={handleApplyForJob}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
