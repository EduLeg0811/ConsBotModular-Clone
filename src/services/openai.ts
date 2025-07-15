export interface OpenAIRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPrompt?: string;
}

export interface OpenAIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason?: string;
}

export class OpenAIService {
  private static instance: OpenAIService;
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  private constructor() {
    // Hardcoded API key for testing
    this.apiKey = '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';
    
    // Detailed debug logs
    console.log('🔑 OpenAI Service Constructor Called');
    console.log('🔑 API Key loaded:', this.apiKey.substring(0, 20) + '...');
    console.log('🔑 API Key length:', this.apiKey.length);
    console.log('🔑 API Key starts with sk-:', this.apiKey.startsWith('sk-'));
    console.log('🔑 Full API Key (first 50 chars):', this.apiKey.substring(0, 50));
  }

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  async generateResponse(request: OpenAIRequest): Promise<OpenAIResponse> {
    const {
      prompt,
      model = 'gpt-4o-mini',
      temperature = 0.7,
      maxTokens = 2000,
      topP = 1,
      frequencyPenalty = 0,
      presencePenalty = 0,
      systemPrompt = 'You are a helpful AI assistant.'
    } = request;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    try {
      console.log('🚀 Making OpenAI API call...');
      console.log('🚀 URL:', `${this.baseUrl}/chat/completions`);
      console.log('🚀 Model:', model);
      console.log('🚀 Messages:', messages);
      console.log('🚀 Authorization header:', `Bearer ${this.apiKey.substring(0, 20)}...`);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          top_p: topP,
          frequency_penalty: frequencyPenalty,
          presence_penalty: presencePenalty
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error('❌ Response not ok, status:', response.status);
        const errorData = await response.json();
        console.error('❌ Error data:', errorData);
        throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const choice = data.choices[0];

      return {
        content: choice.message.content,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        } : undefined,
        model: data.model,
        finishReason: choice.finish_reason
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate response');
    }
  }

  async generateStreamResponse(
    request: OpenAIRequest,
    onChunk: (chunk: string) => void,
    onComplete: (response: OpenAIResponse) => void
  ): Promise<void> {
    const {
      prompt,
      model = 'gpt-4o-mini',
      temperature = 0.7,
      maxTokens = 2000,
      topP = 1,
      frequencyPenalty = 0,
      presencePenalty = 0,
      systemPrompt = 'You are a helpful AI assistant.'
    } = request;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          top_p: topP,
          frequency_penalty: frequencyPenalty,
          presence_penalty: presencePenalty,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let fullContent = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;
                onChunk(content);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      onComplete({
        content: fullContent,
        model,
        finishReason: 'stop'
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate streaming response');
    }
  }
}

// Export singleton instance
export const openAIService = OpenAIService.getInstance();