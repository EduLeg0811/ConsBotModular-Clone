import { chatbotConfig } from './chatbot';
import { bibliomanciaConfig } from './bibliomancia';
import { ConsGptConfig } from './consgpt';
import { consLmConfig } from './conslm';
import { ModuleConfig } from './shared/types';
import { Brain, Palette, Code, Zap } from 'lucide-react';

// Available modules
export const availableModules: ModuleConfig[] = [
  chatbotConfig,
  bibliomanciaConfig,
  ConsGptConfig,
  consLmConfig
];

// Coming soon modules (for display purposes)
export const comingSoonModules = [
  {
    id: 'knowledge-base',
    title: 'Knowledge Base',
    description: 'Intelligent knowledge management and retrieval system for your personal or professional needs.',
    icon: Brain,
    badge: 'Coming Soon',
    disabled: true
  },
  {
    id: 'workflow-automation',
    title: 'Workflow Automation',
    description: 'Automate complex workflows and processes using AI-driven decision making and task execution.',
    icon: Zap,
    badge: 'Coming Soon',
    disabled: true
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