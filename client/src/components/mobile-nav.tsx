import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Dumbbell, 
  Apple, 
  Bot, 
  User
} from "lucide-react";

const mobileNavigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Workout", href: "/workout", icon: Dumbbell },
  { name: "Nutrition", href: "/nutrition", icon: Apple },
  { name: "AI Coach", href: "/ai-coach", icon: Bot },
  { name: "Profile", href: "/profile", icon: User },
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-2">
        {mobileNavigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 transition-colors",
                isActive ? "text-primary" : "text-gray-500"
              )}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
