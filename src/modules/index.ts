import { chatbotConfig } from './chatbot';
import { bibliomanciaConfig } from './bibliomancia';
import { ConsGptConfig } from './consgpt';
import { ModuleConfig } from './shared/types';
import { Brain, Palette, Code, Zap } from 'lucide-react';

// Available modules
export const availableModules: ModuleConfig[] = [
  chatbotConfig,
  bibliomanciaConfig,
  ConsGptConfig
];

// Coming soon modules (for display purposes)
export const comingSoonModules = [
  {
    id: 'code-assistant',
    title: 'Cons.GPT',
    description: 'Assistente ChatGPT (OpenAI) com os tratados conscienciológicos.',
    icon: Code,
    badge: 'Available',
    //disabled: true
  },
  {
    id: 'creative-writer',
    title: 'Cons.LM',
    description: 'Assistente NotebookLM (Gemini) com os tratados conscienciológicos.',
    icon: Palette,
    badge: 'Available',
    //disabled: true
  },
  {
    id: 'knowledge-base',
    title: 'Knowledge Base',
    description: 'Intelligent knowledge management and retrieval system for your personal or professional needs.',
    icon: Brain,
    badge: 'Available',
    //disabled: true
  },
  {
    id: 'workflow-automation',
    title: 'Workflow Automation',
    description: 'Automate complex workflows and processes using AI-driven decision making and task execution.',
    icon: Zap,
    badge: 'Available',
    //disabled: true
  }
];

// All modules combined
export const allModules = [...availableModules, ...comingSoonModules];

// Helper function to get module by id
export function getModuleById(id: string): ModuleConfig | undefined {
  return availableModules.find(module => module.id === id);
}

// Helper function to check if module is available
export function isModuleAvailable(id: string): boolean {
  return availableModules.some(module => module.id === id);
}