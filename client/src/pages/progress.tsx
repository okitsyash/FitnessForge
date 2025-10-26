import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, Award, Activity, Flame } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Progress() {
  const [timeRange, setTimeRange] = useState("week");

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/achievements"],
  });

  // Get data for charts based on time range
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (timeRange) {
      case "week":
        start.setDate(end.getDate() - 7);
        break;
      case "month":
        start.setMonth(end.getMonth() - 1);
        break;
      case "year":
        start.setFullYear(end.getFullYear() - 1);
        break;
    }
    
    return { start, end };
  };

  const { start, end } = getDateRange();

  const { data: workouts = [] } = useQuery({
    queryKey: ["/api/workouts/range", { 
      startDate: start.toISOString().split('T')[0], 
      endDate: end.toISOString().split('T')[0] 
    }],
  });

  const { data: nutrition = [] } = useQuery({
    queryKey: ["/api/nutrition"],
  });

  // Process workout data for charts
  const processWorkoutData = () => {
    const labels = [];
    const dates = [];
    
    // Generate date labels based on time range
    if (timeRange === "week") {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
    } else if (timeRange === "month") {
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date);
        labels.push(date.getDate().toString());
      }
    }

    // Group workouts by date
    const dailyData = dates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const dayWorkouts = workouts.filter((workout: any) => 
        new Date(workout.date).toISOString().split('T')[0] === dateStr
      );
      
      return {
        date: dateStr,
        calories: dayWorkouts.reduce((sum: number, w: any) => sum + (w.caloriesBurned || 0), 0),
        duration: dayWorkouts.reduce((sum: number, w: any) => sum + (w.duration || 0), 0),
        count: dayWorkouts.length,
      };
    });

    return { labels, dailyData };
  };

  const { labels, dailyData } = processWorkoutData();

  const workoutChartData = {
    labels,
    datasets: [
      {
        label: 'Calories Burned',
        data: dailyData.map(d => d.calories),
        borderColor: 'hsl(248, 84%, 68%)',
        backgroundColor: 'hsla(248, 84%, 68%, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Duration (minutes)',
        data: dailyData.map(d => d.duration),
        borderColor: 'hsl(158, 64%, 52%)',
        backgroundColor: 'hsla(158, 64%, 52%, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const workoutFrequencyData = {
    labels,
    datasets: [
      {
        label: 'Workouts',
        data: dailyData.map(d => d.count),
        backgroundColor: 'hsl(43, 96%, 56%)',
        borderColor: 'hsl(43, 96%, 56%)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Calculate progress metrics
  const totalCalories = workouts.reduce((sum: number, w: any) => sum + (w.caloriesBurned || 0), 0);
  const totalDuration = workouts.reduce((sum: number, w: any) => sum + (w.duration || 0), 0);
  const averageCaloriesPerWorkout = workouts.length > 0 ? Math.round(totalCalories / workouts.length) : 0;
  const workoutStreak = calculateWorkoutStreak(workouts);

  function calculateWorkoutStreak(workouts: any[]) {
    if (!workouts.length) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasWorkout = workouts.some((w: any) => 
        new Date(w.date).toISOString().split('T')[0] === dateStr
      );
      
      if (hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
            <p className="text-sm text-gray-600">View your fitness analytics</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Workouts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalWorkouts || 0}</p>
                    <p className="text-xs text-primary">All time</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Calories</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalCalories || 0}</p>
                    <p className="text-xs text-warning">Burned</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-warning to-red-500 rounded-lg flex items-center justify-center">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Workout Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{workoutStreak}</p>
                    <p className="text-xs text-secondary">Days</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-green-600 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Calories</p>
                    <p className="text-2xl font-bold text-gray-900">{averageCaloriesPerWorkout}</p>
                    <p className="text-xs text-accent">Per workout</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-yellow-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Workout Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Workout Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line data={workoutChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            {/* Workout Frequency */}
            <Card>
              <CardHeader>
                <CardTitle>Workout Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar data={workoutFrequencyData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements and Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.length > 0 ? (
                    achievements.slice(0, 5).map((achievement: any) => (
                      <div key={achievement.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent to-yellow-600 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-accent bg-opacity-10 text-accent">
                          +{achievement.pointsAwarded} pts
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No achievements yet</p>
                      <p className="text-xs">Keep working out to unlock achievements!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Goal Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample goals - in a real app, these would come from the API */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Monthly Workouts</span>
                        <span className="text-gray-600">{workouts.length}/20</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min((workouts.length / 20) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Calories Burned</span>
                        <span className="text-gray-600">{totalCalories}/5000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-warning h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min((totalCalories / 5000) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Workout Minutes</span>
                        <span className="text-gray-600">{totalDuration}/1200</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-secondary h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min((totalDuration / 1200) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Goal completion message */}
                  <div className="mt-6 p-3 bg-secondary bg-opacity-10 rounded-lg">
                    <p className="text-sm text-secondary font-medium">
                      You're on track to meet your monthly goals! Keep it up! 💪
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
