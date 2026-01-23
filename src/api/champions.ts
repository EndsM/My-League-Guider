import { invoke } from "@tauri-apps/api/core";
import { Champion, DataStatus } from "@/types";

export const championApi = {
  getStatus: async () => {
    return await invoke<DataStatus>("get_data_status");
  },

  updateData: async () => {
    return await invoke<string>("update_data");
  },

  loadLocalData: async () => {
    return await invoke<string>("load_local_data");
  },

  getAll: async () => {
    return await invoke<Champion[]>("get_champions");
  },
};
