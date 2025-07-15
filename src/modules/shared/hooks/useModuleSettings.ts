import { useState, useCallback } from 'react';
import { OpenAISettings } from '../types';

const DEFAULT_SETTINGS: OpenAISettings = {
  apiKey: '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',
  temperature: 0.7,
  maxTokens: 2000,
  model: 'gpt-4.1-nano'
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

  const isConfigured = Boolean(settings.apiKey);

  return {
    settings,
    updateSettings,
    isConfigured
  };
}