import { useState, useCallback } from 'react';
import { OpenAISettings } from '../types';

const DEFAULT_SETTINGS: OpenAISettings = {
  apiKey: '', // Removed default API key - now loaded from env
  temperature: 0.7,
  maxTokens: 2000,
  model: 'gpt-4o-mini'
};

export function useModuleSettings(moduleId: string) {
  const [settings, setSettings] = useState<OpenAISettings>(() => {
    const stored = localStorage.getItem(`${moduleId}-settings`);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  });

  const updateSettings = useCallback((newSettings: OpenAISettings) => {
    setSettings(newSettings);
    localStorage.setItem(`${moduleId}-settings`, JSON.stringify(newSettings));
  }, [moduleId]);

  // API key is now always configured via environment variables
  const isConfigured = true;

  return {
    settings,
    updateSettings,
    isConfigured
  };
}