import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Edit,
  Save,
  Calendar,
  Flame,
  Trophy,
  Star,
  Activity,
  Target,
  TrendingUp,
  Settings,
  LogOut
} from "lucide-react";
import { SignOutButton } from "@clerk/clerk-react";

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    height: user?.height || "",
    currentWeight: user?.currentWeight || "",
    goalWeight: user?.goalWeight || "",
    activityLevel: user?.activityLevel || "",
    fitnessGoal: user?.fitnessGoal || "",
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ["/api/workouts", { limit: 5 }],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/user/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updateData = {
      firstName: formData.firstName || null,
      lastName: formData.lastName || null,
      age: formData.age ? parseInt(formData.age) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      currentWeight: formData.currentWeight ? parseFloat(formData.currentWeight) : null,
      goalWeight: formData.goalWeight ? parseFloat(formData.goalWeight) : null,
      activityLevel: formData.activityLevel || null,
      fitnessGoal: formData.fitnessGoal || null,
    };

    updateProfileMutation.mutate(updateData);
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

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  const getActivityLevelDisplay = (level: string) => {
    switch (level) {
      case "sedentary": return "Sedentary";
      case "moderate": return "Moderately Active";
      case "active": return "Active";
      case "very_active": return "Very Active";
      default: return "Not specified";
    }
  };

  const getFitnessGoalDisplay = (goal: string) => {
    switch (goal) {
      case "lose_weight": return "Lose Weight";
      case "build_muscle": return "Build Muscle";
      case "improve_endurance": return "Improve Endurance";
      case "general_fitness": return "General Fitness";
      default: return "Not specified";
    }
  };

  // Calculate some stats
  const totalCalories = workouts.reduce((sum: number, w: any) => sum + (w.caloriesBurned || 0), 0);
  const totalDuration = workouts.reduce((sum: number, w: any) => sum + (w.duration || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-600">Manage your account settings</p>
          </div>
          <SignOutButton>
            <Button
              variant="outline"
              className="text-gray-600 border-gray-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </SignOutButton>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{getUserInitials()}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{getUserName()}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <Badge variant="secondary" className="bg-accent bg-opacity-10 text-accent">
                      <Flame className="w-3 h-3 mr-1" />
                      {user?.currentStreak || 0} day streak
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="John"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="Doe"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            placeholder="28"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            step="0.1"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            placeholder="175"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                          <Input
                            id="currentWeight"
                            type="number"
                            step="0.1"
                            value={formData.currentWeight}
                            onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                            placeholder="72"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
                          <Input
                            id="goalWeight"
                            type="number"
                            step="0.1"
                            value={formData.goalWeight}
                            onChange={(e) => setFormData({ ...formData, goalWeight: e.target.value })}
                            placeholder="68"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="activityLevel">Activity Level</Label>
                          <Select
                            value={formData.activityLevel}
                            onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sedentary">Sedentary</SelectItem>
                              <SelectItem value="moderate">Moderately Active</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="very_active">Very Active</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                          <Select
                            value={formData.fitnessGoal}
                            onValueChange={(value) => setFormData({ ...formData, fitnessGoal: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select fitness goal" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lose_weight">Lose Weight</SelectItem>
                              <SelectItem value="build_muscle">Build Muscle</SelectItem>
                              <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                              <SelectItem value="general_fitness">General Fitness</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Age</Label>
                          <p className="font-medium">{user?.age || "Not specified"}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600">Height</Label>
                          <p className="font-medium">{user?.height ? `${user.height} cm` : "Not specified"}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600">Current Weight</Label>
                          <p className="font-medium">{user?.currentWeight ? `${user.currentWeight} kg` : "Not specified"}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600">Goal Weight</Label>
                          <p className="font-medium">{user?.goalWeight ? `${user.goalWeight} kg` : "Not specified"}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600">Activity Level</Label>
                          <p className="font-medium">{getActivityLevelDisplay(user?.activityLevel || "")}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600">Fitness Goal</Label>
                          <p className="font-medium">{getFitnessGoalDisplay(user?.fitnessGoal || "")}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats & Achievements */}
            <div className="space-y-6">
              {/* Achievement Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  {achievements.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {achievements.slice(0, 6).map((achievement: any) => (
                        <div key={achievement.id} className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-accent to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-xs font-medium text-gray-900 truncate" title={achievement.title}>
                            {achievement.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500">No achievements yet</p>
                      <p className="text-xs text-gray-400">Keep working out to unlock them!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* All-Time Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>All-Time Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Workouts</span>
                      <span className="text-sm font-semibold text-gray-900">{stats?.totalWorkouts || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Calories</span>
                      <span className="text-sm font-semibold text-gray-900">{stats?.totalCalories || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Points</span>
                      <span className="text-sm font-semibold text-gray-900">{user?.totalPoints || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Streak</span>
                      <span className="text-sm font-semibold text-gray-900">{user?.currentStreak || 0} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{workouts.length} Workouts</p>
                        <p className="text-xs text-gray-500">This week</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                        <Flame className="w-4 h-4 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{totalCalories} Calories</p>
                        <p className="text-xs text-gray-500">Burned</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{Math.round(totalDuration / 60)} Hours</p>
                        <p className="text-xs text-gray-500">Training time</p>
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
