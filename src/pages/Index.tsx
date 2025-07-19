import { useState } from "react";
import { VerificationFlow } from "@/components/VerificationFlow";
import { HomePage } from "@/components/HomePage";
import { MessagingInterface } from "@/components/MessagingInterface";

type AppState = 'verification' | 'home' | 'messaging';

interface UserData {
  name: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('verification');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activePostId, setActivePostId] = useState<string>('');

  const handleVerificationComplete = (data: UserData) => {
    setUserData(data);
    setAppState('home');
  };

  const handleMessage = (postId: string) => {
    setActivePostId(postId);
    setAppState('messaging');
  };

  const handleBackToHome = () => {
    setAppState('home');
    setActivePostId('');
  };

  if (appState === 'verification') {
    return <VerificationFlow onComplete={handleVerificationComplete} />;
  }

  if (appState === 'messaging' && userData) {
    return (
      <MessagingInterface 
        postId={activePostId} 
        onBack={handleBackToHome} 
      />
    );
  }

  if (appState === 'home' && userData) {
    return (
      <HomePage 
        userGender={userData.gender} 
        onMessage={handleMessage} 
      />
    );
  }

  return null;
};

export default Index;
