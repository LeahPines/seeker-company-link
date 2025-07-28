import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

interface CompanyProfile {
  code: string;
  name: string;
  email: string;
  rate: number;
}

interface CompanyProfileProps {
  profile: CompanyProfile | null;
}

export const CompanyProfileCard = ({ profile }: CompanyProfileProps) => {
  return (
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
  );
};
