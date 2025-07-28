import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { JobCard } from './JobCard';

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

interface JobsListProps {
  jobs: Job[];
  onViewCandidates: (jobCode: string, type: 'matching' | 'applied') => void;
  onMarkNoLongerSeeking: (jobCode: string) => void;
  onCreateJob: () => void;
}

export const JobsList = ({ 
  jobs, 
  onViewCandidates, 
  onMarkNoLongerSeeking, 
  onCreateJob 
}: JobsListProps) => {
  return (
    <>
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Job Postings</h3>
            <p className="text-muted-foreground mb-4">Create your first job posting to start finding candidates</p>
            <Button onClick={onCreateJob}>Post Your First Job</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <JobCard
              key={job.code}
              job={job}
              onViewCandidates={onViewCandidates}
              onMarkNoLongerSeeking={onMarkNoLongerSeeking}
            />
          ))}
        </div>
      )}
    </>
  );
};
