import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserPlus, Users, Swords, Trophy, Flame, Star, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Friends() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: friends = [] } = useQuery({
    queryKey: ["/api/friends"],
  });

  const { data: friendRequests = [] } = useQuery({
    queryKey: ["/api/friends/requests"],
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ["/api/challenges"],
  });

  const addFriendMutation = useMutation({
    mutationFn: async (friendId: string) => {
      const response = await apiRequest("POST", "/api/friends/request", { friendId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      toast({
        title: "Friend request sent!",
        description: "Your friend request has been sent successfully.",
      });
      setSearchQuery("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const acceptFriendMutation = useMutation({
    mutationFn: async (friendshipId: number) => {
      const response = await apiRequest("POST", `/api/friends/accept/${friendshipId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests"] });
      toast({
        title: "Friend request accepted!",
        description: "You are now friends and can challenge each other.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to accept friend request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createChallengeMutation = useMutation({
    mutationFn: async (challengeData: any) => {
      const response = await apiRequest("POST", "/api/challenges", challengeData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      toast({
        title: "Challenge created!",
        description: "Your friend has been challenged to a fitness competition.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a username or email to search for friends.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you'd first search for the user, then send the request
    // For now, we'll assume the search query is a valid user ID
    addFriendMutation.mutate(searchQuery);
  };

  const handleAcceptFriend = (friendshipId: number) => {
    acceptFriendMutation.mutate(friendshipId);
  };

  const handleChallengeFriend = (friendId: string, friendName: string) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7); // 1 week challenge

    createChallengeMutation.mutate({
      participantId: friendId,
      challengeType: "steps",
      title: "Weekly Step Challenge",
      description: `See who can walk more steps in 7 days!`,
      targetValue: 50000,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  };

  const getUserInitials = (userData: any) => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    }
    if (userData?.email) {
      return userData.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUserName = (userData: any) => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    if (userData?.email) {
      return userData.email.split('@')[0];
    }
    return "Unknown User";
  };

  const getRandomStats = () => {
    // Mock function to generate random stats for demonstration
    // In a real app, this would come from the user's actual data
    return {
      streak: Math.floor(Math.random() * 30) + 1,
      points: Math.floor(Math.random() * 2000) + 500,
      status: Math.random() > 0.5 ? "Online" : "Offline",
      lastWorkout: Math.floor(Math.random() * 24) + 1,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Friends</h1>
            <p className="text-sm text-gray-600">Connect and challenge others</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Add Friend Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFriend} className="flex space-x-3">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username or email"
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={addFriendMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {addFriendMutation.isPending ? "Adding..." : "Add Friend"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Friend Requests */}
          {friendRequests.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Friend Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {friendRequests.map((request: any) => {
                    const stats = getRandomStats();
                    return (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <span className="font-semibold text-white">{getUserInitials(request.user)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{getUserName(request.user)}</h4>
                            <p className="text-sm text-gray-600">Wants to be your friend</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleAcceptFriend(request.id)}
                            disabled={acceptFriendMutation.isPending}
                            className="bg-secondary hover:bg-secondary/90 text-white"
                          >
                            Accept
                          </Button>
                          <Button variant="outline">
                            Decline
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Friends List */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Friends</CardTitle>
                <Badge variant="secondary" className="bg-primary bg-opacity-10 text-primary">
                  {friends.length} friends
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {friends.length > 0 ? (
                  friends.map((friend: any) => {
                    const stats = getRandomStats();
                    return (
                      <div key={friend.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <span className="font-semibold text-white">{getUserInitials(friend)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{getUserName(friend)}</h4>
                            <p className="text-sm text-gray-600">
                              {stats.status} • Last workout: {stats.lastWorkout} hours ago
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                <Flame className="w-3 h-3 inline mr-1 text-accent" />
                                {stats.streak} day streak
                              </span>
                              <span className="text-xs text-gray-500">
                                <Star className="w-3 h-3 inline mr-1 text-accent" />
                                {stats.points} pts this week
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleChallengeFriend(friend.id, getUserName(friend))}
                            disabled={createChallengeMutation.isPending}
                            className="bg-secondary hover:bg-secondary/90 text-white"
                          >
                            <Swords className="w-4 h-4 mr-1" />
                            Challenge
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Friends Yet</h3>
                    <p className="text-sm">
                      Add friends to compete in challenges and stay motivated together!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <CardTitle>Active Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenges.length > 0 ? (
                  challenges.slice(0, 3).map((challenge: any) => {
                    const progress = Math.floor(Math.random() * 80) + 10; // Mock progress
                    const daysLeft = Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
                    
                    return (
                      <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                          <Badge variant="secondary" className="bg-secondary bg-opacity-10 text-secondary">
                            {daysLeft} days left
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Your Progress</span>
                            <span className="font-medium">{Math.floor((challenge.targetValue || 50000) * (progress / 100)).toLocaleString()}/{(challenge.targetValue || 50000).toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{progress}% complete</span>
                            <span>Target: {(challenge.targetValue || 50000).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No active challenges</p>
                    <p className="text-xs">Challenge your friends to get started!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
