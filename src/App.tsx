import { Button } from "@/components/ui/button";
import { RiDashboardLine, RiSettings3Line } from "@remixicon/react";
import { useState } from "react";
import SettingsManager from "./components/SettingsManager";

type Tab = "dashboard" | "settings";

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="bg-background text-foreground flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-muted/30 flex w-52 flex-col gap-4 border-r p-3">
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
          <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Cards styled as simplified Cards */}
              <div className="bg-card text-card-foreground border p-6 shadow">
                <h3 className="mb-2 leading-none font-semibold tracking-tight">
                  BP Voice
                </h3>
                <p className="text-muted-foreground text-sm">
                  Audio input and output for BP choices
                </p>
              </div>
              <div className="bg-card text-card-foreground border p-6 shadow">
                <h3 className="mb-2 leading-none font-semibold tracking-tight">
                  Live Context
                </h3>
                <p className="text-muted-foreground text-sm">
                  Current version's hero stats integration
                </p>
              </div>
              <div className="bg-card text-card-foreground border p-6 shadow">
                <h3 className="mb-2 leading-none font-semibold tracking-tight">
                  BYOK
                </h3>
                <p className="text-muted-foreground text-sm">
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
