import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Camera, User, Phone, Mail, Scan, Upload } from "lucide-react";
import pillowLogo from "@/assets/pillow-talk-logo.png";

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
    idUploaded: false,
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
            <img src={pillowLogo} alt="Pillow Talk" className="h-20 w-20 object-contain mr-3" />
            <div className="text-center">
              <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Pillow Talk
              </span>
              <p className="text-xs text-muted-foreground">Not gossip just experience</p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  Used for account recovery and important notifications
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <Scan className="h-12 w-12 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">ID Document Scan</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a clear photo of your government-issued ID (Driver's License, Passport, or State ID)
                </p>
                
                <div className="border-2 border-dashed border-border/50 rounded-lg p-8 mb-4 hover:border-accent/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop your ID or click to browse</p>
                  <Button
                    variant="outline"
                    onClick={() => setFormData(prev => ({ ...prev, idUploaded: true }))}
                    className="mt-2"
                  >
                    {formData.idUploaded ? '✓ ID Uploaded' : 'Choose File'}
                  </Button>
                </div>
                
                {formData.idUploaded && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                    <p className="text-sm text-accent">✓ Document uploaded successfully</p>
                    <p className="text-xs text-muted-foreground mt-1">Your information is encrypted and secure</p>
                  </div>
                )}
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
                
                {formData.idUploaded && formData.photoVerified && (
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
                  (step === 1 && (!formData.name || !formData.gender || !formData.phone)) ||
                  (step === 2 && !formData.email) ||
                  (step === 3 && !formData.idUploaded)
                }
                className="ml-auto"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!formData.idUploaded || !formData.photoVerified}
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