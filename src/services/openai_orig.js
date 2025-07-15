// Environment Variables Configuration - Only sensitive data
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Validation - Check if API key is configured
if (!OPENAI_KEY) {
  throw new Error('VITE_OPENAI_API_KEY is not configured in environment variables');
}

// VECTOR STORE IDs - Hardcoded constants for easier access
const VECTOR_STORE_ID_ALLWV    = 'vs_6870595f39dc8191b364854cf46ffc74';
const VECTOR_STORE_ID_DAC      = 'vs_683f352912848191a17ca98ab24a19a5';
const VECTOR_STORE_ID_LO       = 'vs_686735d972cc81919ceec7a4ccf63a57';
const VECTOR_STORE_ID_QUEST    = 'vs_683f356d9e908191bf83ae7e5ed6a8c9';
const VECTOR_STORE_ID_MANUAIS  = 'vs_683f36046a0481919b601070311b8991';
const VECTOR_STORE_ID_ECWV     = 'vs_683f35b84fac8191b8a36918eb7997f2';
const VECTOR_STORE_ID_HSRP     = 'vs_683f3686f9548191a1769c1fffdf674e';
const VECTOR_STORE_ID_EXP      = 'vs_683f3759628c819187618a217d0c5464';
const VECTOR_STORE_ID_PROJ     = 'vs_683f36bbcb688191883d43d948673df6';
const VECTOR_STORE_ID_CCG      = 'vs_683f36f2daa88191a1055950845e221b';
const VECTOR_STORE_ID_EDUNOTES = 'vs_68726a6993fc8191ba63b14a9243076a';

// APPLICATION CONSTANTS - Hardcoded for easier maintenance
const APP_NAME = 'Cons.AI';
const APP_VERSION = '1.0.0';
const DEFAULT_MODEL = 'gpt-4.1-nano';
const DEFAULT_TEMPERATURE = 0;
const DEFAULT_TOP_K = 50;

// PROMPT CONSTANTS - Application-specific prompts
const DEFAULT_PRE_PROMPT = '';
const DEFAULT_INSTRUCTION_PROMPT = '';
const FIRST_MESSAGE = 'Esse é o meu primeiro acesso. Inclua nessa primeira resposta o seguinte texto literal: "Olá Conscienciólogo! Sou o **Cons.AI**, o seu assistente pessoal da ciência Conscienciologia./n/nLembre-se sempre que sou uma **IA** (Inteligência Artificial), e ainda não possuo ***IE*** (Inteligência Evolutiva), portanto mantenha o senso crítico e aplique o *Princípio da Descrença*. Em caso de dúvida, vale a pena consultar as obras básicas da Conscienciologia. ***Bons estudos!***/n/nEm que eu posso te ajudar?';
const FIRST_INSTRUCTION_PROMPT = 'Você é o Cons.AI, um assistente especialista em Conscienciologia. Responda de forma objetiva, sincera, sem se preocupar em agradar o usuário. Responda preferencialmente na forma de listagem numerada, exceto nessa primeira mensagem de boas-vindas. Sempre preserve a marcação original de Markdown das fontes originais (asteriscos).';

import OpenAI from 'openai';

// Inicializa o cliente OpenAI usando a Response API
const openai = new OpenAI({ 
  apiKey: OPENAI_KEY,
  dangerouslyAllowBrowser: true
});

// CONVERSATION CONTINUITY STORAGE - Armazena previous_response_id por usuário/sessão
const conversationStorage = new Map();

// VECTOR STORE MAPPING - Mapeia IDs de seleção para IDs reais dos vector stores
const getVectorStoreId = (selectedVectorStore) => {
  const vectorStoreMap = {
    'ALLWV': VECTOR_STORE_ID_ALLWV,
    'DAC': VECTOR_STORE_ID_DAC,
    'LO': VECTOR_STORE_ID_LO,
    'QUEST': VECTOR_STORE_ID_QUEST,
    'MANUAIS': VECTOR_STORE_ID_MANUAIS,
    'ECWV': VECTOR_STORE_ID_ECWV,
    'HSRP': VECTOR_STORE_ID_HSRP,
    'EXP': VECTOR_STORE_ID_EXP,
    'PROJ': VECTOR_STORE_ID_PROJ,
    'CCG': VECTOR_STORE_ID_CCG,
    'EDUNOTES': VECTOR_STORE_ID_EDUNOTES
  };  
  
  return vectorStoreMap[selectedVectorStore] || VECTOR_STORE_ID_ALLWV;
};

/**
 * AUTOMATIC FIRST ACCESS HANDLER - Executa query automática no primeiro acesso
 * @param {string} conversationId - ID único da conversa/usuário
 * @param {Function} onDebugUpdate - Callback para debug updates
 * @returns {Promise<string>} - Resposta da primeira query automática
 */
export const initializeConversation = async (conversationId, onDebugUpdate) => {
  try {
    // Verifica se já foi inicializada
    if (!isFirstAccess(conversationId)) {
      return null; // Já foi inicializada
    }

    // AUTOMATIC FIRST ACCESS QUERY - Query automática conforme especificado
    const requestParams = {
      model: DEFAULT_MODEL,
      instructions: FIRST_INSTRUCTION_PROMPT,
      input: FIRST_MESSAGE, 
      store: true // Parâmetro especial para armazenar a conversa
      // Nota: vector store = none (não incluímos tools)
      // Nota: prePrompt vazio (não incluímos prePrompt)
    };

    // DEBUG CALLBACK - Send request parameters to debug panel
    if (onDebugUpdate) {
      onDebugUpdate({
        type: 'request',
        data: { ...requestParams, note: 'AUTOMATIC FIRST ACCESS QUERY' }
      });
    }

    // Faz a primeira chamada automática à OpenAI
    const response = await openai.responses.create(requestParams);

    // STORE RESPONSE ID - Armazena o ID da resposta para continuidade
    conversationStorage.set(conversationId, {
      previousResponseId: response.id,
      isFirstAccess: false
    });

    // DEBUG CALLBACK - Send response data to debug panel
    if (onDebugUpdate) {
      onDebugUpdate({
        type: 'response',
        outputText: response.output_text,
        fullResponse: { ...response, note: 'AUTOMATIC FIRST ACCESS RESPONSE - ID STORED' }
      });
    }

    return response.output_text;
  } catch (error) {
    console.error('Automatic First Access Error:', error);
    throw new Error('Failed to initialize conversation automatically');
  }
};

/**
 * CHECK FIRST ACCESS - Verifica se é o primeiro acesso do usuário
 * @param {string} conversationId - ID único da conversa/usuário
 * @returns {boolean} - True se for o primeiro acesso
 */
export const isFirstAccess = (conversationId) => {
  const conversationData = conversationStorage.get(conversationId);
  return !conversationData || conversationData.isFirstAccess !== false;
};

/*--------------------------------------------------------------------------------------------*/
/**
 * FUNÇÃO MODULAR COMPLETA - Faz chamada completa à OpenAI com todos os parâmetros
 * @param {Object} params - Parâmetros da chamada
 * @param {string} [params.model] - Modelo a ser usado
 * @param {string} [params.instructions] - Instruções para o assistente
 * @param {string} params.selectedVectorStore - Vector store selecionado
 * @param {string} params.message - Mensagem do usuário
 * @param {string} [params.prePrompt] - Prompt adicional antes da mensagem
 * @param {Array} [params.conversationHistory] - Histórico da conversa
 * @param {number} [params.temperature] - Temperatura (0-1)
 * @param {number} [params.topK] - Top-K para busca
 * @param {string} params.conversationId - ID único da conversa para continuidade
 * @param {Function} [params.onDebugUpdate] - Callback para debug updates
 * @returns {Promise<string>} - Resposta do assistente
 */
export const callOpenAI = async ({
  model = DEFAULT_MODEL,
  instructions = DEFAULT_INSTRUCTION_PROMPT,
  selectedVectorStore,
  message,
  prePrompt = DEFAULT_PRE_PROMPT,
  conversationHistory = [],
  temperature,
  topK,
  conversationId,
  onDebugUpdate = null
}) => {
  try {
    // FIRST ACCESS CHECK - Se for primeiro acesso, retorna erro pois deve ser inicializado primeiro
    if (isFirstAccess(conversationId)) {
      throw new Error('Conversation not initialized. Call initializeConversation first.');
    }

    // PREPROMPT FORMATTING - Monta a mensagem final com prePrompt se fornecido
    let finalMessage = message;
    if (prePrompt && prePrompt.trim()) {
      finalMessage = `${prePrompt}\n\nQuery do usuário: ${message}`;
    }

    // VECTOR STORE SELECTION - Obtém o ID do vector store selecionado
    const vectorStoreId = getVectorStoreId(selectedVectorStore);    
    
    // CONVERSATION CONTINUITY - Obtém o previous_response_id (deve existir após inicialização)
    const conversationData = conversationStorage.get(conversationId);
    
    // Monta os parâmetros básicos da requisição
    const requestParams = {
      model: model, // Use the model parameter passed to the function
      instructions: instructions,
      input: finalMessage,
      temperature: temperature,
      store: true, // Sempre armazena para continuidade
      previous_response_id: conversationData.previousResponseId // Sempre presente após inicialização
    };
  
    // CONDITIONAL TOOLS PARAMETER - Se houver vector store, adiciona o campo 'tools'
    if (selectedVectorStore !== 'None') {
      requestParams.tools = [{
        type: "file_search",
        vector_store_ids: [vectorStoreId],
        max_num_results: topK
      }];
    }

    // DEBUG CALLBACK - Send request parameters to debug panel
    if (onDebugUpdate) {
      onDebugUpdate({
        type: 'request',
        data: {
          ...requestParams,
          note: `CONTINUATION - Using previous_response_id: ${conversationData.previousResponseId}`
        }
      });
    }

    // Faz a chamada à OpenAI Responses API
    const response = await openai.responses.create(requestParams);

    // UPDATE CONVERSATION STORAGE - Atualiza o previous_response_id para a próxima chamada
    conversationStorage.set(conversationId, {
      previousResponseId: response.id,
      isFirstAccess: false
    });

    // DEBUG CALLBACK - Send response data to debug panel
    if (onDebugUpdate) {
      onDebugUpdate({
        type: 'response',
        outputText: response.output_text,
        fullResponse: {
          ...response,
          note: `RESPONSE ID UPDATED: ${response.id}`
        }
      });
    }

    return response.output_text;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get response from OpenAI');
  }
};
/*--------------------------------------------------------------------------------------------*/




/**
 * RESET CONVERSATION - Reseta a conversa para um usuário específico
 * @param {string} conversationId - ID da conversa a ser resetada
 */
export const resetConversation = (conversationId) => {
  conversationStorage.delete(conversationId);
};

/**
 * GET CONVERSATION STATUS - Obtém o status da conversa
 * @param {string} conversationId - ID da conversa
 * @returns {Object} - Status da conversa
 */
export const getConversationStatus = (conversationId) => {
  const conversationData = conversationStorage.get(conversationId);
  return {
    exists: !!conversationData,
    isFirstAccess: isFirstAccess(conversationId),
    previousResponseId: conversationData?.previousResponseId || null
  };
};

/**
 * GET APPLICATION CONSTANTS - Retorna constantes da aplicação
 * @returns {Object} - Constantes da aplicação
 */
export const getAppConstants = () => {
  return {
    APP_NAME,
    APP_VERSION,
    DEFAULT_MODEL,
    DEFAULT_TEMPERATURE,
    DEFAULT_TOP_K,
    hasApiKey: !!OPENAI_KEY
  };
};

/**
 * GET ENVIRONMENT INFO - Retorna informações sobre as variáveis de ambiente (para debug)
 * @returns {Object} - Informações das variáveis de ambiente
 */
export const getEnvironmentInfo = () => {
  return {
    hasApiKey: !!OPENAI_KEY,
    model: DEFAULT_MODEL,
    temperature: DEFAULT_TEMPERATURE.toString(),
    topK: DEFAULT_TOP_K.toString(),
    appName: APP_NAME,
    appVersion: APP_VERSION,
    vectorStores: {
      ALLWV: !!VECTOR_STORE_ID_ALLWV,
      DAC: !!VECTOR_STORE_ID_DAC,
      LO: !!VECTOR_STORE_ID_LO,
      QUEST: !!VECTOR_STORE_ID_QUEST,
      MANUAIS: !!VECTOR_STORE_ID_MANUAIS,
      ECWV: !!VECTOR_STORE_ID_ECWV,
      HSRP: !!VECTOR_STORE_ID_HSRP,
      EXP: !!VECTOR_STORE_ID_EXP,
      PROJ: !!VECTOR_STORE_ID_PROJ,
      CCG: !!VECTOR_STORE_ID_CCG,
      EDUNOTES: !!VECTOR_STORE_ID_EDUNOTES
    }
  };
};