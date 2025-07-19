import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: "Securing connection..." },
      { progress: 40, text: "Loading experiences..." },
      { progress: 60, text: "Verifying security..." },
      { progress: 80, text: "Preparing interface..." },
      { progress: 100, text: "Ready!" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress);
        setLoadingText(loadingSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-accent/10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-accent/5 animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-accent/10 animate-pulse delay-700"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 rounded-full bg-accent/5 animate-pulse delay-500"></div>
      </div>

      <div className="flex flex-col items-center space-y-8 z-10">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl scale-110 animate-pulse"></div>
          <img 
            src="/lovable-uploads/a3ca0fb5-905f-470d-ac61-7e26940cc492.png" 
            alt="Pillow Talk" 
            className="relative w-64 h-64 object-contain animate-scale-in shadow-luxury"
          />
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold bg-gradient-accent bg-clip-text text-transparent animate-fade-in">
            Not gossip just experience
          </h2>
          
          <p className="text-muted-foreground animate-fade-in delay-300">
            {loadingText}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-border rounded-full overflow-hidden animate-fade-in delay-500">
          <div 
            className="h-full bg-gradient-accent transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-2 animate-fade-in delay-700">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-8 text-center animate-fade-in delay-1000">
        <p className="text-xs text-muted-foreground/50">
          Secure • Private • Discreet
        </p>
      </div>
    </div>
  );
};