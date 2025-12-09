import React, { useMemo } from 'react';
import { Message, ModelResponse, ChatOption } from '../types';
import { User, Sparkles, Phone, ExternalLink, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
  onOptionClick: (option: ChatOption) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOptionClick }) => {
  const isUser = message.role === 'user';

  // Parse JSON if it comes from the model, otherwise treat as plain text
  const content: ModelResponse | null = useMemo(() => {
    if (isUser) return null;
    try {
      return JSON.parse(message.text);
    } catch (e) {
      // Fallback if parsing fails
      return {
        message: message.text,
        options: [],
        status: 'ongoing'
      };
    }
  }, [message.text, isUser]);

  const displayText = isUser ? message.text : content?.message || message.text;
  const options = content?.options || [];

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-[90%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-brand-secondary text-brand-primary' : 'bg-brand-primary text-white'}`}>
            {isUser ? <User size={16} /> : <Sparkles size={16} />}
          </div>

          {/* Bubble */}
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
              isUser
                ? 'bg-brand-secondary text-brand-primary font-medium rounded-br-none'
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
            }`}
          >
             <div className="prose prose-sm max-w-none prose-p:my-0 prose-a:text-brand-primary prose-a:underline">
              <ReactMarkdown>{displayText}</ReactMarkdown>
            </div>
            <span className={`text-[10px] mt-1 block opacity-70 ${isUser ? 'text-brand-primary' : 'text-gray-400'}`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Options / Chips */}
        {!isUser && options.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 ml-10 animate-fade-in">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onOptionClick(option)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-brand-primary/20 text-brand-primary text-sm font-medium rounded-full hover:bg-brand-primary hover:text-white transition-all shadow-sm active:scale-95"
              >
                {option.type === 'call' && <Phone size={12} />}
                {option.type === 'link' && <ExternalLink size={12} />}
                {option.type === 'message' && <MessageSquare size={12} />}
                {option.label}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};