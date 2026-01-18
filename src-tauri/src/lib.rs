mod ai;

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
            ai::delete_ai_profile
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
