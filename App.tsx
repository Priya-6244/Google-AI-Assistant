import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from './services/gemini';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message, Role } from './types';
import { Sparkles, Trash2, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat service on mount
  useEffect(() => {
    geminiService.startChat();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content,
      timestamp: Date.now(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Placeholder for bot message
    const botMessageId = (Date.now() + 1).toString();
    const initialBotMessage: Message = {
      id: botMessageId,
      role: Role.MODEL,
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };
    
    setMessages((prev) => [...prev, initialBotMessage]);

    try {
      const stream = geminiService.sendMessageStream(content);
      
      let fullContent = '';
      
      for await (const chunk of stream) {
        fullContent += chunk;
        
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMessageId 
              ? { ...msg, content: fullContent } 
              : msg
          )
        );
      }

      // Finalize message
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );

    } catch (error) {
      console.error("Failed to send message", error);
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId 
            ? { 
                ...msg, 
                content: "I'm sorry, I encountered an error processing your request.",
                isStreaming: false,
                isError: true
              } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to clear the conversation?")) {
      setMessages([]);
      geminiService.startChat();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Header */}
      <header className="flex-none h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Gemini Assistant
          </h1>
        </div>
        <button 
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          title="Clear Conversation"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 md:p-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl ring-1 ring-white/5">
              <MessageSquare size={32} className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-white">How can I help you today?</h2>
            <p className="text-slate-400 max-w-md">
              Ask me anything about general knowledge, coding, creative writing, or analysis. I'm powered by the Gemini 2.5 Flash model.
            </p>
          </div>
        ) : (
          <div className="flex flex-col min-h-full">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="flex-none">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </footer>
      
    </div>
  );
};

export default App;