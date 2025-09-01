import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppLayout() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-16">
        <header className="h-16 border-b bg-background flex items-center px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Gewamu</h1>
            <p className="text-sm text-muted-foreground">Smart Office Lunch Splitter</p>
          </div>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="h-16 border-b bg-background flex items-center px-6">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-foreground">Gewamu</h1>
              <p className="text-sm text-muted-foreground">Smart Office Lunch Splitter</p>
            </div>
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}