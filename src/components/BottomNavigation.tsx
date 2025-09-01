import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Plus,
  CreditCard,
  History,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Payment", url: "/payment-tracking", icon: CreditCard },
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
      <div className="flex items-center justify-around h-16 px-2">
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
                  "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
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
              className="flex flex-col items-center justify-center min-w-0 flex-1 py-2"
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
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