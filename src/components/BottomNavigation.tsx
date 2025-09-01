import { useState } from "react";
import {
  Home,
  Plus,
  History,
  Bell,
  BarChart3,
} from "lucide-react";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Create", url: "/create-order", icon: Plus, isCTA: true },
  { title: "History", url: "/history", icon: History },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

export function BottomNavigation() {
  const [currentPath, setCurrentPath] = useState('/notifications');

  const isActive = (path) => currentPath === path;

  const handleNavigation = (url) => {
    setCurrentPath(url);
    // In a real app, you'd use navigate(url) here
    console.log(`Navigating to: ${url}`);
  };

  const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-2 sm:pb-4 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => {
          const active = isActive(item.url);
          
          if (item.isCTA) {
            return (
              <button
                key={item.title}
                onClick={() => handleNavigation(item.url)}
                className="flex flex-col items-center justify-center"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-md",
                  active
                    ? "bg-blue-500 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                )}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-xs mt-1 text-gray-600">
                  {item.title}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.title}
              onClick={() => handleNavigation(item.url)}
              className="flex flex-col items-center justify-center min-w-0 flex-1 py-2"
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                active
                  ? "text-blue-500"
                  : "text-gray-400 hover:text-gray-600"
              )} />
              <span className={cn(
                "text-xs mt-1 transition-colors truncate",
                active
                  ? "text-blue-500 font-medium"
                  : "text-gray-400"
              )}>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}