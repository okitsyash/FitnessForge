import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Utensils, Droplets, MoreHorizontal } from "lucide-react";

export default function Nutrition() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    mealType: "",
    foodItem: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const { data: nutrition = [] } = useQuery({
    queryKey: ["/api/nutrition", { date: today }],
  });

  const { data: waterIntake } = useQuery({
    queryKey: ["/api/water-intake", { date: today }],
  });

  const createNutritionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/nutrition", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition"] });
      toast({
        title: "Meal logged successfully!",
        description: "Your nutrition data has been updated.",
      });
      setFormData({
        mealType: "",
        foodItem: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log meal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateWaterMutation = useMutation({
    mutationFn: async (glasses: number) => {
      const response = await apiRequest("POST", "/api/water-intake", { amount: glasses * 250 });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/water-intake"] });
      toast({
        title: "Water intake updated!",
        description: "Keep up the great hydration!",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.mealType || !formData.foodItem) {
      toast({
        title: "Missing information",
        description: "Please fill in meal type and food item.",
        variant: "destructive",
      });
      return;
    }

    createNutritionMutation.mutate({
      mealType: formData.mealType,
      foodItem: formData.foodItem,
      calories: formData.calories ? parseInt(formData.calories) : null,
      protein: formData.protein ? parseInt(formData.protein) : null,
      carbs: formData.carbs ? parseInt(formData.carbs) : null,
      fat: formData.fat ? parseInt(formData.fat) : null,
    });
  };

  const updateWaterIntake = (glasses: number) => {
    updateWaterMutation.mutate(glasses);
  };

  // Calculate daily totals
  const dailyTotals = nutrition.reduce(
    (totals: any, meal: any) => ({
      calories: totals.calories + (meal.calories || 0),
      protein: totals.protein + (parseFloat(meal.protein) || 0),
      carbs: totals.carbs + (parseFloat(meal.carbs) || 0),
      fat: totals.fat + (parseFloat(meal.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const CircularProgress = ({ value, max, label }: { value: number; max: number; label: string }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 28;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="28"
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r="28"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="progress-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-semibold text-gray-900">{Math.round(percentage)}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nutrition</h1>
            <p className="text-sm text-gray-600">Monitor your daily intake</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Nutrition Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Calories</p>
                    <p className="text-2xl font-bold text-gray-900">{dailyTotals.calories}</p>
                    <p className="text-xs text-gray-500">Goal: 2,000</p>
                  </div>
                  <CircularProgress value={dailyTotals.calories} max={2000} label="Calories" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Protein</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(dailyTotals.protein)}g</p>
                    <p className="text-xs text-gray-500">Goal: 120g</p>
                  </div>
                  <CircularProgress value={dailyTotals.protein} max={120} label="Protein" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Carbs</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(dailyTotals.carbs)}g</p>
                    <p className="text-xs text-gray-500">Goal: 250g</p>
                  </div>
                  <CircularProgress value={dailyTotals.carbs} max={250} label="Carbs" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Water</p>
                    <p className="text-2xl font-bold text-gray-900">{waterIntake?.glasses || 0}/8</p>
                    <p className="text-xs text-gray-500">glasses</p>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-8 rounded-full cursor-pointer transition-colors ${i < (waterIntake?.glasses || 0) ? 'bg-blue-500' : 'bg-gray-200'
                          }`}
                        onClick={() => updateWaterIntake(i + 1)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meal Logging */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Log Meal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mealType">Meal Type *</Label>
                    <Select
                      value={formData.mealType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, mealType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="foodItem">Food Item *</Label>
                    <Input
                      id="foodItem"
                      placeholder="e.g., Grilled Chicken Breast"
                      value={formData.foodItem}
                      onChange={(e) =>
                        setFormData({ ...formData, foodItem: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="250"
                      value={formData.calories}
                      onChange={(e) =>
                        setFormData({ ...formData, calories: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      step="0.1"
                      placeholder="25"
                      value={formData.protein}
                      onChange={(e) =>
                        setFormData({ ...formData, protein: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      step="0.1"
                      placeholder="15"
                      value={formData.carbs}
                      onChange={(e) =>
                        setFormData({ ...formData, carbs: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={createNutritionMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {createNutritionMutation.isPending ? "Adding..." : "Add Meal"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Today's Meals */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nutrition.map((meal: any) => (
                  <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                        <Utensils className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{meal.foodItem}</h4>
                        <p className="text-sm text-gray-600">
                          {meal.calories || 0} calories
                          {meal.protein && ` • ${parseFloat(meal.protein)}g protein`}
                          {meal.carbs && ` • ${parseFloat(meal.carbs)}g carbs`}
                          {meal.fat && ` • ${parseFloat(meal.fat)}g fat`}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {meal.mealType} • {new Date(meal.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {nutrition.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Utensils className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No meals logged today</p>
                    <p className="text-xs">Start tracking your nutrition above!</p>
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
