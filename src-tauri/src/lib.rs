mod ai;
mod data;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            ai::send_chat_request,
            ai::save_ai_profile,
            ai::get_ai_profiles,
            ai::delete_ai_profile,
            data::get_data_status,
            data::update_data,
            data::load_local_data,
            data::get_champions
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
