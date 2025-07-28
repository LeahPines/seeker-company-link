import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Users, X, MapPin, Clock, Target, GraduationCap } from 'lucide-react';
import { useJobFields } from '@/hooks/use-job-fields';

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

interface JobCardProps {
  job: Job;
  onViewCandidates: (jobCode: string, type: 'matching' | 'applied') => void;
  onMarkNoLongerSeeking: (jobCode: string) => void;
}

export const JobCard = ({ job, onViewCandidates, onMarkNoLongerSeeking }: JobCardProps) => {
  const { jobFields } = useJobFields();

  return (
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
              onClick={() => onViewCandidates(job.code, 'matching')}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Candidates
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onViewCandidates(job.code, 'applied')}
            >
              <Users className="w-4 h-4 mr-1" />
              View Applied Candidates
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onMarkNoLongerSeeking(job.code)}
            >
              <X className="w-4 h-4 mr-1" />
              No Longer Seeking
            </Button>
          </div>
        </div>

        <p className="text-foreground mb-4">{job.jobDescription}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{job.country}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{job.workHours}h/day</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span>{job.minYearsExperience}+ years</span>
          </div>
          <div className="flex items-center space-x-2">
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
  );
};
