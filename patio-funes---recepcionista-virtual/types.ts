export interface ChatOption {
  label: string;
  value: string;
  type: 'message' | 'link' | 'call';
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string; // Will contain JSON string for model, plain text for user
  timestamp: Date;
  isJson?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface ModelResponse {
  message: string;
  options: ChatOption[];
  status: 'ongoing' | 'confirmed' | 'unknown' | 'cancelled';
  reservationDetails?: {
    name: string;
    date: string;
    time: string;
    people: string;
    location?: string;
  };
}