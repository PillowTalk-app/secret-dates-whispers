import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Send, MoreVertical } from "lucide-react";

interface UserData {
  name: string;
  screenName: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

interface MessagesProps {
  userData: UserData;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderGender: 'male' | 'female';
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantGender: 'male' | 'female';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

export const Messages = ({ userData }: MessagesProps) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      participantName: 'MysticWaves',
      participantGender: userData.gender === 'male' ? 'female' : 'male',
      lastMessage: 'Thanks for sharing that post about Alex. Really helpful!',
      lastMessageTime: '2m ago',
      unreadCount: 2,
      isOnline: true,
      messages: [
        {
          id: '1',
          senderId: '1',
          senderName: 'MysticWaves',
          senderGender: userData.gender === 'male' ? 'female' : 'male',
          content: 'Hi! I saw your post about Alex Johnson. Could you tell me more about your experience?',
          timestamp: '10:30 AM',
          isRead: true
        },
        {
          id: '2',
          senderId: userData.phone,
          senderName: userData.screenName,
          senderGender: userData.gender,
          content: 'Sure! What would you like to know specifically?',
          timestamp: '10:35 AM',
          isRead: true
        },
        {
          id: '3',
          senderId: '1',
          senderName: 'MysticWaves',
          senderGender: userData.gender === 'male' ? 'female' : 'male',
          content: 'Thanks for sharing that post about Alex. Really helpful!',
          timestamp: '10:40 AM',
          isRead: false
        }
      ]
    },
    {
      id: '2',
      participantName: 'SunsetDreamer',
      participantGender: userData.gender === 'male' ? 'female' : 'male',
      lastMessage: 'Looking forward to connecting more!',
      lastMessageTime: '1h ago',
      unreadCount: 0,
      isOnline: false,
      messages: [
        {
          id: '1',
          senderId: '2',
          senderName: 'SunsetDreamer',
          senderGender: userData.gender === 'male' ? 'female' : 'male',
          content: 'Hey! Your review about Sam was really detailed. Thanks for sharing.',
          timestamp: '9:15 AM',
          isRead: true
        },
        {
          id: '2',
          senderId: '2',
          senderName: 'SunsetDreamer',
          senderGender: userData.gender === 'male' ? 'female' : 'male',
          content: 'Looking forward to connecting more!',
          timestamp: '9:20 AM',
          isRead: true
        }
      ]
    }
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // In a real app, this would send the message
    setMessageInput('');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">Connect with other community members safely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-card border-border/50 h-full">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card/50 border-border/50"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 max-h-[480px] overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-muted/30 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-muted/50' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="border-2 border-primary/20">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                            {conversation.participantName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground truncate">{conversation.participantName}</h3>
                          <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-accent text-accent-foreground mt-1 text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedConv ? (
            <Card className="bg-gradient-card border-border/50 h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {selectedConv.participantName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{selectedConv.participantName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedConv.isOnline ? 'Online' : 'Last seen recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {selectedConv.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === userData.phone ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === userData.phone
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-border/30">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="bg-card/50 border-border/50"
                  />
                  <Button onClick={handleSendMessage} className="bg-accent hover:bg-accent/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-gradient-card border-border/50 h-full flex items-center justify-center">
              <CardContent className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the left to start messaging</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};