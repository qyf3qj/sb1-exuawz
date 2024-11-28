import React, { useState } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { getContext } from './utils/embeddings';
import type { Message } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (query: string, apiKey: string) => {
    try {
      setIsLoading(true);
      
      // Add user message immediately
      const userMessage: Message = { role: 'user', content: query };
      setMessages(prev => [...prev, userMessage]);

      // Get context for the query
      const context = await getContext(query);

      // Simulate API call (replace with actual API call in production)
      const response = await new Promise<string>(resolve => {
        setTimeout(() => {
          resolve(`Based on our benefits information:\n\n${context}\n\nHow can I help you further?`);
        }, 1000);
      });

      // Add assistant response
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-8">Benefits Assistant</h1>
          
          <div className="h-[500px] overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">
                Start asking questions about your benefits!
              </p>
            ) : (
              messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))
            )}
          </div>

          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;