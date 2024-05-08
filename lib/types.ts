import { ReactNode } from "react";

export interface ServerMessage {
  id: string;
  name?: string;
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

// Define the AI state and UI state types
export type AIState = Array<ServerMessage>;

export type UIState = Array<ClientMessage>;
