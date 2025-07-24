import { useState, useEffect } from 'react';

interface MatchPayment {
  userEmail: string;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

export const useMatchPayments = () => {
  const [hasUnlockedMatches, setHasUnlockedMatches] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check payment status on component mount
  useEffect(() => {
    const checkPaymentStatus = () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const paymentStatus = localStorage.getItem(`match_payment_${user.email}`);
        setHasUnlockedMatches(paymentStatus === 'paid');
      }
    };

    checkPaymentStatus();
    
    // Listen for payment status changes
    window.addEventListener('match_payment_updated', checkPaymentStatus);
    return () => window.removeEventListener('match_payment_updated', checkPaymentStatus);
  }, []);

  const createPayment = async (userEmail: string, userName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-match-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          userName
        }),
      });

      const data = await response.json();
      if (data.url) {
        // Store pending payment status
        localStorage.setItem(`match_payment_${userEmail}`, 'pending');
        localStorage.setItem(`match_payment_session_${userEmail}`, data.sessionId);
        
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Payment creation failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (sessionId: string, userEmail: string) => {
    try {
      const response = await fetch('/api/verify-match-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem(`match_payment_${userEmail}`, 'paid');
        setHasUnlockedMatches(true);
        
        // Dispatch event to update other components
        window.dispatchEvent(new CustomEvent('match_payment_updated'));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  };

  const canAccessMatches = () => {
    return hasUnlockedMatches;
  };

  const canMessage = () => {
    return hasUnlockedMatches;
  };

  return {
    hasUnlockedMatches,
    isLoading,
    createPayment,
    verifyPayment,
    canAccessMatches,
    canMessage
  };
};