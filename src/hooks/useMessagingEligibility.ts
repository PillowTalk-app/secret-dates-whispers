import { useState, useEffect } from 'react';

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

export const useMessagingEligibility = () => {
  const [eligibleUsers, setEligibleUsers] = useState<Map<string, MessagingEligibility>>(new Map());

  // Check if user can message another user
  const canMessageUser = (userId: string): MessagingEligibility => {
    const existing = eligibleUsers.get(userId);
    if (existing) return existing;

    // Mock shared contexts - in real app, this would come from database
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

    if (mockSharedContexts.length > 0) {
      return {
        canMessage: true,
        sharedContexts: mockSharedContexts
      };
    }

    return {
      canMessage: false,
      sharedContexts: [],
      reason: 'No shared context found. You can only message users you\'ve interacted with through posts or memory matches.'
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

  return {
    canMessageUser,
    createSharedContext,
    eligibleUsers: Array.from(eligibleUsers.values()).filter(e => e.canMessage)
  };
};