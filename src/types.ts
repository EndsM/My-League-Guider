export interface AiProfile {
    id: string;
    name: string;
    endpoint: string;
    model: string;
}

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}