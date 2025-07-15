// OpenAI RAG Service with Vector Store Support and Response API
// Based on the specifications provided

import OpenAI from 'openai';

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
const DEFAULT_INSTRUCTION_PROMPT = 'Você é um assistente especialista em Conscienciologia. Responda de forma objetiva e precisa baseado nas fontes fornecidas.';

// Debug callback interface
interface DebugUpdate {
  type: 'request' | 'response' | 'error';
  data?: any;
  error?: string;
  details?: any;
  timestamp: string;
  note?: string;
}

// Universal OpenAI Response API parameters interface
interface OpenAIResponseParams {
  model?: string;
  input: string;
  instructions?: string;
  previous_response_id?: string;
  tools?: any[];
  temperature?: number;
  store?: boolean;
  metadata?: any;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true
});

/**
 * UNIVERSAL OPENAI RESPONSE API CALLER - Makes a call to OpenAI's Response API with all available parameters
 * @param params - All parameters for the OpenAI Response API
 * @param onDebugUpdate - Optional callback for debug information
 * @returns The full response from OpenAI
 */
export const callOpenAIResponse = async (
  {
    model = DEFAULT_MODEL,
    input,
    instructions = DEFAULT_INSTRUCTION_PROMPT,
    previous_response_id,
    tools,
    temperature = DEFAULT_TEMPERATURE,
    store = true,
    metadata
  }: OpenAIResponseParams,
  onDebugUpdate: ((update: DebugUpdate) => void) | null = null
): Promise<any> => {
  try {
    // Build the request parameters object
    const requestParams: any = {
      model,
      input,
      instructions,
      temperature,
      store
    };

    // Add optional parameters only if they exist
    if (previous_response_id) {
      requestParams.previous_response_id = previous_response_id;
    }
    if (tools && tools.length > 0) {
      requestParams.tools = tools;
    }
    if (metadata) {
      requestParams.metadata = metadata;
    }

    // DEBUG: Log the request if debug callback is provided
    if (onDebugUpdate) {
      onDebugUpdate({
        type: 'request',
        data: requestParams,
        timestamp: new Date().toISOString(),
        note: 'UNIVERSAL OPENAI RESPONSE API CALL'
      });
    }

    // Make the API call using OpenAI client
    const response = await openai.responses.create(requestParams);

    // DEBUG: Log the response if debug callback is provided
    if (onDebugUpdate) {
      onDebugUpdate({
        type: 'response',
        data: response,
        timestamp: new Date().toISOString(),
        note: 'OPENAI RESPONSE RECEIVED'
      });
    }

    return response;
  } catch (error) {
    console.error('OpenAI Response API Error:', error);
    
    // Enhanced error handling for OpenAI client errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetails = {
      timestamp: new Date().toISOString(),
      originalError: error
    };
    
    // Log detailed error if debug is enabled
    if (onDebugUpdate) {
      onDebugUpdate({
        type: 'error',
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      });
    }
    
    throw new Error(`OpenAI API Error: ${errorMessage}`);
  }
};

// Conversation storage for maintaining state
const conversationStorage = new Map<string, { previousResponseId: string; isFirstAccess: boolean }>();

class OpenAIRAGService {
  private static instance: OpenAIRAGService;

  private constructor() {}

  static getInstance(): OpenAIRAGService {
    if (!OpenAIRAGService.instance) {
      OpenAIRAGService.instance = new OpenAIRAGService();
    }
    return OpenAIRAGService.instance;
  }

  private getVectorStoreId(vectorStore: string): string {
    return VECTOR_STORE_IDS[vectorStore as keyof typeof VECTOR_STORE_IDS] || VECTOR_STORE_IDS.ECWV;
  }

  private isFirstAccess(conversationId: string): boolean {
    const conversationData = conversationStorage.get(conversationId);
    return !conversationData || conversationData.isFirstAccess;
  }

  async initializeConversation(conversationId: string): Promise<OpenAIRAGResponse> {
    if (!this.isFirstAccess(conversationId)) {
      throw new Error('Conversation already initialized');
    }

    const firstMessage = 'Esse é o meu primeiro acesso. Inclua nessa primeira resposta o seguinte texto literal: "Olá Conscienciólogo! Sou o seu assistente pessoal especializado em Conscienciologia. Lembre-se sempre que sou uma **IA** (Inteligência Artificial), e ainda não possuo ***IE*** (Inteligência Evolutiva), portanto mantenha o senso crítico e aplique o *Princípio da Descrença*. Em caso de dúvida, vale a pena consultar as obras básicas da Conscienciologia. ***Bons estudos!*** Em que eu posso te ajudar?"';

    try {
      const response = await callOpenAIResponse({
        model: DEFAULT_MODEL,
        input: firstMessage,
        instructions: 'Você é um assistente especialista em Conscienciologia. Responda de forma objetiva, sincera, sem se preocupar em agradar o usuário. Sempre preserve a marcação original de Markdown das fontes originais (asteriscos).',
        store: true
      }, (debugUpdate) => {
        console.log('🔍 RAG Init Debug:', debugUpdate);
      });

      conversationStorage.set(conversationId, {
        previousResponseId: response.id,
        isFirstAccess: false
      });

      return {
        content: response.output_text || '',
        model: response.model || DEFAULT_MODEL,
        conversationId,
        responseId: response.id
      };
    } catch (error) {
      console.error('❌ RAG Init Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to initialize conversation');
    }
  }

  async OpenAI_Call(request: OpenAIRAGRequest): Promise<OpenAIRAGResponse> {
    const {
      message,
      vectorStore = 'ECWV',
      model = DEFAULT_MODEL,
      temperature = DEFAULT_TEMPERATURE,
      maxTokens = DEFAULT_MAX_TOKENS,
      instructions = DEFAULT_INSTRUCTION_PROMPT,
      prePrompt = '',
      conversationId = 'default',
      topK = DEFAULT_TOP_K
    } = request;

    if (this.isFirstAccess(conversationId)) {
      await this.initializeConversation(conversationId);
    }

    let finalMessage = message;
    if (prePrompt && prePrompt.trim()) {
      finalMessage = `${prePrompt}\n\nQuery do usuário: ${message}`;
    }

    const vectorStoreId = this.getVectorStoreId(vectorStore);
    const conversationData = conversationStorage.get(conversationId);
    if (!conversationData) {
      throw new Error('Conversation not properly initialized');
    }

    const tools = vectorStore !== 'None' ? [{
      type: "file_search",
      vector_store_ids: [vectorStoreId],
      max_num_results: topK
    }] : undefined;

    try {
      const response = await callOpenAIResponse({
        model,
        input: finalMessage,
        instructions,
        temperature,
        store: true,
        previous_response_id: conversationData.previousResponseId,
        tools
      }, (debugUpdate) => {
        console.log('🔍 RAG Call Debug:', debugUpdate);
      });

      conversationStorage.set(conversationId, {
        previousResponseId: response.id,
        isFirstAccess: false
      });

      return {
        content: response.output_text || '',
        sources: response.sources || [],
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        } : undefined,
        model: response.model || model,
        conversationId,
        responseId: response.id
      };
    } catch (error) {
      console.error('❌ RAG Call Error:', error);
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
      isFirstAccess: !conversationData || conversationData.isFirstAccess,
      previousResponseId: conversationData?.previousResponseId
    };
  }
}

export const openAIRAGService = OpenAIRAGService.getInstance();