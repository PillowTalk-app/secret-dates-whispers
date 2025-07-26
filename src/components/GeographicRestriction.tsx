import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface GeographicRestrictionProps {
  children: React.ReactNode;
}

export const GeographicRestriction = ({ children }: GeographicRestrictionProps) => {
  const [isRestricted, setIsRestricted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        // Use a free IP geolocation service
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Check if user is in California
        if (data.region === 'California' || data.region_code === 'CA') {
          setIsRestricted(true);
        }
      } catch (error) {
        console.log('Location check failed:', error);
        // If geolocation fails, allow access
      } finally {
        setIsLoading(false);
      }
    };

    checkLocation();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isRestricted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Service Not Available</h1>
              <p className="text-muted-foreground">
                We do not currently serve the California area. This service is not available in your location.
              </p>
              <p className="text-sm text-muted-foreground">
                We apologize for any inconvenience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};