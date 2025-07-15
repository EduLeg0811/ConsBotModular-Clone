import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { openAIService, OpenAIRequest } from "@/services/openai";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Sparkles, Loader2, RefreshCw, Settings } from "lucide-react";
import { ModuleProps } from "../shared/types";
import { useModuleSettings } from "../shared/hooks/useModuleSettings";
import { SettingsDialog } from "../shared/components/SettingsDialog";

export function BibliomanciaModule({ onBack }: ModuleProps) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  
  const { settings, updateSettings, isConfigured } = useModuleSettings('bibliomancia');

  const handleGenerate = async () => {
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setResponse("");

    try {
      const systemPrompt = `You are a wise bibliomantic oracle that provides insights through literary interpretation. 

When given a question, you should:
1. Provide a mystical, literary-inspired interpretation
2. Reference fictional or real literary works that relate to the question
3. Offer deep, metaphorical guidance
4. Use poetic and inspiring language
5. End with a meaningful quote or passage

Your responses should feel magical and insightful, as if drawing wisdom from the collective knowledge of all books ever written.`;

      const request: OpenAIRequest = {
        prompt: `Question for bibliomantic insight: "${question}"`,
        systemPrompt,
        temperature: settings.temperature || 0.8,
        maxTokens: settings.maxTokens || 800,
        model: settings.model
      };

      const result = await openAIService.generateResponse(request);
      setResponse(result.content);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate insight",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion("");
    setResponse("");
  };

  if (showSettings) {
    return (
      <SettingsDialog
        title="Bibliomancia"
        settings={settings}
        onSettingsChange={updateSettings}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={onBack}>
                ← Back
              </Button>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle>Bibliomancia</CardTitle>
                <Badge variant="secondary">Literary Oracle</Badge>
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
          <p className="text-muted-foreground">
            Seek wisdom through the ancient art of book divination. Ask your question and receive insights drawn from the collective knowledge of literature.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Input */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-accent" />
              Your Question
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What guidance do you seek from the literary realm? Ask about life, love, decisions, or any matter that weighs on your mind..."
              className="min-h-32 resize-none"
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !question.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <BookOpen className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Consulting the Oracle..." : "Seek Wisdom"}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Response */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Literary Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!response && !isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>The oracle awaits your question...</p>
                <p className="text-sm mt-2">Ask anything and receive wisdom from the literary realm.</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">The oracle is consulting ancient texts...</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {response}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-muted/30 border-muted">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <BookOpen className="h-6 w-6 mx-auto mb-2 opacity-70" />
            <p className="font-medium mb-1">About Bibliomancia</p>
            <p>
              An ancient practice of seeking guidance through books and literature. 
              This AI-powered version draws upon the collective wisdom of literary works 
              to provide meaningful insights and guidance for your questions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}