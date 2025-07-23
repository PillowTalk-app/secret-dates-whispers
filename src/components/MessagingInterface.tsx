import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Shield, Clock } from "lucide-react";

interface MessagingInterfaceProps {
  postId: string;
  onBack: () => void;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  userName?: string;
}

export const MessagingInterface = ({ postId, onBack }: MessagingInterfaceProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'other',
      content: 'Hi, I saw your post about Alex Johnson. I had a similar experience. Would you mind sharing more details?',
      timestamp: '10:30 AM',
      isOwn: false,
      userName: 'Sarah M.'
    },
    {
      id: '2',
      senderId: 'me',
      content: 'Sure, I appreciate you reaching out. What specifically would you like to know?',
      timestamp: '10:32 AM',
      isOwn: true,
      userName: 'You'
    },
    {
      id: '3',
      senderId: 'other',
      content: 'Did they also promise things early on that they didn\'t follow through with?',
      timestamp: '10:35 AM',
      isOwn: false,
      userName: 'Sarah M.'
    }
  ]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      userName: 'You'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border/50 p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="border-2 border-primary/30">
            <AvatarFallback className="bg-gradient-card">
              U
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="font-semibold">Anonymous User</h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Verified • End-to-end encrypted</span>
            </div>
          </div>
          
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            Post #{postId}
          </Badge>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <Card className="bg-gradient-card border-border/50 p-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Shield className="h-4 w-4" />
            <span>This conversation is private and encrypted</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Remember to keep conversations respectful and factual. Do not share personal information.
          </p>
        </Card>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${message.isOwn ? 'justify-end flex-row-reverse space-x-reverse' : 'justify-start'}`}
          >
            {/* Profile Avatar */}
            <Avatar className="w-10 h-10 border-2 border-primary/20 flex-shrink-0 mt-1">
              <AvatarFallback className="text-sm bg-gradient-card font-semibold">
                {message.userName ? message.userName.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>

            {/* Message Content */}
            <div className="flex flex-col max-w-[65%]">
              {!message.isOwn && (
                <span className="text-xs text-muted-foreground mb-1 px-1 font-medium">
                  {message.userName}
                </span>
              )}
              <div
                className={`p-3 rounded-lg ${
                  message.isOwn
                    ? 'bg-gradient-primary text-primary-foreground rounded-br-sm'
                    : 'bg-card border border-border/50 rounded-bl-sm'
                }`}
              >
                <p className="break-words">{message.content}</p>
                <div className={`flex items-center justify-end mt-1 text-xs ${
                  message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  <Clock className="h-3 w-3" />
                  <span className="ml-1">{message.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-card/50 backdrop-blur-sm border-t border-border/50">
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-card/50 border-border/50"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 flex items-center">
          <Shield className="h-3 w-3 mr-1" />
          Messages are encrypted and automatically deleted after 30 days
        </p>
      </div>
    </div>
  );
};