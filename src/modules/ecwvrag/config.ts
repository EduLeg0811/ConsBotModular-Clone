import { Brain } from "lucide-react";
import { ModuleConfig } from "../shared/types";
import { ECWVRAGModule } from "./ECWVRAGModule";

export const ecwvragConfig: ModuleConfig = {
  id: 'ecwvrag',
  title: 'RAG Bot',
  description: 'Chatbot RAG especializado em Conscienciologia.',
  icon: Brain,
  badge: 'RAG',
  component: ECWVRAGModule
};