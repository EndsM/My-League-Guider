import { useEffect, useState } from "react";
import { AiProfile } from "../types";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RiDeleteBinLine,
  RiEditLine,
  RiSaveLine,
  RiCloseLine,
} from "@remixicon/react";

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
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Configuration</h2>
        <p className="text-muted-foreground mt-2">
          Manage your AI providers and API keys securely.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_300px]">
        {/* Left Column: Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Profile" : "Add New Profile"}
            </CardTitle>
            <CardDescription>
              Configure the connection details for your LLM provider.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSave}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Profile Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., OpenAI, Local LLM"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endpoint">API Endpoint</Label>
                <Input
                  id="endpoint"
                  name="endpoint"
                  placeholder="https://api.openai.com/v1/chat/completions"
                  value={formData.endpoint}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model Name</Label>
                <Input
                  id="model"
                  name="model"
                  placeholder="e.g., gpt-4o, llama-3"
                  value={formData.model}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">
                  API Key{" "}
                  {isEditing && (
                    <span className="text-muted-foreground font-normal">
                      (Leave blank to keep existing)
                    </span>
                  )}
                </Label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={formData.apiKey}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  <RiCloseLine className="mr-2 size-4" /> Cancel
                </Button>
              ) : (
                <div /> /* Spacer */
              )}
              <Button type="submit" disabled={loading}>
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <RiSaveLine className="mr-2 size-4" /> Save Profile
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Right Column: List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Saved Profiles</h3>
          {profiles.length === 0 ? (
            <div className="text-muted-foreground rounded-md border border-dashed p-4 text-center text-sm italic">
              No profiles found.
            </div>
          ) : (
            <div className="grid gap-3">
              {profiles.map((profile) => (
                <Card key={profile.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{profile.name}</CardTitle>
                    <CardDescription className="truncate text-xs">
                      {profile.model}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="bg-muted/40 flex justify-end gap-1 p-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2"
                      onClick={() => handleEdit(profile)}
                    >
                      <RiEditLine className="text-muted-foreground size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:text-destructive h-8 px-2"
                      onClick={() => handleDelete(profile.id)}
                    >
                      <RiDeleteBinLine className="size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
