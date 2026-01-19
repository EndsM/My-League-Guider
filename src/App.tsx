import { useState } from "react";
import "./App.css";
import SettingsManager from "./components/SettingsManager";

type Tab = "dashboard" | "settings";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>League Guider</h2>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === "dashboard" && (
          <div className="dashboard-view">
            <h1>Dashboard</h1>
            <p>Planed features:</p>
            <div className="dashboard-card">
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                Audio input and output for BP choices
              </p>
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                Context of the current version's heroes' stats
              </p>
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                BYOK approach and customizable endpoints
              </p>
            </div>
          </div>
        )}

        {activeTab === "settings" && <SettingsManager />}
      </main>
    </div>
  );
}

export default App;
