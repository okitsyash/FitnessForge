import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Activity, Save, Play, MoreHorizontal } from "lucide-react";

export default function Workout() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: "",
    duration: "",
    caloriesBurned: "",
    notes: "",
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ["/api/workouts", { limit: 10 }],
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/workouts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Workout logged successfully!",
        description: "You've earned points for completing your workout.",
      });
      setFormData({
        type: "",
        duration: "",
        caloriesBurned: "",
        notes: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.duration) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createWorkoutMutation.mutate({
      type: formData.type,
      duration: parseInt(formData.duration),
      caloriesBurned: formData.caloriesBurned ? parseInt(formData.caloriesBurned) : null,
      notes: formData.notes || null,
    });
  };

  const quickWorkouts = [
    { name: "Quick Run", type: "Running", duration: 30 },
    { name: "Strength Training", type: "Weight Training", duration: 45 },
    { name: "Cardio Blast", type: "Cardio", duration: 20 },
  ];

  const startQuickWorkout = (workout: any) => {
    setFormData({
      type: workout.type,
      duration: workout.duration.toString(),
      caloriesBurned: "",
      notes: "",
    });
    toast({
      title: `Starting ${workout.name}!`,
      description: "Form pre-filled with workout details.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Track Workout</h1>
            <p className="text-sm text-gray-600">Log your training sessions</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              {quickWorkouts.map((workout) => (
                <Button
                  key={workout.name}
                  onClick={() => startQuickWorkout(workout)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {workout.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Workout Logging Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Log New Workout</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Exercise Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Exercise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Running">Running</SelectItem>
                        <SelectItem value="Cycling">Cycling</SelectItem>
                        <SelectItem value="Swimming">Swimming</SelectItem>
                        <SelectItem value="Weight Training">Weight Training</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="Basketball">Basketball</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Walking">Walking</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="30"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories Burned</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="250"
                      value={formData.caloriesBurned}
                      onChange={(e) =>
                        setFormData({ ...formData, caloriesBurned: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    placeholder="How did the workout feel? Any achievements or challenges?"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={createWorkoutMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {createWorkoutMutation.isPending ? "Logging..." : "Log Workout"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Recent Workouts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workouts.map((workout: any) => (
                  <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{workout.type}</h4>
                        <p className="text-sm text-gray-600">
                          {workout.duration} minutes • {workout.caloriesBurned || 0} calories
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(workout.date).toLocaleDateString()} at {new Date(workout.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {workout.pointsEarned && (
                        <Badge variant="secondary" className="bg-secondary bg-opacity-10 text-secondary">
                          +{workout.pointsEarned} pts
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {workouts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No workouts logged yet</p>
                    <p className="text-xs">Start by logging your first workout above!</p>
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
