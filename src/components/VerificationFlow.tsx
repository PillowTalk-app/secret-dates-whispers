import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Camera, User, Phone, Mail, Scan, Upload } from "lucide-react";

interface VerificationFlowProps {
  onComplete: (userData: { name: string; screenName: string; gender: 'male' | 'female'; phone: string; email: string }) => void;
}

export const VerificationFlow = ({ onComplete }: VerificationFlowProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    screenName: '',
    gender: '' as 'male' | 'female' | '',
    phone: '',
    email: '',
    faceVerified: false
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleComplete = () => {
    if (formData.name && formData.screenName && formData.gender && formData.phone && formData.email && formData.faceVerified) {
      onComplete({
        name: formData.name,
        screenName: formData.screenName,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card shadow-luxury border-border/50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/lovable-uploads/a3ca0fb5-905f-470d-ac61-7e26940cc492.png" alt="Pillow Talk" className="h-20 w-20 object-contain mr-3" />
            <div className="text-center">
              <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Pillow Talk
              </span>
              <p className="text-xs text-muted-foreground">Not gossip just experience</p>
            </div>
          </div>
          <CardTitle className="text-xl">Identity Verification</CardTitle>
          <CardDescription>Step {step} of 3 - Secure & Discreet</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <p className="text-sm text-muted-foreground">Tell us a bit about yourself</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    placeholder="Enter your real name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-card/50 border-border/50 h-12"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your real name for a safe, authentic experience
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Number
                  </label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-card/50 border-border/50 h-12"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For account security and verification
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">I am...</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={formData.gender === 'male' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, gender: 'male' }))}
                      className="h-16 flex flex-col items-center justify-center space-y-1"
                    >
                      <User className="h-5 w-5" />
                      <span>Male</span>
                    </Button>
                    <Button
                      variant={formData.gender === 'female' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, gender: 'female' }))}
                      className="h-16 flex flex-col items-center justify-center space-y-1"
                    >
                      <User className="h-5 w-5" />
                      <span>Female</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This determines who can see your profile
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Mail className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Email Verification</h3>
                <p className="text-sm text-muted-foreground">We'll keep your information secure</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-card/50 border-border/50 h-12"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Used for account recovery and important notifications
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Creative Screen Name</label>
                  <Input
                    placeholder="e.g., MidnightDreamer, SunsetWanderer"
                    value={formData.screenName}
                    onChange={(e) => setFormData(prev => ({ ...prev, screenName: e.target.value }))}
                    className="bg-card/50 border-border/50 h-12"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This is how others will see you - be creative and keep it discreet
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium mb-1">Privacy Promise</h4>
                      <p className="text-xs text-muted-foreground">
                        Your email will never be shared or used for marketing. We only send security alerts and account notifications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Camera className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Face Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Verify your identity to ensure authentic connections
                </p>
              </div>

              <div className="space-y-4">
                {!formData.faceVerified ? (
                  <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-6 border border-border/50">
                    <div className="aspect-square bg-muted/50 rounded-lg border-2 border-dashed border-border/50 flex flex-col items-center justify-center mb-4">
                      <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        Position your face in the frame
                      </p>
                    </div>
                    
                    <div className="space-y-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>Make sure your face is clearly visible</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>Remove sunglasses and hats</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>Use good lighting</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-8 w-8 text-accent" />
                    </div>
                    <Badge variant="secondary" className="bg-accent/20 text-accent mb-2">
                      ✓ Verification Complete
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Your identity has been securely verified
                    </p>
                  </div>
                )}

                <Button
                  variant={formData.faceVerified ? "outline" : "luxury"}
                  onClick={() => setFormData(prev => ({ ...prev, faceVerified: true }))}
                  className="w-full h-12"
                  disabled={formData.faceVerified}
                >
                  {formData.faceVerified ? '✓ Face Verified' : 'Start Camera Verification'}
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!formData.name || !formData.gender || !formData.phone)) ||
                  (step === 2 && (!formData.email || !formData.screenName))
                }
                className="ml-auto"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!formData.faceVerified}
                className="ml-auto"
              >
                Enter App
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};