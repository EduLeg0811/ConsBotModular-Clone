import { Brain } from "lucide-react";
import { ModuleConfig } from "../shared/types";
import { ECWVRAGModule } from "./ECWVRAGModule";

export const ecwvragConfig: ModuleConfig = {
  id: 'ecwvrag',
  title: 'RAG Bot',
  description: 'Chatbot RAG especializado com base de conhecimento ECWV usando Response API.',
  icon: Brain,
  badge: 'RAG',
  component: ECWVRAGModule
};