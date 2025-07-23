import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, Users, Clock, TrendingUp, MessageSquare, BarChart3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  screenName: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

interface PollsProps {
  userData: UserData;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  creatorName: string;
  creatorGender: 'male' | 'female';
  title: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  timestamp: string;
  isActive: boolean;
  category: 'dating' | 'relationship' | 'general' | 'safety';
  comments: number;
}

interface Question {
  id: string;
  creatorName: string;
  creatorGender: 'male' | 'female';
  title: string;
  content: string;
  timestamp: string;
  responses: number;
  category: 'advice' | 'experience' | 'general';
  isAnswered: boolean;
}

export const Polls = ({ userData }: PollsProps) => {
  const navigate = useNavigate();
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'polls' | 'questions'>('polls');
  
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: ['', ''],
    category: 'general' as Poll['category']
  });

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    category: 'advice' as Question['category']
  });

  const [polls] = useState<Poll[]>([
    {
      id: '1',
      creatorName: 'MysticWaves',
      creatorGender: userData.gender === 'male' ? 'female' : 'male',
      title: 'What\'s the biggest red flag on a first date?',
      description: 'Share your experiences about early warning signs',
      options: [
        { id: '1', text: 'Being rude to service staff', votes: 45 },
        { id: '2', text: 'Constantly checking phone', votes: 32 },
        { id: '3', text: 'Talking only about themselves', votes: 28 },
        { id: '4', text: 'Being late without notice', votes: 15 }
      ],
      totalVotes: 120,
      timestamp: '2 hours ago',
      isActive: true,
      category: 'dating',
      comments: 23
    },
    {
      id: '2',
      creatorName: 'SunsetDreamer',
      creatorGender: userData.gender === 'male' ? 'female' : 'male',
      title: 'Best way to end a casual relationship?',
      description: 'Looking for respectful approaches',
      options: [
        { id: '1', text: 'Honest conversation in person', votes: 67 },
        { id: '2', text: 'Text message explanation', votes: 23 },
        { id: '3', text: 'Gradual distance/fade out', votes: 12 },
        { id: '4', text: 'Phone call discussion', votes: 18 }
      ],
      totalVotes: 120,
      timestamp: '1 day ago',
      isActive: true,
      category: 'relationship',
      comments: 15
    }
  ]);

  const [questions] = useState<Question[]>([
    {
      id: '1',
      creatorName: 'NightOwl',
      creatorGender: userData.gender === 'male' ? 'female' : 'male',
      title: 'How to handle someone who ghosts after multiple dates?',
      content: 'I went on 4 great dates with someone and they suddenly stopped responding. We had amazing chemistry and they seemed really interested. Should I reach out one more time or just move on? This is really confusing me.',
      timestamp: '3 hours ago',
      responses: 12,
      category: 'advice',
      isAnswered: false
    },
    {
      id: '2',
      creatorName: 'CityExplorer',
      creatorGender: userData.gender === 'male' ? 'female' : 'male',
      title: 'Is it normal to feel anxious about exclusive relationships?',
      content: 'Been dating someone for 2 months and they want to be exclusive. I really like them but feel anxious about commitment. Is this normal? How do you know when you\'re ready?',
      timestamp: '6 hours ago',
      responses: 8,
      category: 'experience',
      isAnswered: true
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dating': return 'bg-pink-500/20 text-pink-300';
      case 'relationship': return 'bg-purple-500/20 text-purple-300';
      case 'safety': return 'bg-red-500/20 text-red-300';
      case 'advice': return 'bg-blue-500/20 text-blue-300';
      case 'experience': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const addPollOption = () => {
    if (newPoll.options.length < 6) {
      setNewPoll(prev => ({ ...prev, options: [...prev.options, ''] }));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const removePollOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Community Voice</h1>
        <p className="text-muted-foreground">Share polls, ask questions, and get community insights</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'polls' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('polls')}
          className={activeTab === 'polls' ? 'bg-accent text-accent-foreground' : ''}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Polls
        </Button>
        <Button
          variant={activeTab === 'questions' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('questions')}
          className={activeTab === 'questions' ? 'bg-accent text-accent-foreground' : ''}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Questions
        </Button>
      </div>

      {/* Create Buttons */}
      <div className="flex space-x-3 mb-6">
        <Dialog open={isCreatePollOpen} onOpenChange={setIsCreatePollOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-700 hover:bg-teal-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white border-none shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Create New Poll</DialogTitle>
              <DialogDescription className="text-gray-600">
                Get community insights on dating and relationship topics
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Poll title..."
                value={newPoll.title}
                onChange={(e) => setNewPoll(prev => ({ ...prev, title: e.target.value }))}
                className="border-gray-200"
              />
              <Textarea
                placeholder="Poll description..."
                value={newPoll.description}
                onChange={(e) => setNewPoll(prev => ({ ...prev, description: e.target.value }))}
                className="border-gray-200"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Options</label>
                {newPoll.options.map((option, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      className="border-gray-200"
                    />
                    {newPoll.options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePollOption(index)}
                        className="text-gray-400"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                {newPoll.options.length < 6 && (
                  <Button variant="outline" size="sm" onClick={addPollOption} className="border-gray-200">
                    Add Option
                  </Button>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsCreatePollOpen(false)} className="text-gray-600">
                  Cancel
                </Button>
                <Button className="bg-teal-700 hover:bg-teal-800 text-white">
                  Create Poll
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateQuestionOpen} onOpenChange={setIsCreateQuestionOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-border/50">
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white border-none shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Ask a Question</DialogTitle>
              <DialogDescription className="text-gray-600">
                Get advice and insights from the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Question title..."
                value={newQuestion.title}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                className="border-gray-200"
              />
              <Textarea
                placeholder="Describe your situation or question in detail..."
                value={newQuestion.content}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                className="border-gray-200 min-h-[100px]"
              />

              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsCreateQuestionOpen(false)} className="text-gray-600">
                  Cancel
                </Button>
                <Button className="bg-teal-700 hover:bg-teal-800 text-white">
                  Ask Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      {activeTab === 'polls' ? (
        <div className="space-y-6">
          {polls.map((poll) => (
            <Card key={poll.id} className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                        {poll.creatorName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{poll.creatorName}</h3>
                      <p className="text-sm text-muted-foreground">{poll.timestamp}</p>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(poll.category)}>
                    {poll.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-4">{poll.title}</CardTitle>
                <p className="text-muted-foreground">{poll.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {poll.options.map((option) => {
                    const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                    return (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground">{option.text}</span>
                          <span className="text-muted-foreground">{option.votes} votes</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {poll.totalVotes} votes
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {poll.comments} comments
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                    Vote & Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question) => (
            <Card key={question.id} className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                        {question.creatorName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{question.creatorName}</h3>
                      <p className="text-sm text-muted-foreground">{question.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getCategoryColor(question.category)}>
                      {question.category}
                    </Badge>
                    {question.isAnswered && (
                      <Badge className="bg-green-500/20 text-green-300">
                        Answered
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-xl mt-4">{question.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">{question.content}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {question.responses} responses
                  </div>
                  <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                    Answer Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};