import { useEffect, useState } from "react";
import { AiProfile } from "../types";
import { invoke } from "@tauri-apps/api/core";

const DEFAULT_FORM_DATA = {
  id: "",
  name: "",
  endpoint: "https://gen.pollinations.ai/v1/chat/completions",
  model: "gemini",
  apiKey: "",
};

export default function SettingsManager() {
  const [profiles, setProfiles] = useState<AiProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    try {
      const data = await invoke<AiProfile[]>("get_ai_profiles");
      setProfiles(data);
    } catch (error) {
      console.error("Failed to load profiles:", error);
      alert("Failed to load profiles: " + error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setFormData(DEFAULT_FORM_DATA);
    setIsEditing(false);
  }

  function handleEdit(profile: AiProfile) {
    setFormData({
      id: profile.id,
      name: profile.name,
      endpoint: profile.endpoint,
      model: profile.model,
      apiKey: "",
    });
    setIsEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.endpoint || !formData.model) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!isEditing && !formData.apiKey) {
      alert("API Key is required for new profiles.");
      return;
    }

    setLoading(true);

    try {
      const id = isEditing && formData.id ? formData.id : crypto.randomUUID();

      const profilePayload = {
        id,
        name: formData.name,
        endpoint: formData.endpoint,
        model: formData.model,
      };

      // Call Rust command
      await invoke("save_ai_profile", {
        profile: profilePayload,
        apiKey: formData.apiKey,
      });

      await loadProfiles();
      resetForm();
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile: " + error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this profile?")) return;

    try {
      await invoke("delete_ai_profile", { id });
      await loadProfiles();
      if (formData.id === id) resetForm();
    } catch (error) {
      console.error("Failed to delete profile:", error);
      alert("Failed to delete profile: " + error);
    }
  }

  return (
    <div>
      <h2>AI Profiles Configuration</h2>

      {/* Editor Form */}
      <div>
        <h3>{isEditing ? "Edit Profile" : "Add New Profile"}</h3>
        <form onSubmit={handleSave}>
          <div>
            <label htmlFor="name">Profile Name (e.g., OpenAI, Local LLM)</label>
            <br />
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="My Assistant"
            />
          </div>
          <br />

          <div>
            <label htmlFor="endpoint">API Endpoint</label>
            <br />
            <input
              id="endpoint"
              name="endpoint"
              value={formData.endpoint}
              onChange={handleInputChange}
              placeholder="https://api.openai.com/v1/chat/completions"
            />
          </div>
          <br />

          <div>
            <label htmlFor="model">Model Name</label>
            <br />
            <input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="gpt-4o"
            />
          </div>
          <br />

          <div>
            <label htmlFor="apiKey">
              API Key {isEditing && "(Leave blank to keep existing)"}
            </label>
            <br />
            <input
              id="apiKey"
              name="apiKey"
              type="password"
              value={formData.apiKey}
              onChange={handleInputChange}
              placeholder="sk-..."
            />
          </div>
          <br />

          <div>
            {isEditing && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Profile"
                  : "Add Profile"}
            </button>
          </div>
        </form>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      {/* List of Profiles */}
      <h3>Existing Profiles</h3>
      {profiles.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No profiles found. Create one above.</p>
      ) : (
        <div>
          {profiles.map((profile) => (
            <div
              key={profile.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3>{profile.name}</h3>
              <p>
                <strong>Model:</strong> {profile.model}
              </p>
              <p>
                <strong>URL:</strong> {profile.endpoint}
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => handleEdit(profile)}>Edit</button>
                <button onClick={() => handleDelete(profile.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
