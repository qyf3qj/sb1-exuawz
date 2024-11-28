import React from 'react';
import { MessageCircle, Bot } from 'lucide-react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''} mb-4`}>
      <div className={`p-2 rounded-full ${isUser ? 'bg-blue-100' : 'bg-green-100'}`}>
        {isUser ? <MessageCircle size={20} /> : <Bot size={20} />}
      </div>
      <div className={`flex-1 p-4 rounded-lg ${isUser ? 'bg-blue-50 text-right' : 'bg-green-50'}`}>
        <p className="text-gray-800">{message.content}</p>
      </div>
    </div>
  );
}