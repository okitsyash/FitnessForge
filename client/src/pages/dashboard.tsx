import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/stats-card";
import ProgressChart from "@/components/progress-chart";
import { Flame, Target, Trophy, Star, Clock, MapPin, Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: dailyGoals } = useQuery({
    queryKey: ["/api/daily-goals", { date: new Date().toISOString().split('T')[0] }],
  });

  const { data: recentWorkouts } = useQuery({
    queryKey: ["/api/workouts", { limit: 5 }],
  });

  const { data: waterIntake } = useQuery({
    queryKey: ["/api/water-intake", { date: new Date().toISOString().split('T')[0] }],
  });

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Track your fitness journey</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Streak Counter - Fixed visibility and styling */}
            <div className="flex items-center bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-lg border border-orange-300 shadow-sm">
              <Flame className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-sm font-bold text-orange-800" style={{ color: '#DC2626' }}>
                🔥 {stats?.user?.currentStreak || 0} day streak!
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 lg:p-6 pb-24">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Calories Burned"
            value={stats?.totalCalories || 0}
            subtitle="+12% from yesterday"
            icon={Flame}
            color="warning"
          />
          <StatsCard
            title="Steps Today"
            value="8,456"
            subtitle="Goal: 10,000"
            icon={MapPin}
            color="secondary"
          />
          <StatsCard
            title="Total Workouts"
            value={stats?.totalWorkouts || 0}
            subtitle="This month"
            icon={Activity}
            color="primary"
          />
          <StatsCard
            title="Points Earned"
            value={user?.totalPoints || 0}
            subtitle="+50 today"
            icon={Star}
            color="accent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Weekly Progress</CardTitle>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                    <option>This Week</option>
                    <option>Last Week</option>
                    <option>This Month</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ProgressChart />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Today's Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyGoals?.map((goal: any) => (
                    <div key={goal.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${goal.completed ? 'bg-secondary' : 'bg-gray-200'
                          }`}>
                          <Target className={`w-4 h-4 ${goal.completed ? 'text-white' : 'text-gray-400'
                            }`} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {goal.goalType === 'steps' && `${goal.targetValue} Steps`}
                          {goal.goalType === 'water' && `${goal.targetValue} Glasses Water`}
                          {goal.goalType === 'workout' && `${goal.targetValue} Min Workout`}
                          {goal.goalType === 'calories' && `${goal.targetValue} Calories`}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold ${goal.completed ? 'text-secondary' : 'text-gray-500'
                        }`}>
                        {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                      </span>
                    </div>
                  ))}

                  {/* Water intake display */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${(waterIntake?.glasses || 0) >= 8 ? 'bg-secondary' : 'bg-gray-200'
                        }`}>
                        <Target className={`w-4 h-4 ${(waterIntake?.glasses || 0) >= 8 ? 'text-white' : 'text-gray-400'
                          }`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">8 Glasses Water</span>
                    </div>
                    <span className={`text-xs font-semibold ${(waterIntake?.glasses || 0) >= 8 ? 'text-secondary' : 'text-gray-500'
                      }`}>
                      {Math.round(((waterIntake?.glasses || 0) / 8) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentWorkouts?.map((workout: any) => (
                    <div key={workout.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{workout.exerciseType}</p>
                        <p className="text-xs text-gray-500">
                          {workout.duration} minutes • {workout.caloriesBurned} calories • {new Date(workout.date).toLocaleDateString()}
                        </p>
                      </div>
                      {workout.pointsEarned && (
                        <Badge variant="secondary" className="text-xs">
                          +{workout.pointsEarned} pts
                        </Badge>
                      )}
                    </div>
                  ))}

                  {(!recentWorkouts || recentWorkouts.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No recent workouts</p>
                      <p className="text-xs">Start tracking your workouts to see them here!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
