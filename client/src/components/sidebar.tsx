import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Dumbbell, 
  Apple, 
  Bot, 
  TrendingUp, 
  Trophy, 
  Users, 
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Track Workout", href: "/workout", icon: Dumbbell },
  { name: "Nutrition", href: "/nutrition", icon: Apple },
  { name: "AI Coach", href: "/ai-coach", icon: Bot },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Friends", href: "/friends", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

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
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white shadow-xl border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FitTracker Pro</span>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="mr-3 w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email || "User"
              }
            </p>
            <p className="text-xs text-gray-500">{user?.totalPoints || 0} points</p>
          </div>
          <button 
            onClick={() => window.location.href = '/api/logout'}
            className="text-gray-400 hover:text-gray-600 p-2"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
