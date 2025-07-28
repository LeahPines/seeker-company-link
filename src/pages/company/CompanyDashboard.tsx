import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { CompanyProfileCard } from '@/components/company/CompanyProfile';
import { QuickStatsCard } from '@/components/company/QuickStats';
import { JobFormDialog } from '@/components/company/JobForm';
import { JobsList } from '@/components/company/JobsList';
import { CandidatesModal } from '@/components/company/CandidatesModal';

interface CompanyProfile {
  code: string;
  name: string;
  email: string;
  rate: number;
}

interface Job {
  code: string;
  companyId: string;
  field: number;
  country: string;
  workHours: number;
  minYearsExperience: number;
  requiresDegree: boolean;
  jobDescription: string;
}

interface Candidate {
  id: number;
  name: string;
  sirName: string;
  email: string;
  country: string;
  yearsOfExperience: number;
  hasDegree: boolean;
  field: number;
  matchingScore?: number;
}

export const CompanyDashboard = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<{ [jobCode: string]: Candidate[] }>({});
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [candidateType, setCandidateType] = useState<'matching' | 'applied'>('matching');

  const [jobForm, setJobForm] = useState({
    code: '',
    field: '',
    country: '',
    workHours: '',
    minYearsExperience: '',
    requiresDegree: false,
    jobDescription: ''
  });
  const [jobFormErrors, setJobFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('=== DASHBOARD useEffect TRIGGERED ===');
    console.log('Component mounted, calling loadDashboardData');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    try {
      const profileResponse = await api.get(`/Company/GetCompanyById`);
      setProfile(profileResponse);
      
      let jobsResponse = [];
      try {
        jobsResponse = await api.get(`/Job/GetJobsForCompany`);
      } catch (jobError: any) {
        if (jobError.status === 404) {
          jobsResponse = [];
        } else {
          throw jobError;
        }
      }

      setJobs(jobsResponse || []);
      
      if (jobsResponse && Array.isArray(jobsResponse) && jobsResponse.length > 0) {
        let totalApps = 0;
        for (const job of jobsResponse) {
          try {
            const applicationsResponse = await api.get(`/Job/GetAppliedCandidatesWithDetails/${job.code}`);
            const count = Array.isArray(applicationsResponse) ? applicationsResponse.length : 0;
            totalApps += count;
          } catch (error) {
          }
        }
        setTotalApplications(totalApps);
      } else {
        setTotalApplications(0);
      }
    } catch (error) {
    } finally {
      console.log('Dashboard loading complete');
      setLoading(false);
    }
  };

  const loadCandidates = async (jobCode: string, type: 'matching' | 'applied') => {
    try {
      let endpoint = '';
      if (type === 'applied') {
        endpoint = `/Job/GetAppliedCandidatesWithDetails/${jobCode}`;
      } else {
        endpoint = `/Job/GetJobOffersWithCandidates/${jobCode}`;
      }
      const response = await api.get(endpoint);
      const mappedCandidates = Array.isArray(response)
        ? response.map((item: any) => ({
            id: item.candidateId,
            name: item.candidateName,
            sirName: item.candidateSirName,
            email: item.candidateEmail,
            country: item.candidateCountry,
            yearsOfExperience: item.candidateYearsOfExperience,
            hasDegree: item.candidateHasDegree,
            field: item.candidateField,
            matchingScore: item.matchingScore,
          }))
        : [];
      setCandidates(prev => ({ ...prev, [jobCode]: mappedCandidates }));
    } catch (error: any) {
      if (error.status === 404) {
        setCandidates(prev => ({ ...prev, [jobCode]: [] }));
      } else {
      }
    }
  };

  const handleViewCandidates = (jobCode: string, type: 'matching' | 'applied') => {
    setSelectedJob(jobCode);
    setCandidateType(type);
    loadCandidates(jobCode, type);
  };

  const handleCreateJob = () => {
    setShowJobForm(true);
  };

  const handleMarkNoLongerSeeking = async (jobCode: string) => {
    try {
      await api.delete(`/Job/NotSeekingWorkers/${jobCode}`);
      
      toast({
        title: "Job Marked as No Longer Seeking",
        description: "The job posting has been removed from active listings",
      });

      setJobs(prev => prev.filter(job => job.code !== jobCode));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark job as no longer seeking",
        variant: "destructive",
      });
    }
  };

  const validateJobForm = () => {
    const errors: Record<string, string> = {};

    if (!jobForm.code.trim()) errors.code = 'Job code is required';
    else {
      const codeNum = parseInt(jobForm.code);
      if (isNaN(codeNum) || codeNum < 1) errors.code = 'Job code must be a positive integer';
    }
    
    if (!jobForm.field) errors.field = 'Field is required';
    if (!jobForm.country) errors.country = 'Country is required';
    
    if (!jobForm.workHours) errors.workHours = 'Work hours is required';
    else {
      const hours = parseFloat(jobForm.workHours);
      if (isNaN(hours) || hours < 0.1 || hours > 24) errors.workHours = 'Must be between 0.1-24 hours';
    }
    
    if (!jobForm.minYearsExperience) errors.minYearsExperience = 'Minimum experience is required';
    else {
      const years = parseInt(jobForm.minYearsExperience);
      if (isNaN(years) || years < 0 || years > 100) errors.minYearsExperience = 'Must be between 0-100 years';
    }
    if (!jobForm.jobDescription.trim()) errors.jobDescription = 'Job description is required';

    setJobFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleJobFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateJobForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        code: parseInt(jobForm.code),
        field: parseInt(jobForm.field) || 0,
        country: jobForm.country,
        workHours: parseFloat(jobForm.workHours) || 0,
        minYearsExperience: parseInt(jobForm.minYearsExperience) || 0,
        requiresDegree: jobForm.requiresDegree,
        jobDescription: jobForm.jobDescription
      };

      await api.post('/Job/AddJob', payload);
      
      toast({
        title: "Job Posted!",
        description: "Your job posting is now live",
      });

      setShowJobForm(false);
      setJobForm({
        code: '',
        field: '',
        country: '',
        workHours: '',
        minYearsExperience: '',
        requiresDegree: false,
        jobDescription: ''
      });
      loadDashboardData();
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        setJobFormErrors({ general: error.message });
      } else {
        setJobFormErrors({ general: 'Failed to create job. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">Loading company dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Unable to Load Dashboard</h2>
            <p className="text-muted-foreground mb-4">
              There was an issue loading your company profile. Please try refreshing the page.
            </p>
            <Button onClick={() => {
              setLoading(true);
              loadDashboardData();
            }}>
              Retry Loading
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Company Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings and find talent</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Profile */}
          <div className="lg:col-span-1">
            <CompanyProfileCard profile={profile} />
            <QuickStatsCard activeJobs={jobs.length} totalApplications={totalApplications} />
          </div>

          {/* Jobs Section */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Job Postings</h2>
              <Button onClick={handleCreateJob}>Create Job</Button>
            </div>

            <JobsList
              jobs={jobs}
              onViewCandidates={handleViewCandidates}
              onMarkNoLongerSeeking={handleMarkNoLongerSeeking}
              onCreateJob={handleCreateJob}
            />

            <JobFormDialog
              showJobForm={showJobForm}
              setShowJobForm={setShowJobForm}
              jobForm={jobForm}
              setJobForm={setJobForm}
              jobFormErrors={jobFormErrors}
              submitting={submitting}
              onSubmit={handleJobFormSubmit}
            />

            <CandidatesModal
              selectedJob={selectedJob}
              candidates={candidates}
              candidateType={candidateType}
              onClose={() => setSelectedJob(null)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
