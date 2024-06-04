import { ReactNode } from "react";
import { DocumentItemIncluded } from "@/prisma/db/document";
import { JobItemIncluded } from "@/prisma/db/job";
import { CoreMessage } from 'ai'

export type ServerMessage = CoreMessage & {
  id: string;
  createdAt?: Date;
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
    docs: DocumentItemIncluded[];
    job: JobItemIncluded | null;
    additionalInfo: string | null;
  };
  messages: ServerMessage[];
};

export type UIState = Array<ClientMessage>;
