import { useState, useEffect } from 'react';

// Mock data structure for boosted posts
// In a real app, this would come from Supabase
interface BoostedPost {
  postId: string;
  boostEndTime: string;
  status: 'active' | 'expired';
}

export const useBoostedPosts = () => {
  const [boostedPosts, setBoostedPosts] = useState<BoostedPost[]>([
    // Mock data for demonstration
    {
      postId: '1',
      boostEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      status: 'active'
    }
  ]);

  const isBoosted = (postId: string): boolean => {
    const boost = boostedPosts.find(post => post.postId === postId && post.status === 'active');
    if (!boost) return false;
    
    // Check if boost has expired
    const endTime = new Date(boost.boostEndTime);
    const now = new Date();
    return endTime > now;
  };

  const getBoostEndTime = (postId: string): string | undefined => {
    const boost = boostedPosts.find(post => post.postId === postId && post.status === 'active');
    return boost?.boostEndTime;
  };

  const addBoostedPost = (postId: string) => {
    const boostEndTime = new Date();
    boostEndTime.setHours(boostEndTime.getHours() + 48);
    
    setBoostedPosts(prev => [
      ...prev.filter(post => post.postId !== postId), // Remove existing boost if any
      {
        postId,
        boostEndTime: boostEndTime.toISOString(),
        status: 'active'
      }
    ]);
  };

  // Auto-expire posts
  useEffect(() => {
    const interval = setInterval(() => {
      setBoostedPosts(prev => 
        prev.map(post => {
          const endTime = new Date(post.boostEndTime);
          const now = new Date();
          if (endTime <= now && post.status === 'active') {
            return { ...post, status: 'expired' as const };
          }
          return post;
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return {
    isBoosted,
    getBoostEndTime,
    addBoostedPost,
    boostedPosts: boostedPosts.filter(post => post.status === 'active')
  };
};