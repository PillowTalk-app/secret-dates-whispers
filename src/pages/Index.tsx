import { useState, useEffect } from "react";
import { VerificationFlow } from "@/components/VerificationFlow";
import { SignInFlow } from "@/components/SignInFlow";
import { HomePage } from "@/components/HomePage";
import { MessagingInterface } from "@/components/MessagingInterface";
import { UserProfile } from "@/components/UserProfile";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AuthChoiceScreen } from "@/components/AuthChoiceScreen";

type AppState = 'loading' | 'auth-choice' | 'verification' | 'signin' | 'home' | 'messaging' | 'profile';

interface UserData {
  name: string;
  screenName: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

interface IndexProps {
  onAuthComplete: () => void;
}

const Index = ({ onAuthComplete }: IndexProps) => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activePostId, setActivePostId] = useState<string>('');

  const handleLoadingComplete = () => {
    setAppState('auth-choice');
    localStorage.setItem('appState', 'auth-choice');
  };

  const handleSignUp = () => {
    setAppState('verification');
    localStorage.setItem('appState', 'verification');
  };

  const handleSignIn = () => {
    setAppState('signin');
    localStorage.setItem('appState', 'signin');
  };

  const handleSignInComplete = (data: UserData) => {
    setUserData(data);
    setAppState('home');
    // Set authentication state
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('appState', 'home');
    // Trigger custom event to notify App component
    window.dispatchEvent(new Event('authStateChange'));
    onAuthComplete();
  };

  const handleVerificationComplete = (data: UserData) => {
    setUserData(data);
    setAppState('home');
    // Set authentication state
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('appState', 'home');
    // Trigger custom event to notify App component
    window.dispatchEvent(new Event('authStateChange'));
    onAuthComplete();
  };

  const handleBackToAuthChoice = () => {
    setAppState('auth-choice');
    localStorage.setItem('appState', 'auth-choice');
  };

  const handleMessage = (postId: string) => {
    setActivePostId(postId);
    setAppState('messaging');
  };

  const handleBackToHome = () => {
    setAppState('home');
    setActivePostId('');
  };

  const handleProfileView = () => {
    setAppState('profile');
  };

  const handleBackFromProfile = () => {
    setAppState('home');
  };

  if (appState === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (appState === 'auth-choice') {
    return <AuthChoiceScreen onSignUp={handleSignUp} onSignIn={handleSignIn} />;
  }

  if (appState === 'verification') {
    return <VerificationFlow onComplete={handleVerificationComplete} />;
  }

  if (appState === 'signin') {
    return <SignInFlow onComplete={handleSignInComplete} onBack={handleBackToAuthChoice} />;
  }

  if (appState === 'messaging' && userData) {
    return (
      <MessagingInterface 
        postId={activePostId} 
        onBack={handleBackToHome} 
      />
    );
  }

  if (appState === 'profile' && userData) {
    return (
      <UserProfile 
        userData={userData} 
        onBack={handleBackFromProfile} 
      />
    );
  }

  if (appState === 'home' && userData) {
    return (
      <HomePage 
        userData={userData}
        onMessage={handleMessage}
        onProfile={handleProfileView}
      />
    );
  }

  return null;
};

export default Index;
