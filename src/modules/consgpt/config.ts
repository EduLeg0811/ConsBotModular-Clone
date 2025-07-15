import { MessageCircle } from "lucide-react";
import { ModuleConfig } from "../shared/types";
import { ConsGptModule } from "./ConsGptModule";

export const ConsGptConfig: ModuleConfig = {
  id: 'consgpt',
  title: 'Cons.GPT',
  description: 'ChatBot OpenAI ChtaGPT.',
  icon: MessageCircle,
  badge: 'Available',
  component: ConsGptModule
};