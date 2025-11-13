// OpenAI API request types
export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens: number;
  temperature: number;
}

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// OpenAI API response types
export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: OpenAIUsage;
}

export interface OpenAIChoice {
  index: number;
  message: OpenAIMessage;
  finish_reason: string;
}

export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// AI suggestion result
export interface AISuggestion {
  text: string;
  fieldName: string;
}

// AI error types
export const AIErrorType = {
  NETWORK: "network",
  TIMEOUT: "timeout",
  RATE_LIMIT: "rateLimit",
  GENERIC: "generic",
} as const;

export type AIErrorType = (typeof AIErrorType)[keyof typeof AIErrorType];

export interface AIError {
  type: AIErrorType;
  message: string;
}
