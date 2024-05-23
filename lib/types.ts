import { ReactNode } from "react";
import { DocumentItemIncluded } from "@/prisma/db/document";
import { JobItemIncluded } from "@/prisma/db/job";

export interface ServerMessage {
  id: string;
  name?: string;
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  value: string;
  display: ReactNode;
}

// Define the AI state and UI state types
export type AIState = {
  session?: {
    id: string;
    name: string;
    isFinished: boolean;
    totalTime: string;
    finishedAt: Date | null;
    docs: DocumentItemIncluded[];
    job: JobItemIncluded | null;
    additionalInfo: string | null;
  };
  messages: ServerMessage[];
};

export type UIState = Array<ClientMessage>;
