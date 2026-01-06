
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  isOpen: boolean;
  toggleChat: () => void;
  openChat: (message?: string) => void;
  closeChat: () => void;
  pendingMessage: string | null;
  clearPendingMessage: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const openChat = (message?: string) => {
    if (message) setPendingMessage(message);
    setIsOpen(true);
  };

  const closeChat = () => setIsOpen(false);
  
  const toggleChat = () => setIsOpen(prev => !prev);
  
  const clearPendingMessage = () => setPendingMessage(null);

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat, openChat, closeChat, pendingMessage, clearPendingMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
