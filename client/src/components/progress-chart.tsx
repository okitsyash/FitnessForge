import { useQuery } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProgressChart() {
  // Get the past week's dates
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const startDate = weekDates[0];
  const endDate = weekDates[weekDates.length - 1];

  const { data: workouts = [] } = useQuery({
    queryKey: ["/api/workouts/range", { 
      startDate: startDate.toISOString().split('T')[0], 
      endDate: endDate.toISOString().split('T')[0] 
    }],
  });

  // Process data for chart
  const processChartData = () => {
    const labels = weekDates.map(date => 
      date.toLocaleDateString('en-US', { weekday: 'short' })
    );

    // Group workouts by date and calculate daily totals
    const dailyData = weekDates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const dayWorkouts = workouts.filter((workout: any) => 
        new Date(workout.date).toISOString().split('T')[0] === dateStr
      );
      
      const calories = dayWorkouts.reduce((sum: number, workout: any) => 
        sum + (workout.caloriesBurned || 0), 0
      );
      
      const duration = dayWorkouts.reduce((sum: number, workout: any) => 
        sum + (workout.duration || 0), 0
      );

      return { calories, duration };
    });

    return {
      labels,
      datasets: [
        {
          label: 'Calories Burned',
          data: dailyData.map(d => d.calories),
          borderColor: 'hsl(248, 84%, 68%)', // primary color
          backgroundColor: 'hsla(248, 84%, 68%, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Workout Duration (min)',
          data: dailyData.map(d => d.duration),
          borderColor: 'hsl(158, 64%, 52%)', // secondary color
          backgroundColor: 'hsla(158, 64%, 52%, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const options = {
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

  return <Line data={processChartData()} options={options} />;
}
