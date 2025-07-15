import { MessageCircle } from "lucide-react";
import { ModuleConfig } from "../shared/types";
import { ChatbotModule } from "./ChatbotModule";

export const chatbotConfig: ModuleConfig = {
  id: 'chatbot',
  title: 'Cons.EDU',
  description: 'ChatBot Pesquisador Independente.',
  icon: MessageCircle,
  badge: 'Available',
  component: ChatbotModule
};