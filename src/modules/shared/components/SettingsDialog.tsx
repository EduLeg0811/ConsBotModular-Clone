import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OpenAISettings } from "../types";

interface SettingsDialogProps {
  title: string;
  settings: OpenAISettings;
  onSettingsChange: (settings: OpenAISettings) => void;
  onClose: () => void;
}

export function SettingsDialog({ 
  title, 
  settings, 
  onSettingsChange, 
  onClose 
}: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<OpenAISettings>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{title} Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKey" className="text-sm font-medium">
              OpenAI API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={localSettings.apiKey}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="sk-..."
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
          
          <div>
            <Label htmlFor="temperature" className="text-sm font-medium">
              Temperature ({localSettings.temperature || 0.7})
            </Label>
            <Input
              id="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={localSettings.temperature || 0.7}
              onChange={(e) => setLocalSettings(prev => ({ 
                ...prev, 
                temperature: parseFloat(e.target.value) 
              }))}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Controls randomness in responses. Lower values are more focused.
            </p>
          </div>

          <div>
            <Label htmlFor="maxTokens" className="text-sm font-medium">
              Max Tokens
            </Label>
            <Input
              id="maxTokens"
              type="number"
              min="100"
              max="4000"
              value={localSettings.maxTokens || 2000}
              onChange={(e) => setLocalSettings(prev => ({ 
                ...prev, 
                maxTokens: parseInt(e.target.value) 
              }))}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maximum length of the response.
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}