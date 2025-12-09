import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Mail } from 'lucide-react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { Message, ChatOption, ModelResponse } from './types';
import { initializeChat, sendMessageToGemini } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailToast, setShowEmailToast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showEmailToast]);

  // Initial Welcome
  useEffect(() => {
    initializeChat();
    
    // Initial structured welcome message
    const initialGreeting: Message = {
      id: 'init-1',
      role: 'model',
      text: JSON.stringify({
        message: "¡Hola! Bienvenido a **PATIO FUNES**. 🍷\n\nSoy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
        options: [
          { label: "📅 Realizar reserva", value: "Quiero hacer una reserva", type: "message" },
          { label: "📖 Ver Menú", value: "https://menu.maxirest.com/37835", type: "link" },
          { label: "📞 Contáctanos", value: "Quiero contactar al restaurante", type: "message" }
        ],
        status: "ongoing"
      }),
      timestamp: new Date(),
    };
    setMessages([initialGreeting]);
  }, []);

  const processResponse = (rawText: string) => {
    try {
      const data: ModelResponse = JSON.parse(rawText);
      
      // Check for confirmation status to simulate email
      if (data.status === 'confirmed') {
        setTimeout(() => {
          setShowEmailToast(true);
          setTimeout(() => setShowEmailToast(false), 5000);
        }, 1000);
      }

      return rawText;
    } catch (e) {
      console.error("Error processing response json", e);
      return JSON.stringify({
        message: rawText,
        options: [],
        status: 'unknown'
      });
    }
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue.trim();
    if (!textToSend || isLoading) return;

    // Don't clear input if we used an override (button click) unless we want to
    if (!textOverride) setInputValue('');
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const rawResponse = await sendMessageToGemini(textToSend);
      const processedResponse = processResponse(rawResponse);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: processedResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setIsLoading(false);
      if (window.innerWidth > 768) {
        inputRef.current?.focus();
      }
    }
  };

  const handleOptionClick = (option: ChatOption) => {
    if (option.type === 'link' || option.type === 'call') {
      window.open(option.value, '_blank');
    } else {
      // It's a message type, send it to chat
      handleSendMessage(option.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f9f9f9] font-sans text-gray-800">
      <Header />

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 max-w-3xl mx-auto w-full">
        <div className="flex flex-col space-y-2">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              onOptionClick={handleOptionClick}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start w-full mb-4">
               <div className="flex max-w-[70%] items-end gap-2">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin" />
                 </div>
                 <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm text-gray-500 text-sm italic border border-gray-100">
                   Consultando agenda...
                 </div>
               </div>
            </div>
          )}

          {/* Simulated Email Notification */}
          {showEmailToast && (
            <div className="flex justify-center w-full my-4 animate-bounce">
              <div className="bg-brand-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                <Mail className="animate-pulse" size={20} />
                <div>
                  <p className="text-sm font-bold">Reserva Confirmada</p>
                  <p className="text-xs opacity-90">Enviando comprobante al email...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 sm:p-4 z-40">
        <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-4 relative">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-gray-100 text-gray-800 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:bg-white transition-all placeholder-gray-400"
            placeholder="Escribe un mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-full flex items-center justify-center transition-all duration-200 ${
              !inputValue.trim() || isLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg transform hover:scale-105'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">Patio Funes © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;