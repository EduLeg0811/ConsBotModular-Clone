// OpenAI RAG Service with Vector Store Support and Response API
// Based on the specifications provided

export interface OpenAIRAGRequest {
  message: string;
  vectorStore?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  instructions?: string;
  prePrompt?: string;
  conversationId?: string;
  topK?: number;
}

export interface OpenAIRAGResponse {
  content: string;
  sources?: string[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  conversationId?: string;
  responseId?: string;
}

// Vector Store IDs mapping
const VECTOR_STORE_IDS = {
  'ALLWV': 'vs_6870595f39dc8191b364854cf46ffc74',
  'DAC': 'vs_683f352912848191a17ca98ab24a19a5',
  'LO': 'vs_686735d972cc81919ceec7a4ccf63a57',
  'QUEST': 'vs_683f356d9e908191bf83ae7e5ed6a8c9',
  'MANUAIS': 'vs_683f36046a0481919b601070311b8991',
  'ECWV': 'vs_683f35b84fac8191b8a36918eb7997f2',
  'HSRP': 'vs_683f3686f9548191a1769c1fffdf674e',
  'EXP': 'vs_683f3759628c819187618a217d0c5464',
  'PROJ': 'vs_683f36bbcb688191883d43d948673df6',
  'CCG': 'vs_683f36f2daa88191a1055950845e221b',
  'EDUNOTES': 'vs_68726a6993fc8191ba63b14a9243076a'
};

// Constants
const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 2000;
const DEFAULT_TOP_K = 50;
const DEFAULT_INSTRUCTIONS = 'Você é um assistente especialista em Conscienciologia. Responda de forma objetiva e precisa baseado nas fontes fornecidas.';

// Conversation storage for Response API continuity
const conversationStorage = new Map<string, {
  previousResponseId: string;
  isFirstAccess: boolean;
}>();

class OpenAIRAGService {
  private static instance: OpenAIRAGService;
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';

  private constructor() {}

  static getInstance(): OpenAIRAGService {
    if (!OpenAIRAGService.instance) {
      OpenAIRAGService.instance = new OpenAIRAGService();
    }
    return OpenAIRAGService.instance;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  private getVectorStoreId(vectorStore: string): string {
    return VECTOR_STORE_IDS[vectorStore as keyof typeof VECTOR_STORE_IDS] || VECTOR_STORE_IDS.ALLWV;
  }

  private isFirstAccess(conversationId: string): boolean {
    const conversationData = conversationStorage.get(conversationId);
    return !conversationData || conversationData.isFirstAccess !== false;
  }

  async initializeConversation(conversationId: string): Promise<OpenAIRAGResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!this.isFirstAccess(conversationId)) {
      throw new Error('Conversation already initialized');
    }

    const firstMessage = 'Esse é o meu primeiro acesso. Inclua nessa primeira resposta o seguinte texto literal: "Olá Conscienciólogo! Sou o seu assistente pessoal especializado em Conscienciologia. Lembre-se sempre que sou uma **IA** (Inteligência Artificial), e ainda não possuo ***IE*** (Inteligência Evolutiva), portanto mantenha o senso crítico e aplique o *Princípio da Descrença*. Em caso de dúvida, vale a pena consultar as obras básicas da Conscienciologia. ***Bons estudos!*** Em que eu posso te ajudar?"';

    const requestParams = {
      model: DEFAULT_MODEL,
      instructions: 'Você é um assistente especialista em Conscienciologia. Responda de forma objetiva, sincera, sem se preocupar em agradar o usuário. Sempre preserve a marcação original de Markdown das fontes originais (asteriscos).',
      input: firstMessage,
      store: true
    };

    try {
      const response = await fetch(`${this.baseUrl}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestParams)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();

      // Store response ID for conversation continuity
      conversationStorage.set(conversationId, {
        previousResponseId: data.id,
        isFirstAccess: false
      });

      return {
        content: data.output_text || data.content || '',
        model: data.model || DEFAULT_MODEL,
        conversationId,
        responseId: data.id
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to initialize conversation');
    }
  }

  async OpenAI_Call(request: OpenAIRAGRequest): Promise<OpenAIRAGResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const {
      message,
      vectorStore = 'ECWV',
      model = DEFAULT_MODEL,
      temperature = DEFAULT_TEMPERATURE,
      maxTokens = DEFAULT_MAX_TOKENS,
      instructions = DEFAULT_INSTRUCTIONS,
      prePrompt = '',
      conversationId = 'default',
      topK = DEFAULT_TOP_K
    } = request;

    // Check if conversation needs initialization
    if (this.isFirstAccess(conversationId)) {
      await this.initializeConversation(conversationId);
    }

    // Prepare final message with prePrompt if provided
    let finalMessage = message;
    if (prePrompt && prePrompt.trim()) {
      finalMessage = `${prePrompt}\n\nQuery do usuário: ${message}`;
    }

    // Get vector store ID
    const vectorStoreId = this.getVectorStoreId(vectorStore);

    // Get conversation data for continuity
    const conversationData = conversationStorage.get(conversationId);
    if (!conversationData) {
      throw new Error('Conversation not properly initialized');
    }

    // Build request parameters
    const requestParams: any = {
      model,
      instructions,
      input: finalMessage,
      temperature,
      max_tokens: maxTokens,
      store: true,
      previous_response_id: conversationData.previousResponseId
    };

    // Add vector store tools if specified
    if (vectorStore !== 'None') {
      requestParams.tools = [{
        type: "file_search",
        vector_store_ids: [vectorStoreId],
        max_num_results: topK
      }];
    }

    try {
      const response = await fetch(`${this.baseUrl}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestParams)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();

      // Update conversation storage with new response ID
      conversationStorage.set(conversationId, {
        previousResponseId: data.id,
        isFirstAccess: false
      });

      return {
        content: data.output_text || data.content || '',
        sources: data.sources || [],
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        } : undefined,
        model: data.model || model,
        conversationId,
        responseId: data.id
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate RAG response');
    }
  }

  resetConversation(conversationId: string) {
    conversationStorage.delete(conversationId);
  }

  getConversationStatus(conversationId: string) {
    const conversationData = conversationStorage.get(conversationId);
    return {
      exists: !!conversationData,
      isFirstAccess: this.isFirstAccess(conversationId),
      previousResponseId: conversationData?.previousResponseId || null
    };
  }
}

// Export singleton instance
export const openAIRAGService = OpenAIRAGService.getInstance();