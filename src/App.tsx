import { Button } from "@/components/ui/button";
import { RiDashboardLine, RiSettings3Line } from "@remixicon/react";
import { useState } from "react";
import SettingsManager from "./components/SettingsManager";

type Tab = "dashboard" | "settings";

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 flex flex-col p-4 gap-4">
        <div className="flex items-center gap-2 px-2 py-4">
          <h2 className="text-lg font-bold tracking-tight">League Guider</h2>
        </div>

        <nav className="flex flex-col gap-2">
          <Button
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            className="justify-start gap-2"
            onClick={() => setActiveTab("dashboard")}
          >
            <RiDashboardLine className="size-4" />
            Dashboard
          </Button>

          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className="justify-start gap-2"
            onClick={() => setActiveTab("settings")}
          >
            <RiSettings3Line className="size-4" />
            Settings
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === "dashboard" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Cards styled as simplified Cards */}
              <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <h3 className="font-semibold leading-none tracking-tight mb-2">
                  BP Voice
                </h3>
                <p className="text-sm text-muted-foreground">
                  Audio input and output for BP choices
                </p>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <h3 className="font-semibold leading-none tracking-tight mb-2">
                  Live Context
                </h3>
                <p className="text-sm text-muted-foreground">
                  Current version's hero stats integration
                </p>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <h3 className="font-semibold leading-none tracking-tight mb-2">
                  BYOK
                </h3>
                <p className="text-sm text-muted-foreground">
                  Bring Your Own Key & customizable endpoints
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && <SettingsManager />}
      </main>
    </div>
  );
}

export default App;
