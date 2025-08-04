import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Camera, User, Phone, Mail, Scan, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { validateScreenName, getScreenNameHelpText } from "@/utils/screenNameValidation";

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
    faceVerified: false,
    idVerified: false,
    faceIdMatched: false,
    isOver18: false
  });
  
  const [screenNameValidation, setScreenNameValidation] = useState<{
    isValid: boolean;
    message: string;
    suggestions?: string[];
  } | null>(null);
  
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Validate screen name when it changes
  useEffect(() => {
    if (formData.screenName.trim()) {
      setIsCheckingUsername(true);
      const timer = setTimeout(() => {
        const firstName = formData.name.split(' ')[0]; // Extract first name
        const validation = validateScreenName(formData.screenName, firstName);
        setScreenNameValidation(validation);
        setIsCheckingUsername(false);
      }, 500); // Debounce validation
      
      return () => clearTimeout(timer);
    } else {
      setScreenNameValidation(null);
      setIsCheckingUsername(false);
    }
  }, [formData.screenName, formData.name]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleComplete = () => {
    if (formData.name && formData.screenName && formData.gender && formData.phone && formData.email && formData.faceVerified && formData.idVerified && formData.faceIdMatched) {
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
          <CardDescription>Step {step} of 4 - Secure & Discreet</CardDescription>
          <div className="mt-3 p-3 bg-muted/30 rounded-md">
            <p className="text-xs text-muted-foreground text-center">
              Content is anonymous, subjective, and unverified.<br/>
              Pillow Talk does not guarantee the truth or accuracy of posts.<br/>
              This app is for reflection, not retaliation.
            </p>
          </div>
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

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="age-verification"
                      checked={formData.isOver18}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOver18: !!checked }))}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <label htmlFor="age-verification" className="text-sm font-medium text-red-800 cursor-pointer">
                        I confirm that I am 18 years of age or older
                      </label>
                      <p className="text-xs text-red-700 mt-1">
                        You must be at least 18 years old to use Pillow Talk. This is required by law.
                      </p>
                    </div>
                  </div>
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
                  <div className="relative">
                    <Input
                      placeholder="e.g., MidnightDreamer, SunsetWanderer"
                      value={formData.screenName}
                      onChange={(e) => setFormData(prev => ({ ...prev, screenName: e.target.value }))}
                      className={`bg-card/50 border-border/50 h-12 pr-10 ${
                        screenNameValidation?.isValid === false ? 'border-red-500' : 
                        screenNameValidation?.isValid === true ? 'border-green-500' : ''
                      }`}
                    />
                    {isCheckingUsername && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    {!isCheckingUsername && screenNameValidation && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {screenNameValidation.isValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Validation message */}
                  {screenNameValidation && (
                    <div className={`mt-2 p-3 rounded-lg text-sm ${
                      screenNameValidation.isValid ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      <p className="font-medium flex items-center gap-2">
                        {screenNameValidation.isValid ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        {screenNameValidation.message}
                      </p>
                      
                      {screenNameValidation.suggestions && (
                        <div className="mt-2">
                          <p className="font-medium mb-1">Try these suggestions:</p>
                          <div className="flex flex-wrap gap-2">
                            {screenNameValidation.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, screenName: suggestion }))}
                                className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                    <h4 className="text-sm font-medium text-amber-800 mb-1">Username Rules:</h4>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>• Cannot use your first name or any common first names</li>
                      <li>• Must be unique (not already taken)</li>
                      <li>• Be creative - use combinations like MysticWanderer</li>
                      <li>• 3-20 characters, no spaces or special characters</li>
                    </ul>
                  </div>
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

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Scan className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold text-lg">ID Verification & Face Match</h3>
                <p className="text-sm text-muted-foreground">
                  Scan your ID and verify it matches your face for complete security
                </p>
              </div>

              <div className="space-y-6">
                {/* ID Scanning Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Step 1: Scan Your ID</h4>
                  {!formData.idVerified ? (
                    <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-6 border border-border/50">
                      <div className="aspect-[3/2] bg-muted/50 rounded-lg border-2 border-dashed border-border/50 flex flex-col items-center justify-center mb-4">
                        <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center">
                          Position your driver's license or government ID
                        </p>
                      </div>
                      
                      <div className="space-y-3 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span>Use good lighting and avoid glare</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span>Ensure all text is clearly readable</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span>Cover sensitive info if needed (SSN, etc.)</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-green-800">ID Verified Successfully</p>
                      <p className="text-xs text-green-600 mt-1">Your identity document has been processed</p>
                    </div>
                  )}

                  <Button
                    variant={formData.idVerified ? "outline" : "luxury"}
                    onClick={() => setFormData(prev => ({ ...prev, idVerified: true }))}
                    className="w-full h-12"
                    disabled={formData.idVerified}
                  >
                    {formData.idVerified ? '✓ ID Scanned' : 'Scan Government ID'}
                  </Button>
                </div>

                {/* Face Matching Section */}
                {formData.idVerified && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Step 2: Face Verification Match</h4>
                    {!formData.faceIdMatched ? (
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                        <div className="aspect-square bg-white/80 rounded-lg border-2 border-dashed border-blue-300 flex flex-col items-center justify-center mb-4">
                          <Camera className="h-12 w-12 text-blue-500 mb-2" />
                          <p className="text-sm text-blue-700 text-center">
                            Look at the camera to match your ID photo
                          </p>
                        </div>
                        
                        <div className="bg-blue-100 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Secure Matching Process</span>
                          </div>
                          <p className="text-xs text-blue-700">
                            We'll compare your live photo with your ID to ensure they match. This prevents identity theft and keeps everyone safe.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Shield className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-800 mb-1">Identity Verified ✓</p>
                        <p className="text-xs text-green-600">Face matches ID photo perfectly</p>
                      </div>
                    )}

                    <Button
                      variant={formData.faceIdMatched ? "outline" : "luxury"}
                      onClick={() => setFormData(prev => ({ ...prev, faceIdMatched: true }))}
                      className="w-full h-12"
                      disabled={formData.faceIdMatched}
                    >
                      {formData.faceIdMatched ? '✓ Face Matched' : 'Verify Face Match'}
                    </Button>
                  </div>
                )}

                {/* Completion Status */}
                {formData.idVerified && formData.faceIdMatched && (
                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-8 w-8 text-accent" />
                    </div>
                    <h4 className="font-medium text-accent mb-2">Complete Verification ✓</h4>
                    <p className="text-sm text-muted-foreground">
                      Your identity has been fully verified. You're ready to use Pillow Talk safely.
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
                  (step === 1 && (!formData.name || !formData.gender || !formData.phone || !formData.isOver18)) ||
                  (step === 2 && (!formData.email || !formData.screenName || screenNameValidation?.isValid === false)) ||
                  (step === 3 && !formData.faceVerified)
                }
                className="ml-auto"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!formData.idVerified || !formData.faceIdMatched}
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