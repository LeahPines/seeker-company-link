import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { api } from '@/lib/api';
import { getUserId } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { Building2, Plus, Users, Eye, X, MapPin, Clock, Target, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

import { useCountries } from '@/hooks/use-countries';
import { useJobFields } from '@/hooks/use-job-fields';
import { BasicCombobox } from '@/components/ui/basic-combobox';

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
};


export const CompanyDashboard = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<{ [jobCode: string]: Candidate[] }>({});
  const [totalApplications, setTotalApplications] = useState(0);
  // Update total applications whenever candidates state changes
  useEffect(() => {
    const total = Object.values(candidates).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    setTotalApplications(total);
  }, [candidates]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [candidateType, setCandidateType] = useState<'matching' | 'applied'>('matching');
  const { countries, loading: loadingCountries } = useCountries();
  const { jobFields } = useJobFields();

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

  const userId = getUserId();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!userId) return;

    try {
      // Both APIs now use /api prefix and get ID from token
      const [profileResponse, jobsResponse] = await Promise.all([
        api.get(`/Company/GetCompanyById`),
        api.get(`/Job/GetJobsForCompany`)
      ]);

      setProfile(profileResponse);
      setJobs(jobsResponse || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
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
      console.error(`Failed to load candidates:`, error);
    }
  }
};
  const validateJobForm = () => {
    const errors: Record<string, string> = {};

    // Job code must be a valid positive integer (per backend DTO)
    if (!jobForm.code.trim()) errors.code = 'Job code is required';
    else {
      const codeNum = parseInt(jobForm.code);
      if (isNaN(codeNum) || codeNum < 1) errors.code = 'Job code must be a positive integer';
    }
    
    if (!jobForm.field) errors.field = 'Field is required';
    if (!jobForm.country) errors.country = 'Country is required';
    
    // Work hours must be a double between 0.1 and 24 (per backend DTO)
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

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateJobForm()) return;

    setSubmitting(true);
    try {
      // Match backend DTO requirements exactly
      const payload = {
        code: parseInt(jobForm.code),  // Backend expects int, not string
        field: parseInt(jobForm.field) || 0,  // Backend expects JobField enum (int)
        country: jobForm.country,
        workHours: parseFloat(jobForm.workHours) || 0,  // Backend expects double
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
      console.error('Job creation error:', error);
      if (error.status === 400 && error.message) {
        setJobFormErrors({ general: error.message });
      } else {
        setJobFormErrors({ general: 'Failed to create job. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivateJob = async (jobCode: string) => {
    try {
      await api.delete(`/Job/NotSeekingWorkers/${jobCode}`);
      
      toast({
        title: "Job Deactivated",
        description: "The job posting has been removed",
      });

      setJobs(prev => prev.filter(job => job.code !== jobCode));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate job",
        variant: "destructive",
      });
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
          <h1 className="text-3xl font-bold mb-2">Company Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings and find talent</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Profile */}
          <div className="lg:col-span-1">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Company Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile && (
                  <>
                    <div>
                      <h3 className="font-semibold text-lg">{profile.name}</h3>
                      <p className="text-muted-foreground">{profile.email}</p>
                      <p className="text-sm text-muted-foreground">Code: {profile.code}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Rating:</span>
                      <Badge variant="secondary">{profile.rate}/5</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Jobs</span>
                  <span className="font-semibold">{jobs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Applications</span>
                  <span className="font-semibold">{totalApplications}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs Section */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Job Postings</h2>
              <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Post New Job</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Job Posting</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to create a new job posting and start finding qualified candidates.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateJob} className="space-y-6 mt-4">
                    {jobFormErrors.general && (
                      <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                        {jobFormErrors.general}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="code">Job Code</Label>
                        <Input
                          id="code"
                          value={jobForm.code}
                          onChange={(e) => setJobForm(prev => ({ ...prev, code: e.target.value }))}
                          className={jobFormErrors.code ? 'border-destructive' : ''}
                        />
                        {jobFormErrors.code && <p className="text-sm text-destructive">{jobFormErrors.code}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Field</Label>
                        <div className={jobFormErrors.field ? 'border rounded-md border-destructive' : ''}>
                          <BasicCombobox
                            options={Array.isArray(jobFields) ? jobFields : []}
                            value={jobForm.field}
                            onValueChange={(value) => setJobForm(prev => ({ ...prev, field: value }))}
                            placeholder="Select field"
                            emptyMessage="No field found."
                          />
                        </div>
                        {jobFormErrors.field && <p className="text-sm text-destructive">{jobFormErrors.field}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <div className={jobFormErrors.country ? 'border rounded-md border-destructive' : ''}>
                          <BasicCombobox
                            options={Array.isArray(countries) ? countries : []}
                            value={jobForm.country}
                            onValueChange={(value) => setJobForm(prev => ({ ...prev, country: value }))}
                            placeholder={loadingCountries ? "Loading countries..." : "Select country"}
                            emptyMessage={loadingCountries ? "Loading..." : "No country found."}
                            disabled={loadingCountries}
                          />
                        </div>
                        {jobFormErrors.country && <p className="text-sm text-destructive">{jobFormErrors.country}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="workHours">Work Hours/Day</Label>
                        <Input
                          id="workHours"
                          type="number"
                          min="0.1"
                          max="24"
                          step="0.1"
                          value={jobForm.workHours}
                          onChange={(e) => setJobForm(prev => ({ ...prev, workHours: e.target.value }))}
                          className={jobFormErrors.workHours ? 'border-destructive' : ''}
                        />
                        {jobFormErrors.workHours && <p className="text-sm text-destructive">{jobFormErrors.workHours}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minYearsExperience">Minimum Years Experience</Label>
                      <Input
                        id="minYearsExperience"
                        type="number"
                        min="0"
                        max="100"
                        value={jobForm.minYearsExperience}
                        onChange={(e) => setJobForm(prev => ({ ...prev, minYearsExperience: e.target.value }))}
                        className={jobFormErrors.minYearsExperience ? 'border-destructive' : ''}
                      />
                      {jobFormErrors.minYearsExperience && <p className="text-sm text-destructive">{jobFormErrors.minYearsExperience}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requiresDegree"
                        checked={jobForm.requiresDegree}
                        onCheckedChange={(checked) => setJobForm(prev => ({ ...prev, requiresDegree: !!checked }))}
                      />
                      <Label htmlFor="requiresDegree">Requires degree</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobDescription">Job Description</Label>
                      <Textarea
                        id="jobDescription"
                        rows={4}
                        value={jobForm.jobDescription}
                        onChange={(e) => setJobForm(prev => ({ ...prev, jobDescription: e.target.value }))}
                        className={jobFormErrors.jobDescription ? 'border-destructive' : ''}
                        placeholder="Describe the role, responsibilities, and requirements..."
                      />
                      {jobFormErrors.jobDescription && <p className="text-sm text-destructive">{jobFormErrors.jobDescription}</p>}
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowJobForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Creating...
                          </>
                        ) : (
                          'Create Job'
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {jobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Job Postings</h3>
                  <p className="text-muted-foreground mb-4">Create your first job posting to start finding candidates</p>
                  <Button onClick={() => setShowJobForm(true)}>Post Your First Job</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <Card key={job.code} className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            {(Array.isArray(jobFields) && jobFields.find(f => f && f.value === String(job.field)))?.label || 'Unknown'} Position
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">Job Code: {job.code}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedJob(job.code);
                              setCandidateType('matching');
                              loadCandidates(job.code, 'matching');
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Candidates
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedJob(job.code);
                              setCandidateType('applied');
                              loadCandidates(job.code, 'applied');
                            }}
                          >
                            <Users className="w-4 h-4 mr-1" />
                            View Applied Candidates
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeactivateJob(job.code)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Deactivate
                          </Button>
                        </div>
                      </div>

                      <p className="text-foreground mb-4">{job.jobDescription}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div key={`job-location-${job.code}`} className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{job.country}</span>
                        </div>
                        <div key={`job-hours-${job.code}`} className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{job.workHours}h/day</span>
                        </div>
                        <div key={`job-experience-${job.code}`} className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span>{job.minYearsExperience}+ years</span>
                        </div>
                        <div key={`job-degree-${job.code}`} className="flex items-center space-x-2">
                          {job.requiresDegree ? (
                            <>
                              <GraduationCap className="w-4 h-4 text-muted-foreground" />
                              <span>Degree required</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">No degree required</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Candidates Modal */}
            {selectedJob && candidates[selectedJob] && (
              <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {candidateType === 'applied'
                        ? `Applied Candidates for Job ${selectedJob}`
                        : `Matching Candidates for Job ${selectedJob}`}
                    </DialogTitle>
                    <DialogDescription>
                      {candidateType === 'applied'
                        ? 'Review candidates who have applied for this position.'
                        : 'Review matching candidates for this position. You can see their qualifications and match scores.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    {candidates[selectedJob].length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {candidateType === 'applied'
                            ? 'No candidates have applied for this position'
                            : 'No candidates found for this position'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {candidates[selectedJob].map((candidate) => (
                          <Card key={candidate.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold">
                                    {candidate.name} {candidate.sirName}
                                  </h4>
                                  <p className="text-muted-foreground text-sm">{candidate.email}</p>
                                </div>
                                {candidate.matchingScore !== undefined && (
                                  <Badge className="bg-primary/10 text-primary">
                                    {Math.round(candidate.matchingScore * 100)}% Match
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div key={`location-${candidate.id}`} className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  <span>{candidate.country}</span>
                                </div>
                                <div key={`experience-${candidate.id}`} className="flex items-center space-x-1">
                                  <Target className="w-3 h-3 text-muted-foreground" />
                                  <span>{candidate.yearsOfExperience} years</span>
                                </div>
                                <div key={`field-${candidate.id}`} className="flex items-center space-x-1">
                                  <span>
                                    {(() => {
                                      if (Array.isArray(jobFields)) {
                                        const found = jobFields.find(f => f && (String(f.value) === String(candidate.field) || Number(f.value) === Number(candidate.field)));
                                        if (found && found.label) return found.label;
                                      }
                                      // Show the field value for debugging
                                      return `Unknown (field: ${candidate.field})`;
                                    })()}
                                  </span>
                                </div>
                                <div key={`degree-${candidate.id}`} className="flex items-center space-x-1">
                                  {candidate.hasDegree ? (
                                    <>
                                      <GraduationCap className="w-3 h-3 text-success" />
                                      <span className="text-success">Has Degree</span>
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">No degree</span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};