import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Plus,
  CreditCard,
  History,
  Bell,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Create", url: "/create-order", icon: Plus, isCTA: true },
  { title: "History", url: "/history", icon: History },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

export function BottomNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around px-2" style={{ height: '120px' }}>
        {navigationItems.map((item) => {
          const active = isActive(item.url);
          
          if (item.isCTA) {
            return (
              <NavLink
                key={item.title}
                to={item.url}
                className="flex flex-col items-center justify-center"
              >
                <div className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center transition-colors",
                  active 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-xs mt-1 text-muted-foreground">
                  {item.title}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.title}
              to={item.url}
              className="flex flex-col items-center justify-center min-w-0 flex-1"
              style={{ padding: '48px' }}
            >
              <item.icon className={cn(
                "h-6 w-6 transition-colors",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )} />
              <span className={cn(
                "text-xs mt-1 transition-colors truncate",
                active 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}>
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}