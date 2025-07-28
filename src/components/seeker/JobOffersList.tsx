import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { JobOfferCard } from './JobOfferCard';

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

export const JobOffersList = ({
  jobOffers,
  getFieldName,
  applying,
  handleApplyForJob,
}: {
  jobOffers: JobOffer[];
  getFieldName: (fieldIndex: number) => string;
  applying: string | null;
  handleApplyForJob: (offersCode: string | number) => void;
}) => (
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
            <JobOfferCard
              key={`${offer.offersCode}-${offer.isApplied}`}
              offer={offer}
              getFieldName={getFieldName}
              applying={applying}
              handleApplyForJob={handleApplyForJob}
            />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);
