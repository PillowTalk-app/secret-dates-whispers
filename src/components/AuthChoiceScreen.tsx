import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthChoiceScreenProps {
  onSignUp: () => void;
  onSignIn: () => void;
}

export const AuthChoiceScreen = ({ onSignUp, onSignIn }: AuthChoiceScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome to Pillow Talk
          </h1>
          <p className="text-muted-foreground">
            Choose how you'd like to continue
          </p>
        </div>

        <div className="space-y-4">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">New to Pillow Talk?</CardTitle>
              <CardDescription>
                Create a new account and join our community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={onSignUp}
                className="w-full h-12"
                variant="default"
              >
                Sign Up
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Already have an account?</CardTitle>
              <CardDescription>
                Sign in to your existing account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={onSignIn}
                className="w-full h-12"
                variant="outline"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};