import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function Leaderboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");

  const { data: leaderboard = [] } = useQuery({
    queryKey: ["/api/leaderboard", { period }],
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: friends = [] } = useQuery({
    queryKey: ["/api/friends"],
  });

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

  const getCurrentUserRank = () => {
    if (!user || !leaderboard.length) return null;
    const userIndex = leaderboard.findIndex((u: any) => u.id === user.id);
    return userIndex >= 0 ? userIndex + 1 : null;
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-gray-600 font-semibold">{position}</span>;
    }
  };

  const getPositionStyle = (position: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return "bg-primary bg-opacity-10 border-2 border-primary";
    }
    
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gray-100";
      case 3:
        return "bg-amber-50";
      default:
        return "hover:bg-gray-50 transition-colors";
    }
  };

  const formatPoints = (points: number) => {
    return points?.toLocaleString() || "0";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-sm text-gray-600">Compete with friends</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Leaderboard Header */}
          <div className="bg-gradient-to-r from-accent to-yellow-600 rounded-xl p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Fitness Champions</h2>
                <p className="text-yellow-100">Compete with friends and stay motivated</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-yellow-100">Your Rank</p>
                <p className="text-3xl font-bold">#{getCurrentUserRank() || "—"}</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <Button
              variant={period === "week" ? "default" : "ghost"}
              onClick={() => setPeriod("week")}
              className={cn(
                "flex-1 text-sm font-medium rounded-md transition-colors",
                period === "week" 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              This Week
            </Button>
            <Button
              variant={period === "month" ? "default" : "ghost"}
              onClick={() => setPeriod("month")}
              className={cn(
                "flex-1 text-sm font-medium rounded-md transition-colors",
                period === "month" 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              This Month
            </Button>
            <Button
              variant={period === "all" ? "default" : "ghost"}
              onClick={() => setPeriod("all")}
              className={cn(
                "flex-1 text-sm font-medium rounded-md transition-colors",
                period === "all" 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              All Time
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{leaderboard.length}</p>
                <p className="text-sm text-gray-600">Active Athletes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userStats?.totalPoints || 0}</p>
                <p className="text-sm text-gray-600">Your Total Points</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Medal className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{friends.length}</p>
                <p className="text-sm text-gray-600">Friends</p>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {period === "week" && "Weekly Points Ranking"}
                {period === "month" && "Monthly Points Ranking"}
                {period === "all" && "All-Time Points Ranking"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.length > 0 ? (
                  leaderboard.map((userData: any, index: number) => {
                    const position = index + 1;
                    const isCurrentUser = user?.id === userData.id;
                    
                    return (
                      <div
                        key={userData.id}
                        className={cn(
                          "flex items-center space-x-4 p-4 rounded-lg transition-all",
                          getPositionStyle(position, isCurrentUser)
                        )}
                      >
                        <div className="flex items-center justify-center w-8 h-8">
                          {getRankIcon(position)}
                        </div>
                        
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          position === 1 
                            ? "bg-white bg-opacity-20" 
                            : "bg-primary"
                        )}>
                          <span className={cn(
                            "font-semibold",
                            position === 1 ? "text-white" : "text-white"
                          )}>
                            {getUserInitials(userData)}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className={cn(
                            "font-semibold",
                            position === 1 ? "text-white" : "text-gray-900"
                          )}>
                            {getUserName(userData)}
                            {isCurrentUser && " (You)"}
                          </h4>
                          <p className={cn(
                            "text-sm",
                            position === 1 ? "text-white opacity-80" : "text-gray-600"
                          )}>
                            {/* Mock workout data - in real app this would come from aggregated workout stats */}
                            {Math.floor(Math.random() * 5) + 1} workouts • {Math.floor(Math.random() * 15000) + 5000} steps
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className={cn(
                            "text-2xl font-bold",
                            position === 1 ? "text-white" : 
                            isCurrentUser ? "text-primary" : "text-gray-900"
                          )}>
                            {formatPoints(userData.totalPoints || 0)}
                          </p>
                          <p className={cn(
                            "text-sm",
                            position === 1 ? "text-white opacity-80" : 
                            isCurrentUser ? "text-primary opacity-80" : "text-gray-600"
                          )}>
                            points
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Rankings Yet</h3>
                    <p className="text-sm">
                      Complete workouts and invite friends to see the leaderboard in action!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Challenge Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Weekly Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-primary to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Step Challenge</h3>
                    <p className="text-blue-100">Who can walk the most steps this week?</p>
                  </div>
                  <Badge variant="secondary" className="bg-white bg-opacity-20 text-white">
                    5 days left
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Your Progress</span>
                    <span className="font-bold">42,350 steps</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                    <div className="bg-white h-3 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                  <div className="flex justify-between text-sm opacity-90">
                    <span>Goal: 70,000 steps</span>
                    <span>68% complete</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
