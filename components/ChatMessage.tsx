import React from 'react';
import { Message, Role } from '../types';
import { User, Bot, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-indigo-600 text-white' 
            : message.isError 
              ? 'bg-red-500 text-white' 
              : 'bg-emerald-600 text-white'
        }`}>
          {isUser ? <User size={18} /> : message.isError ? <AlertCircle size={18} /> : <Bot size={18} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl shadow-md text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : message.isError 
                ? 'bg-red-900/30 border border-red-800 text-red-200 rounded-tl-none'
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
          }`}>
             {message.content}
             {message.isStreaming && (
               <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-emerald-400 animate-pulse" />
             )}
          </div>
          
          <span className="text-xs text-slate-500 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

      </div>
    </div>
  );
};