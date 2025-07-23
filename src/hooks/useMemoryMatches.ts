import { useState, useEffect } from 'react';

interface MemoryMatch {
  id: string;
  postAId: string;
  postBId: string;
  confidenceScore: number;
  matchType: 'face_match' | 'name_match' | 'hybrid';
  status: 'pending' | 'both_opted_in' | 'declined' | 'expired';
  sharedPersonName: string | null;
  expiresAt: string;
  createdAt: string;
}

interface MemoryMatchOptIn {
  id: string;
  matchId: string;
  userId: string;
  postId: string;
  optedIn: boolean;
  optedInAt: string | null;
}

interface MemoryComparison {
  id: string;
  matchId: string;
  userAId: string;
  userBId: string;
  postAContent: string;
  postBContent: string;
  sharedPersonName: string;
  sharedPhoto: string | null;
}

export const useMemoryMatches = () => {
  const [pendingMatches, setPendingMatches] = useState<MemoryMatch[]>([]);
  const [activeComparisons, setActiveComparisons] = useState<MemoryComparison[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate pending matches
    setPendingMatches([
      {
        id: '1',
        postAId: 'post-1',
        postBId: 'post-2',
        confidenceScore: 0.85,
        matchType: 'face_match',
        status: 'pending',
        sharedPersonName: 'Alex',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      }
    ]);
  }, []);

  const detectPotentialMatch = async (newPost: {
    id: string;
    targetName: string;
    images: string[];
    content: string;
    userId: string;
  }) => {
    // Mock face/name matching logic
    // In real implementation, this would:
    // 1. Compare face embeddings with existing posts
    // 2. Check for name similarities
    // 3. Apply confidence scoring
    
    console.log('Checking for potential matches for new post:', newPost.id);
    
    // Simulate finding a match
    if (newPost.targetName.toLowerCase().includes('alex')) {
      const newMatch: MemoryMatch = {
        id: `match-${Date.now()}`,
        postAId: 'existing-post-id',
        postBId: newPost.id,
        confidenceScore: 0.78,
        matchType: 'name_match',
        status: 'pending',
        sharedPersonName: newPost.targetName,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      };
      
      setPendingMatches(prev => [...prev, newMatch]);
      return newMatch;
    }
    
    return null;
  };

  const optInToMatch = async (matchId: string, postId: string) => {
    setIsLoading(true);
    
    try {
      // Mock opt-in logic
      console.log('User opted in to match:', matchId);
      
      // Update match status
      setPendingMatches(prev => 
        prev.map(match => {
          if (match.id === matchId) {
            // In real implementation, check if both users have opted in
            const updatedMatch = { ...match, status: 'both_opted_in' as const };
            
            // If both opted in, create comparison
            if (updatedMatch.status === 'both_opted_in') {
              const comparison: MemoryComparison = {
                id: `comparison-${Date.now()}`,
                matchId: matchId,
                userAId: 'user-a',
                userBId: 'user-b',
                postAContent: 'Great person, had fun but communication could be better...',
                postBContent: 'Amazing experience! Really enjoyed our time together...',
                sharedPersonName: match.sharedPersonName || 'Unknown',
                sharedPhoto: '/placeholder.svg'
              };
              
              setActiveComparisons(prev => [...prev, comparison]);
            }
            
            return updatedMatch;
          }
          return match;
        })
      );
      
      return true;
    } catch (error) {
      console.error('Error opting in to match:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const declineMatch = async (matchId: string) => {
    setIsLoading(true);
    
    try {
      console.log('User declined match:', matchId);
      
      setPendingMatches(prev => 
        prev.map(match => 
          match.id === matchId 
            ? { ...match, status: 'declined' as const }
            : match
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error declining match:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addReaction = async (comparisonId: string, reaction: 'helpful' | 'eye_opening' | 'concerning') => {
    console.log('Adding reaction to comparison:', comparisonId, reaction);
    // Mock reaction logic
    return true;
  };

  // Auto-expire matches
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingMatches(prev => 
        prev.map(match => {
          const expiryDate = new Date(match.expiresAt);
          const now = new Date();
          
          if (expiryDate <= now && match.status === 'pending') {
            return { ...match, status: 'expired' as const };
          }
          return match;
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return {
    pendingMatches: pendingMatches.filter(m => m.status === 'pending'),
    activeComparisons,
    isLoading,
    detectPotentialMatch,
    optInToMatch,
    declineMatch,
    addReaction
  };
};