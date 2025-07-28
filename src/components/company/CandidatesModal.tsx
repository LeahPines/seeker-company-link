import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Users, MapPin, Target, GraduationCap } from 'lucide-react';
import { useJobFields } from '@/hooks/use-job-fields';

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

interface CandidatesModalProps {
  selectedJob: string | null;
  candidates: { [jobCode: string]: Candidate[] };
  candidateType: 'matching' | 'applied';
  onClose: () => void;
}

export const CandidatesModal = ({ 
  selectedJob, 
  candidates, 
  candidateType, 
  onClose 
}: CandidatesModalProps) => {
  const { jobFields } = useJobFields();

  if (!selectedJob || !candidates[selectedJob]) {
    return null;
  }

  return (
    <Dialog open={!!selectedJob} onOpenChange={onClose}>
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
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span>{candidate.country}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3 text-muted-foreground" />
                        <span>{candidate.yearsOfExperience} years</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>
                          {(() => {
                            if (Array.isArray(jobFields)) {
                              const found = jobFields.find(f => f && (String(f.value) === String(candidate.field) || Number(f.value) === Number(candidate.field)));
                              if (found && found.label) return found.label;
                            }
                            return `Unknown (field: ${candidate.field})`;
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
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
  );
};
