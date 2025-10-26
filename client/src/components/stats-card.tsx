import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: "primary" | "secondary" | "accent" | "warning" | "success";
}

const colorClasses = {
  primary: "from-primary to-blue-600",
  secondary: "from-secondary to-green-600", 
  accent: "from-accent to-yellow-600",
  warning: "from-warning to-red-500",
  success: "from-success to-green-600",
};

const subtitleColors = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent", 
  warning: "text-warning",
  success: "text-success",
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color }: StatsCardProps) {
  return (
    <Card className="border border-gray-100 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={cn("text-xs", subtitleColors[color])}>{subtitle}</p>
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br",
            colorClasses[color]
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
