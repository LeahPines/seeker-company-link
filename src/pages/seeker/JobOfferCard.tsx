import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MapPin, Clock, Target, GraduationCap, CheckCircle } from 'lucide-react';

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

const getMatchScoreColor = (score: number) => {
  const percentage = score * 100;
  if (percentage >= 80) return 'bg-success text-success-foreground';
  if (percentage >= 60) return 'bg-warning text-warning-foreground';
  return 'bg-muted text-muted-foreground';
};

export const JobOfferCard = ({
  offer,
  getFieldName,
  applying,
  handleApplyForJob
}: {
  offer: JobOffer;
  getFieldName: (fieldIndex: number) => string;
  applying: string | null;
  handleApplyForJob: (offersCode: string | number) => void;
}) => (
  <Card className="hover-lift">
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
            {offer.isApplied && (
              <Badge variant="outline" className="bg-success/10 text-success border-success">
                Applied
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
      {offer.isApplied && (
        <div className="mb-4 p-3 bg-success/5 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-success">
            <CheckCircle className="w-4 h-4" />
            <span>
              {offer.applicationDate 
                ? `Applied on ${new Date(offer.applicationDate).toLocaleDateString()}`
                : 'Application submitted'}
            </span>
          </div>
        </div>
      )}
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
