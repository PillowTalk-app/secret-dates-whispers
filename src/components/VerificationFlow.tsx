import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Camera, User, Phone, Mail } from "lucide-react";

interface VerificationFlowProps {
  onComplete: (userData: { name: string; gender: 'male' | 'female'; phone: string; email: string }) => void;
}

export const VerificationFlow = ({ onComplete }: VerificationFlowProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    gender: '' as 'male' | 'female' | '',
    phone: '',
    email: '',
    idVerified: false,
    photoVerified: false
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleComplete = () => {
    if (formData.name && formData.gender && formData.phone && formData.email) {
      onComplete({
        name: formData.name,
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
            <Shield className="h-8 w-8 text-accent mr-2" />
            <div className="text-center">
              <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Pillow Talk
              </span>
              <p className="text-xs text-muted-foreground">not gossip just experience</p>
            </div>
          </div>
          <CardTitle className="text-xl">Identity Verification</CardTitle>
          <CardDescription>Step {step} of 4 - Secure & Discreet</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <Input
                  placeholder="Enter your real name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-card/50 border-border/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={formData.gender === 'male' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, gender: 'male' }))}
                    className="h-12"
                  >
                    Male
                  </Button>
                  <Button
                    variant={formData.gender === 'female' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, gender: 'female' }))}
                    className="h-12"
                  >
                    Female
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-card/50 border-border/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-card/50 border-border/50"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <User className="h-12 w-12 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">ID Verification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a photo of your government-issued ID
                </p>
                <Button
                  variant="luxury"
                  onClick={() => setFormData(prev => ({ ...prev, idVerified: true }))}
                  className="w-full h-12"
                >
                  {formData.idVerified ? '✓ ID Verified' : 'Upload ID'}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <Camera className="h-12 w-12 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Photo Verification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Take a selfie to verify your identity
                </p>
                <Button
                  variant="luxury"
                  onClick={() => setFormData(prev => ({ ...prev, photoVerified: true }))}
                  className="w-full h-12 mb-4"
                >
                  {formData.photoVerified ? '✓ Photo Verified' : 'Take Selfie'}
                </Button>
                
                {formData.idVerified && formData.photoVerified && (
                  <div className="space-y-3">
                    <Badge variant="secondary" className="bg-accent/20 text-accent">
                      ✓ Verification Complete
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Your identity has been securely verified
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!formData.name || !formData.gender)) ||
                  (step === 2 && (!formData.phone || !formData.email))
                }
                className="ml-auto"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!formData.idVerified || !formData.photoVerified}
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