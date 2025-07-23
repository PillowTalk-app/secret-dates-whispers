import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface SavedPostNotification {
  id: string;
  postId: string;
  postAuthor: string;
  targetName: string;
  newComment: string;
  commentAuthor: string;
  timestamp: string;
  read: boolean;
}

export const useSavedPostNotifications = () => {
  const [notifications, setNotifications] = useState<SavedPostNotification[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const { toast } = useToast();

  // Mock function to simulate new comments on saved posts
  const simulateNewComment = (postId: string, postAuthor: string, targetName: string) => {
    if (!savedPosts.includes(postId)) return;

    const newNotification: SavedPostNotification = {
      id: `notif-${Date.now()}`,
      postId,
      postAuthor,
      targetName,
      newComment: "Just wanted to add that I had a similar experience...",
      commentAuthor: "Anonymous User",
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast({
      title: "New comment on saved post",
      description: `Someone commented on ${postAuthor}'s post about ${targetName}`,
      duration: 5000,
    });
  };

  const savePost = (postId: string, postAuthor: string, targetName: string) => {
    setSavedPosts(prev => {
      if (prev.includes(postId)) {
        // Unsaving
        return prev.filter(id => id !== postId);
      } else {
        // Saving - simulate getting notifications for future comments
        setTimeout(() => {
          simulateNewComment(postId, postAuthor, targetName);
        }, 3000); // Simulate comment after 3 seconds
        
        return [...prev, postId];
      }
    });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    savedPosts,
    unreadCount,
    savePost,
    markAsRead,
    isPostSaved: (postId: string) => savedPosts.includes(postId)
  };
};