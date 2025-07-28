import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useCountries } from '@/hooks/use-countries';
import { useJobFields } from '@/hooks/use-job-fields';
import { BasicCombobox } from '@/components/ui/basic-combobox';

interface JobFormData {
  code: string;
  field: string;
  country: string;
  workHours: string;
  minYearsExperience: string;
  requiresDegree: boolean;
  jobDescription: string;
}

interface JobFormProps {
  showJobForm: boolean;
  setShowJobForm: (show: boolean) => void;
  jobForm: JobFormData;
  setJobForm: (form: JobFormData | ((prev: JobFormData) => JobFormData)) => void;
  jobFormErrors: Record<string, string>;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const JobFormDialog = ({
  showJobForm,
  setShowJobForm,
  jobForm,
  setJobForm,
  jobFormErrors,
  submitting,
  onSubmit
}: JobFormProps) => {
  const { countries, loading: loadingCountries } = useCountries();
  const { jobFields } = useJobFields();

  return (
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
        
        <form onSubmit={onSubmit} className="space-y-6 mt-4">
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
  );
};
