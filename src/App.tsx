import { useState } from "react";
import "./App.css";
import SettingsManager from "./components/SettingsManager";

type Tab = "chat" | "settings";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  return (
    <main className="container">
      {/* Navigation Tabs */}
      <nav className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          Main
        </button>
        <button
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </nav>

      {/* Main Content Area */}
      <section className="tab-content" style={{ padding: "2rem" }}>
        {activeTab === "chat" && (
          <div className="main-tab-content">
            <h1>League Guider</h1>
            <p>Start work on settings tab first.</p>
          </div>
        )}

        {activeTab === "settings" && <SettingsManager />}
      </section>
    </main>
  );
}

export default App;
