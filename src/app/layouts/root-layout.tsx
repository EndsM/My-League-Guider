import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  RiDashboardLine,
  RiDatabase2Line,
  RiSettings3Line,
} from "@remixicon/react";
import { NavLink, Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="bg-background text-foreground flex h-full w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-muted/30 flex w-52 shrink-0 flex-col gap-4 border-r p-3">
        <div className="flex items-center gap-2 px-2 py-4">
          <h2 className="text-lg font-bold tracking-tight">League Guider</h2>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem to="/" icon={RiDashboardLine} label="Dashboard" />
          <NavItem to="/champions" icon={RiDatabase2Line} label="Champions" />
          <NavItem to="/settings" icon={RiSettings3Line} label="Settings" />
        </nav>
      </aside>

      {/* Main Content - Renders the child route */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

// Helper for consistent navigation links
function NavItem({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: any;
  label: string;
}) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2",
            isActive && "bg-secondary",
          )}
        >
          <Icon className="size-4" />
          {label}
        </Button>
      )}
    </NavLink>
  );
}
