import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { User, MapPin, Briefcase, Clock, Target, GraduationCap } from 'lucide-react';

interface SeekerProfile {
  id: number;
  name: string;
  sirName: string;
  email: string;
  country: string;
  dailyWorkHours: number;
  yearsOfExperience: number;
  hasDegree: boolean;
  field: number;
  isActive: boolean;
}

export const SeekerProfileCard = ({
  profile,
  getFieldName,
  activating,
  handleActivate,
  handleDeactivate
}: {
  profile: SeekerProfile | null;
  getFieldName: (fieldIndex: number) => string;
  activating: boolean;
  handleActivate: () => void;
  handleDeactivate: () => void;
}) => (
  <Card className="card-hover">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <User className="w-5 h-5" />
        <span>Your Profile</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {profile && (
        <>
          <div>
            <h3 className="font-semibold text-lg">
              {profile.name} {profile.sirName}
            </h3>
            <p className="text-muted-foreground">{profile.email}</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{profile.country}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span>{getFieldName(profile.field)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{profile.dailyWorkHours}h/day available</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span>{profile.yearsOfExperience} years experience</span>
            </div>
            {profile.hasDegree && (
              <div className="flex items-center space-x-2 text-sm">
                <GraduationCap className="w-4 h-4 text-success" />
                <span className="text-success">Has Degree</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${profile.isActive ? 'bg-success' : 'bg-muted-foreground'}`}></div>
              <span className={profile.isActive ? 'text-success' : 'text-muted-foreground'}>
                {profile.isActive ? 'Profile Active' : 'Profile Inactive'}
              </span>
            </div>
          </div>
          <div className="pt-4 border-t">
            <Button
              onClick={profile.isActive ? handleDeactivate : handleActivate}
              disabled={activating}
              variant={profile.isActive ? "outline" : "default"}
              className="w-full"
            >
              {activating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {profile.isActive ? 'Deactivating...' : 'Activating...'}
                </>
              ) : (
                profile.isActive ? 'Deactivate Profile' : 'Activate Profile'
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {profile.isActive 
                ? 'Deactivating will hide your profile from employers'
                : 'Activating will make your profile visible to employers'
              }
            </p>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);
