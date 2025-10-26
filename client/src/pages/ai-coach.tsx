import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Bot, Send, Wand2, Lightbulb, Apple } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AiCoach() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "",
      response: "Hi! I'm your AI fitness coach. I can help you create workout plans, answer nutrition questions, and provide motivation. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [workoutPlanForm, setWorkoutPlanForm] = useState({
    goal: "",
    experience: "",
    daysPerWeek: "",
  });

  const { data: chatHistory = [] } = useQuery({
    queryKey: ["/api/chat-history", { limit: 20 }],
  });

  const { data: workoutPlans = [] } = useQuery({
    queryKey: ["/api/workout-plans"],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", { message });
      return response.json();
    },
    onSuccess: (data, message) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message,
        response: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setChatInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/chat-history"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateWorkoutPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/ai/workout-plan", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plans"] });
      toast({
        title: "Workout plan generated!",
        description: "Your personalized workout plan has been created.",
      });
      setWorkoutPlanForm({ goal: "", experience: "", daysPerWeek: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate workout plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message to chat immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: chatInput,
      response: "",
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    chatMutation.mutate(chatInput);
  };

  const handleGenerateWorkoutPlan = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workoutPlanForm.goal || !workoutPlanForm.experience || !workoutPlanForm.daysPerWeek) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to generate a workout plan.",
        variant: "destructive",
      });
      return;
    }

    generateWorkoutPlanMutation.mutate({
      goal: workoutPlanForm.goal,
      experience: workoutPlanForm.experience,
      daysPerWeek: parseInt(workoutPlanForm.daysPerWeek),
    });
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Fitness Coach</h1>
            <p className="text-sm text-gray-600">Get personalized fitness guidance</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* AI Coach Header */}
          <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 text-white mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Fitness Coach</h2>
                <p className="text-blue-100">Get personalized workout plans and fitness advice</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-96 flex flex-col">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle>Chat with Your AI Coach</CardTitle>
                </CardHeader>
                
                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id}>
                        {msg.isUser ? (
                          // User Message
                          <div className="flex items-start space-x-3 justify-end">
                            <div className="bg-primary rounded-lg px-4 py-2 max-w-xs">
                              <p className="text-sm text-white">{msg.message}</p>
                            </div>
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">{getUserInitials()}</span>
                            </div>
                          </div>
                        ) : (
                          // AI Message
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-sm">
                              <p className="text-sm text-gray-900">{msg.response}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {chatMutation.isPending && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white animate-pulse" />
                        </div>
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <p className="text-sm text-gray-500">AI is thinking...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleChatSubmit} className="flex space-x-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask your AI coach anything..."
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={chatMutation.isPending || !chatInput.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

            {/* AI Tools */}
            <div className="space-y-6">
              {/* Workout Plan Generator */}
              <Card>
                <CardHeader>
                  <CardTitle>Generate Workout Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateWorkoutPlan} className="space-y-3">
                    <div className="space-y-2">
                      <Label>Goal</Label>
                      <Select
                        value={workoutPlanForm.goal}
                        onValueChange={(value) => 
                          setWorkoutPlanForm({ ...workoutPlanForm, goal: value })
                        }
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="build_muscle">Build Muscle</SelectItem>
                          <SelectItem value="lose_weight">Lose Weight</SelectItem>
                          <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                          <SelectItem value="general_fitness">General Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Experience</Label>
                      <Select
                        value={workoutPlanForm.experience}
                        onValueChange={(value) => 
                          setWorkoutPlanForm({ ...workoutPlanForm, experience: value })
                        }
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Days per week</Label>
                      <Input
                        type="number"
                        min="1"
                        max="7"
                        placeholder="3"
                        value={workoutPlanForm.daysPerWeek}
                        onChange={(e) => 
                          setWorkoutPlanForm({ ...workoutPlanForm, daysPerWeek: e.target.value })
                        }
                        className="text-sm"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={generateWorkoutPlanMutation.isPending}
                      className="w-full bg-secondary hover:bg-secondary/90 text-white text-sm"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {generateWorkoutPlanMutation.isPending ? "Generating..." : "Generate Plan"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Generated Workout Plans */}
              {workoutPlans.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Workout Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {workoutPlans.slice(0, 3).map((plan: any) => (
                        <div key={plan.id} className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-sm">{plan.title}</h4>
                          <p className="text-xs text-gray-600">{plan.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {plan.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {plan.daysPerWeek} days/week
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's AI Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-secondary bg-opacity-10 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-secondary mt-0.5" />
                        <p className="text-sm text-gray-900">
                          Try incorporating 5 minutes of stretching after your workout to improve flexibility!
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-accent bg-opacity-10 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Apple className="w-4 h-4 text-accent mt-0.5" />
                        <p className="text-sm text-gray-900">
                          Eating protein within 30 minutes after strength training can enhance muscle recovery.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
