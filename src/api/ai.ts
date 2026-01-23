import { invoke } from "@tauri-apps/api/core";
import { AiProfile } from "@/types";

export const aiApi = {
  getProfiles: async () => await invoke<AiProfile[]>("get_ai_profiles"),

  saveProfile: async (
    profile: Omit<AiProfile, "id"> & { id?: string },
    apiKey: string,
  ) => {
    return await invoke("save_ai_profile", { profile, apiKey });
  },

  deleteProfile: async (id: string) =>
    await invoke("delete_ai_profile", { id }),
};
