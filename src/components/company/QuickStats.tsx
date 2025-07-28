import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickStatsProps {
  activeJobs: number;
  totalApplications: number;
}

export const QuickStatsCard = ({ activeJobs, totalApplications }: QuickStatsProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Active Jobs</span>
          <span className="font-semibold">{activeJobs}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Applications</span>
          <span className="font-semibold">{totalApplications}</span>
        </div>
      </CardContent>
    </Card>
  );
};
