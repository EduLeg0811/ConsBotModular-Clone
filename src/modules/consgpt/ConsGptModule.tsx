import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Settings } from "lucide-react";
import { ModuleProps } from "../shared/types";
import { useModuleSettings } from "../shared/hooks/useModuleSettings";
import { SettingsDialog } from "../shared/components/SettingsDialog";

export function ConsGptModule({ onBack }: ModuleProps) {
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { settings, updateSettings } = useModuleSettings('chatbot');

 const handleSendMessage = () => {
  window.open("https://chatgpt.com/g/g-9rjMAqtTg-consgpt", "_blank");
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (showSettings) {
    return (
      <SettingsDialog
        title="Cons.GPT"
        settings={settings}
        onSettingsChange={updateSettings}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <Card className="rounded-b-none border-b-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={onBack}>
                ← Back
              </Button>
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-primary" />
                <CardTitle>Cons.GPT</CardTitle>
                <Badge variant="secondary">Online</Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 rounded-none border-b-0 border-t-0">
        <CardContent className="p-0 h-full">
          <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <Bot className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">Start a conversation</h3>
                <p className="text-muted-foreground">Ask me anything and I'll help you out!</p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Input */}
      <Card className="rounded-t-none">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
