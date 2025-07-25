import { useState, useEffect } from 'react';

// Mock supabase client for now - replace with actual supabase import when available
const mockSupabase = {
  auth: {
    getUser: async () => ({ data: { user: { email: 'user@example.com' } } })
  },
  from: (table: string) => {
    const mockQuery = {
      data: [],
      error: null
    };
    return {
      select: (fields: string) => ({
        eq: (field: string, value: string) => ({
          eq: (field2: string, value2: string) => ({
            order: (field: string, options: any) => mockQuery
          }),
          order: (field: string, options: any) => mockQuery
        })
      })
    };
  },
  functions: {
    invoke: async (functionName: string, options: any) => ({ data: null, error: null })
  }
};

export interface SharedContext {
  id: string;
  type: 'memory_match' | 'post_comment' | 'post_interaction' | 'mutual_save';
  description: string;
  establishedAt: string;
  otherUserId: string;
  otherUserName: string;
}

export interface MessagingEligibility {
  canMessage: boolean;
  sharedContexts: SharedContext[];
  reason?: string;
}

export interface PaymentStatus {
  canInitiateMessages: boolean;
  hasActivePaidAccess: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useMessagingEligibility = () => {
  const [eligibleUsers, setEligibleUsers] = useState<Map<string, MessagingEligibility>>(new Map());
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    canInitiateMessages: false,
    hasActivePaidAccess: false,
    isLoading: true,
    error: null
  });

  // Check payment status for messaging privileges
  const checkPaymentStatus = async () => {
    try {
      setPaymentStatus(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: user } = await mockSupabase.auth.getUser();
      if (!user.user?.email) {
        setPaymentStatus(prev => ({ 
          ...prev, 
          canInitiateMessages: false,
          hasActivePaidAccess: false,
          isLoading: false 
        }));
        return;
      }

      // Mock payment check - always return false for now
      const payments: any[] = [];
      const dbError = null;

      if (dbError) {
        console.error('Error checking payment status:', dbError);
        setPaymentStatus(prev => ({ 
          ...prev, 
          error: 'Failed to check payment status',
          isLoading: false 
        }));
        return;
      }

      const hasPaidAccess = payments && payments.length > 0;
      setPaymentStatus(prev => ({
        ...prev,
        hasActivePaidAccess: hasPaidAccess,
        canInitiateMessages: hasPaidAccess,
        isLoading: false
      }));

      // Mock pending payments check
      if (!hasPaidAccess) {
        const pendingPayments: any[] = [];

        if (pendingPayments && pendingPayments.length > 0) {
          // Check with Stripe if any pending payments have been completed
          for (const payment of pendingPayments) {
            try {
              const { data: verificationResult } = await mockSupabase.functions.invoke('verify-match-payment', {
                body: { sessionId: payment.stripe_session_id }
              });

              if (verificationResult?.success) {
                setPaymentStatus(prev => ({
                  ...prev,
                  hasActivePaidAccess: true,
                  canInitiateMessages: true,
                  isLoading: false
                }));
                break;
              }
            } catch (verifyError) {
              console.error('Error verifying payment:', verifyError);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error in checkPaymentStatus:', err);
      setPaymentStatus(prev => ({ 
        ...prev, 
        error: 'Failed to check messaging eligibility',
        isLoading: false 
      }));
    }
  };

  // Check if user can message another user (either they paid OR the other user messaged them first)
  const canMessageUser = (userId: string, hasReceivedMessageFrom: boolean = false): MessagingEligibility => {
    const existing = eligibleUsers.get(userId);
    if (existing) return existing;

    // If user has paid for messaging privileges OR received a message from this user, they can message
    if (paymentStatus.canInitiateMessages || hasReceivedMessageFrom) {
      const mockSharedContexts: SharedContext[] = [
        {
          id: '1',
          type: 'memory_match',
          description: 'You both posted about the same person and opted to compare experiences',
          establishedAt: '2 days ago',
          otherUserId: userId,
          otherUserName: 'MysticWaves'
        }
      ];

      return {
        canMessage: true,
        sharedContexts: mockSharedContexts
      };
    }

    return {
      canMessage: false,
      sharedContexts: [],
      reason: hasReceivedMessageFrom 
        ? 'You can respond to messages for free!' 
        : 'Unlock messaging for $5.99 to start conversations with all your matches'
    };
  };

  // Add messaging eligibility when shared context is created
  const addSharedContext = (userId: string, context: SharedContext) => {
    const current = eligibleUsers.get(userId);
    if (current) {
      setEligibleUsers(prev => new Map(prev.set(userId, {
        canMessage: true,
        sharedContexts: [...current.sharedContexts, context]
      })));
    } else {
      setEligibleUsers(prev => new Map(prev.set(userId, {
        canMessage: true,
        sharedContexts: [context]
      })));
    }
  };

  // Create shared context when users interact
  const createSharedContext = (
    otherUserId: string, 
    otherUserName: string, 
    type: SharedContext['type'],
    description: string
  ) => {
    const context: SharedContext = {
      id: `context-${Date.now()}`,
      type,
      description,
      establishedAt: 'Just now',
      otherUserId,
      otherUserName
    };

    addSharedContext(otherUserId, context);
    return context;
  };

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  return {
    canMessageUser,
    createSharedContext,
    paymentStatus,
    checkPaymentStatus,
    eligibleUsers: Array.from(eligibleUsers.values()).filter(e => e.canMessage)
  };
};