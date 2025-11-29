import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      <div className="relative flex items-end gap-2 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-2 shadow-xl ring-1 ring-white/5 focus-within:ring-indigo-500/50 transition-all duration-300">
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Gemini anything..."
          className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm px-4 py-3 max-h-[120px] resize-none focus:outline-none scrollbar-hide"
          rows={1}
        />

        <button
          onClick={() => handleSubmit()}
          disabled={!input.trim() || isLoading}
          className={`flex-shrink-0 mb-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            !input.trim() || isLoading
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20'
          }`}
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={18} className="ml-0.5" />
          )}
        </button>
      </div>
      <div className="text-center mt-2">
        <p className="text-[10px] text-slate-500 font-medium">
          Gemini 2.5 Flash can make mistakes. Please check important information.
        </p>
      </div>
    </div>
  );
};