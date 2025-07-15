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
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  const baseUrl = 'https://api.openai.com/v1';

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

    // Make the API call
    const response = await fetch(`${baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestParams)
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Enhanced error handling
      const errorMessage = errorData.error?.message || 'Unknown error occurred';
      const errorDetails = {
        status: response.status,
        code: errorData.error?.code,
        type: errorData.error?.type,
        param: errorData.error?.param,
        timestamp: new Date().toISOString()
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

    const data = await response.json();

    // DEBUG: Log the response if debug callback is provided
    if (onDebugUpdate) {
      onDebugUpdate({
        type: 'response',
        data: data,
        timestamp: new Date().toISOString(),
        note: 'OPENAI RESPONSE RECEIVED'
      });
    }

    return data;
  } catch (error) {
    console.error('OpenAI Response API Error:', error);
    
    // Enhanced error handling for fetch errors
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
};</parameter>
</invoke>
<invoke name="file">
<parameter name="filePath">src/services/openai-rag.ts</parameter>
<parameter name="contentType">diff</parameter>
<parameter name="content">@@ .. @@

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
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  const baseUrl = 'https://api.openai.com/v1';

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

    // Make the API call
    const response = await fetch(`${baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestParams)
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Enhanced error handling
      const errorMessage = errorData.error?.message || 'Unknown error occurred';
      const errorDetails = {
        status: response.status,
        code: errorData.error?.code,
        type: errorData.error?.type,
        param: errorData.error?.param,
        timestamp: new Date().toISOString()
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

    const data = await response.json();

    // DEBUG: Log the response if debug callback is provided
    if (onDebugUpdate) {
      onDebugUpdate({
        type: 'response',
        data: data,
        timestamp: new Date().toISOString(),
        note: 'OPENAI RESPONSE RECEIVED'
      });
    }

    return data;
  } catch (error) {
    console.error('OpenAI Response API Error:', error);
    
    // Enhanced error handling for fetch errors
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
};</parameter>
</invoke>
<invoke name="file">
<parameter name="filePath">src/services/openai-rag.ts</parameter>
<parameter name="contentType">diff</parameter>
<parameter name="content">@@ .. @@

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
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  const baseUrl = 'https://api.openai.com/v1';

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

    // Make the API call
    const response = await fetch(`${baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestParams)
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Enhanced error handling
      const errorMessage = errorData.error?.message || 'Unknown error occurred';
      const errorDetails = {
        status: response.status,
        code: errorData.error?.code,
        type: errorData.error?.type,
        param: errorData.error?.param,
        timestamp: new Date().toISOString()
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

    const data = await response.json();

    // DEBUG: Log the response if debug callback is provided
    if (onDebugUpdate) {
      onDebugUpdate({
        type: 'response',
        data: data,
        timestamp: new Date().toISOString(),
        note: 'OPENAI RESPONSE RECEIVED'
      });
    }

    return data;
  } catch (error) {
    console.error('OpenAI Response API Error:', error);
    
    // Enhanced error handling for fetch errors
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
};</parameter>
</invoke>
<invoke name="file">
<parameter name="filePath">src/services/openai-rag.ts</parameter>
<parameter name="contentType">diff</parameter>
<parameter name="content">@@ .. @@

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
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  const baseUrl = 'https://api.openai.com/v1';

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

    // Make the API call
    const response = await fetch(`${baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestParams)
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Enhanced error handling
      const errorMessage = errorData.error?.message || 'Unknown error occurred';
      const errorDetails = {
        status: response.status,
        code: errorData.error?.code,
        type: errorData.error?.type,
        param: errorData.error?.param,
        timestamp: new Date().toISOString()
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

    const data = await response.json();

    // DEBUG: Log the response if debug callback is provided
    if (onDebugUpdate) {
      onDebugUpdate({
        type: 'response',
        data: data,
        timestamp: new Date().toISOString(),
        note: 'OPENAI RESPONSE RECEIVED'
      });
    }

    return data;
  } catch (error) {
    console.error('OpenAI Response API Error:', error);
    
    // Enhanced error handling for fetch errors
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
};</parameter>
</invoke>
<invoke name="file">
<parameter name="filePath">src/services/openai-rag.ts</parameter>
<parameter name="contentType">diff</parameter>
<parameter name="content">@@ .. @@

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
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  const baseUrl = 'https://api.openai.com/v1';

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

    // Make the API call
    const response = await fetch(`${baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestParams)
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Enhanced error handling
      const errorMessage = errorData.error?.message || 'Unknown error occurred';
      const errorDetails = {
        status: response.status,
        code: errorData.error?.code,
        type: errorData.error?.type,
        param: errorData.error?.param,
        timestamp: new Date().toISOString()
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

    const data = await response.json();

    // DEBUG: Log the response if debug callback is provided
    if (onDebugUpdate) {
      onDebugUpdate({
    try {
      const data = await callOpenAIResponse({
        model: DEFAULT_MODEL,
        input: firstMessage,
        instructions: 'Você é um assistente especialista em Conscienciologia. Responda de forma objetiva, sincera, sem se preocupar em agradar o usuário. Sempre preserve a marcação original de Markdown das fontes originais (asteriscos).',
        store: true
      }, (debugUpdate) => {
        console.log('🔍 RAG Init Debug:', debugUpdate);
      });

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
      const data = await callOpenAIResponse({
        model,
        input: finalMessage,
        instructions,
        temperature,
        store: true,
        previous_response_id: conversationData.previousResponseId,
        tools
      }, (debugUpdate) => {
        console.log('🔍 RAG Call Debug:', debugUpdate);
        data: data,
      temperature = DEFAULT_TEMPERATURE,
      finalMessage = `${prePrompt}\n\nQuery do usuário: ${message}`;
    }

    const vectorStoreId = this.getVectorStoreId(vectorStore);
    const conversationData = conversationStorage.get(conversationId);
    if (!conversationData) {
        content: data.output_text || data.content || '',
        sources: data.sources || [],
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        } : undefined,
        model: data.model || model,

    const tools = vectorStore !== 'None' ? [{
      type: "file_search",
      vector_store_ids: [vectorStoreId],
      console.error('❌ RAG Call Error:', error);
    }] : undefined;

    try {
      throw new Error('Failed to generate RAG response');
        model: DEFAULT_MODEL,