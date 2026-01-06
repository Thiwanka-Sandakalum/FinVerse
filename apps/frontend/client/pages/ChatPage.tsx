
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../services/types';
import { sendChatMessage, sendProductChatMessage, generateSessionId } from '../services/chatService';
import Calculators from '../components/Calculators';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MarkdownRenderer } from '../utils/formatChatText';
import Toast from '../components/Toast';
import {
   getAllChatSessions,
   saveChatSession,
   deleteChatSession,
   deleteAllChatSessions,
   generateChatTitle,
   getChatSessionsGrouped,
   ChatSession
} from '../utils/chatStorage';

interface ChatPageProps {
   initialMessage?: string | null;
   onMessageHandled?: () => void;
}

// Mock Data for "Rich" UI responses
const SUGGESTED_PRODUCTS = [
   { id: '1', name: 'Sapphire Preferred®', institution: 'Chase', rate: '21.49% APR', type: 'Card', logo: 'https://logo.clearbit.com/chase.com' },
   { id: '2', name: 'Citi Double Cash', institution: 'Citi', rate: '18.99% APR', type: 'Card', logo: 'https://logo.clearbit.com/citi.com' },
];

const QUICK_PROMPTS = [
   "Compare personal loans",
   "How much home can I afford?",
   "Best savings rates today",
   "Explain debt-to-income ratio"
];

const ChatPage: React.FC<ChatPageProps> = ({ initialMessage, onMessageHandled }) => {
   const [searchParams] = useSearchParams();
   const productId = searchParams.get('productId');
   const [currentSessionId, setCurrentSessionId] = useState(() => generateSessionId());
   const [input, setInput] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();
   const [messages, setMessages] = useState<ChatMessage[]>([
      {
         id: 'welcome',
         role: 'model',
         text: productId
            ? `Hello! I'm here to help you with this specific product. Feel free to ask me anything about features, pricing, comparisons, or how this product can meet your needs.`
            : "Hello! I'm FinVerse Assistant, your financial copilot. I can help you compare products, calculate payments, or plan your savings. How can I help you today?",
         timestamp: new Date(),
         type: 'text'
      }
   ]);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const [sidebarOpen, setSidebarOpen] = useState(true);
   const [showCalculator, setShowCalculator] = useState(false);
   const [showSaveNotification, setShowSaveNotification] = useState(false);
   const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
   const [showClearConfirm, setShowClearConfirm] = useState(false);
   const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };
   // Load chat sessions on mount
   useEffect(() => {
      loadChatSessions();
   }, []);

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   // Auto-save current chat session when messages change
   useEffect(() => {
      if (messages.length > 1) { // More than just welcome message
         autoSaveCurrentSession();
      }
   }, [messages]);

   const loadChatSessions = () => {
      const sessions = getAllChatSessions();
      setChatSessions(sessions);
   };

   const autoSaveCurrentSession = () => {
      const session: ChatSession = {
         id: currentSessionId,
         title: generateChatTitle(messages),
         messages: messages,
         createdAt: new Date(),
         updatedAt: new Date()
      };
      saveChatSession(session);
      loadChatSessions();
   };

   const startNewChat = () => {
      setCurrentSessionId(generateSessionId());
      setMessages([
         {
            id: 'welcome',
            role: 'model',
            text: productId
               ? `Hello! I'm here to help you with this specific product. Feel free to ask me anything about features, pricing, comparisons, or how this product can meet your needs.`
               : "Hello! I'm FinVerse Assistant, your financial copilot. I can help you compare products, calculate payments, or plan your savings. How can I help you today?",
            timestamp: new Date(),
            type: 'text'
         }
      ]);
      setInput('');
   };

   const loadChatSession = (sessionId: string) => {
      const sessions = getAllChatSessions();
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
         setCurrentSessionId(session.id);
         setMessages(session.messages);
      }
   };

   const handleDeleteSession = (sessionId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      setShowDeleteConfirm(sessionId);
   };

   const confirmDeleteSession = (sessionId: string) => {
      deleteChatSession(sessionId);
      loadChatSessions();
      setShowDeleteConfirm(null);
      setToast({ message: 'Chat deleted successfully', type: 'success' });

      // If deleting current session, start new chat
      if (sessionId === currentSessionId) {
         startNewChat();
      }
   };

   // Handle initial message from Comparison View
   useEffect(() => {
      if (initialMessage) {
         handleSend(initialMessage);
         if (onMessageHandled) {
            onMessageHandled();
         }
      }
   }, [initialMessage]);

   const handleSend = async (text: string = input) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
         id: Date.now().toString(),
         role: 'user',
         text: text,
         timestamp: new Date()
      };

      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
         // Simulate "Thinking" time for UX
         await new Promise(resolve => setTimeout(resolve, 600));

         // Check for keywords to inject "Rich Data" (Mocking backend logic)
         const lowerText = text.toLowerCase();
         let richType: ChatMessage['type'] = 'text';
         let richData = null;

         if (lowerText.includes('card') || lowerText.includes('loan') || lowerText.includes('compare')) {
            richType = 'product-recommendation';
            richData = SUGGESTED_PRODUCTS;
         } else if (lowerText.includes('calculate') || lowerText.includes('afford')) {
            richType = 'tool-suggestion';
            richData = { name: 'EMI Calculator', link: '/' };
         }

         // Use product chat if productId is present, otherwise use general chat
         const responseText = productId
            ? await sendProductChatMessage(currentSessionId, productId, text)
            : await sendChatMessage(currentSessionId, text);

         const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: new Date(),
            type: richType,
            data: richData
         };

         setMessages(prev => [...prev, botMsg]);
      } catch (error) {
         console.error("Chat error", error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleClearChat = () => {
      setShowClearConfirm(true);
   };

   const confirmClearChat = () => {
      startNewChat();
      setShowClearConfirm(false);
      setToast({ message: 'Conversation cleared successfully', type: 'success' });
   };

   const handleDeleteMessage = (id: string) => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
   };

   const handleSaveChat = () => {
      autoSaveCurrentSession();
      setToast({ message: 'Conversation saved successfully', type: 'success' });
   };

   const handleClearAllSessions = () => {
      setShowClearAllConfirm(true);
   };

   const confirmClearAllSessions = () => {
      deleteAllChatSessions();
      loadChatSessions();
      startNewChat();
      setShowClearAllConfirm(false);
      setToast({ message: 'All chat history cleared', type: 'success' });
   };

   return (
      <div className="flex h-[calc(100vh-80px)] bg-gray-50 animate-fade-in overflow-hidden relative">

         {/* Toast Notification */}
         {toast && (
            <Toast
               message={toast.message}
               type={toast.type}
               onClose={() => setToast(null)}
            />
         )}

         {/* Clear Chat Confirmation Modal */}
         {showClearConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
               <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-fade-in-up">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Current Chat?</h3>
                  <p className="text-sm text-gray-600 mb-6">
                     Are you sure you want to clear the current conversation? This will start a new chat.
                  </p>
                  <div className="flex gap-3">
                     <button
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={confirmClearChat}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                     >
                        Clear
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Clear All History Confirmation Modal */}
         {showClearAllConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
               <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-fade-in-up">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Clear All History?</h3>
                  <p className="text-sm text-gray-600 mb-6">
                     Are you sure you want to delete all chat history? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                     <button
                        onClick={() => setShowClearAllConfirm(false)}
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={confirmClearAllSessions}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                     >
                        Delete All
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Delete Chat Confirmation Modal */}
         {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
               <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-fade-in-up">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Chat?</h3>
                  <p className="text-sm text-gray-600 mb-6">
                     Are you sure you want to delete this conversation? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                     <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={() => confirmDeleteSession(showDeleteConfirm)}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                     >
                        Delete
                     </button>
                  </div>
               </div>
            </div>
         )}
         {/* Sidebar - Chat History & Tools */}
         <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col overflow-hidden hidden md:flex`}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
               <h3 className="font-bold text-gray-700">Chat History</h3>
               <div className="flex items-center gap-2">
                  <button
                     onClick={startNewChat}
                     className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                     title="New Chat"
                  >
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                  </button>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {chatSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                     <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                     No chat history yet
                  </div>
               ) : (
                  <>
                     {(() => {
                        const grouped = getChatSessionsGrouped();
                        return (
                           <>
                              {grouped.today.length > 0 && (
                                 <>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Today</div>
                                    {grouped.today.map(session => (
                                       <div key={session.id} className="relative group">
                                          <button
                                             onClick={() => loadChatSession(session.id)}
                                             className={`w-full text-left p-3 pr-10 rounded-xl text-sm font-medium border truncate transition-colors ${session.id === currentSessionId
                                                ? 'bg-brand-50 text-brand-900 border-brand-100'
                                                : 'hover:bg-gray-50 text-gray-600 border-transparent'
                                                }`}
                                          >
                                             {session.title}
                                          </button>
                                          <button
                                             onClick={(e) => handleDeleteSession(session.id, e)}
                                             className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-50"
                                             title="Delete chat"
                                          >
                                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                          </button>
                                       </div>
                                    ))}
                                 </>
                              )}

                              {grouped.yesterday.length > 0 && (
                                 <>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Yesterday</div>
                                    {grouped.yesterday.map(session => (
                                       <div key={session.id} className="relative group">
                                          <button
                                             onClick={() => loadChatSession(session.id)}
                                             className={`w-full text-left p-3 pr-10 rounded-xl text-sm font-medium border truncate transition-colors ${session.id === currentSessionId
                                                ? 'bg-brand-50 text-brand-900 border-brand-100'
                                                : 'hover:bg-gray-50 text-gray-600 border-transparent'
                                                }`}
                                          >
                                             {session.title}
                                          </button>
                                          <button
                                             onClick={(e) => handleDeleteSession(session.id, e)}
                                             className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-50"
                                             title="Delete chat"
                                          >
                                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                          </button>
                                       </div>
                                    ))}
                                 </>
                              )}

                              {grouped.lastWeek.length > 0 && (
                                 <>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Previous 7 Days</div>
                                    {grouped.lastWeek.map(session => (
                                       <div key={session.id} className="relative group">
                                          <button
                                             onClick={() => loadChatSession(session.id)}
                                             className={`w-full text-left p-3 pr-10 rounded-xl text-sm font-medium border truncate transition-colors ${session.id === currentSessionId
                                                ? 'bg-brand-50 text-brand-900 border-brand-100'
                                                : 'hover:bg-gray-50 text-gray-600 border-transparent'
                                                }`}
                                          >
                                             {session.title}
                                          </button>
                                          <button
                                             onClick={(e) => handleDeleteSession(session.id, e)}
                                             className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-50"
                                             title="Delete chat"
                                          >
                                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                          </button>
                                       </div>
                                    ))}
                                 </>
                              )}

                              {(grouped.lastMonth.length > 0 || grouped.older.length > 0) && (
                                 <>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Older</div>
                                    {[...grouped.lastMonth, ...grouped.older].map(session => (
                                       <div key={session.id} className="relative group">
                                          <button
                                             onClick={() => loadChatSession(session.id)}
                                             className={`w-full text-left p-3 pr-10 rounded-xl text-sm font-medium border truncate transition-colors ${session.id === currentSessionId
                                                ? 'bg-brand-50 text-brand-900 border-brand-100'
                                                : 'hover:bg-gray-50 text-gray-600 border-transparent'
                                                }`}
                                          >
                                             {session.title}
                                          </button>
                                          <button
                                             onClick={(e) => handleDeleteSession(session.id, e)}
                                             className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-50"
                                             title="Delete chat"
                                          >
                                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                          </button>
                                       </div>
                                    ))}
                                 </>
                              )}
                           </>
                        );
                     })()}

                     {chatSessions.length > 0 && (
                        <button
                           onClick={handleClearAllSessions}
                           className="w-full mt-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           Clear All History
                        </button>
                     )}
                  </>
               )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
               <button onClick={() => setShowCalculator(!showCalculator)} className="flex items-center justify-center w-full py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                  <svg className="w-4 h-4 mr-2 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  {showCalculator ? 'Hide Calculator' : 'Open Calculator'}
               </button>
            </div>
         </div>

         {/* Main Chat Area */}
         <div className="flex-1 flex flex-col relative w-full">

            {/* Calculator Overlay */}
            {showCalculator && (
               <div className="absolute top-0 right-0 z-20 w-full md:w-[400px] h-full bg-white shadow-2xl border-l border-gray-200 overflow-y-auto animate-fade-in-up">
                  <div className="flex justify-end p-2">
                     <button onClick={() => setShowCalculator(false)} className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                  </div>
                  <Calculators embedded={true} />
               </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-10">
               <div className="flex items-center">
                  {!sidebarOpen && (
                     <button onClick={() => setSidebarOpen(true)} className="mr-4 text-gray-500 hover:text-brand-600 hidden md:block">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                     </button>
                  )}
                  <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white mr-3 shadow-md">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                     <h2 className="font-bold text-gray-900">FinVerse AI Copilot</h2>
                     <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-xs text-gray-500">
                           {productId ? `Product Chat Mode` : 'Always active'}
                        </span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center space-x-2">
                  <button onClick={handleSaveChat} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-gray-50 rounded-lg transition-colors" title="Save Chat">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  </button>
                  <button onClick={handleClearChat} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear Chat">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
               </div>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
               {messages.map((msg) => (
                  <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>

                     {/* User Avatar & Delete (Right Side) */}
                     {msg.role === 'user' && (
                        <div className="flex items-end max-w-[85%] md:max-w-[70%]">
                           {/* Delete Button (User) */}
                           <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="mr-2 mb-2 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete message"
                           >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>

                           <div className="bg-brand-600 text-white p-4 rounded-2xl rounded-br-none shadow-md">
                              <p className="text-sm md:text-base">{msg.text}</p>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-brand-100 border-2 border-white ml-3 flex-shrink-0 flex items-center justify-center text-brand-800 font-bold text-xs shadow-sm">
                              SP
                           </div>
                        </div>
                     )}

                     {/* Model Avatar & Delete (Left Side) */}
                     {msg.role === 'model' && (
                        <div className="flex items-end max-w-[95%] md:max-w-[80%]">
                           <div className="w-8 h-8 rounded-full bg-brand-600 flex-shrink-0 flex items-center justify-center text-white mr-3 shadow-sm border-2 border-white">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                           </div>
                           <div className="flex-1">
                              <div className="bg-white border border-gray-100 text-gray-800 p-5 rounded-2xl rounded-bl-none shadow-sm">
                                 <MarkdownRenderer content={msg.text} />

                                 {/* Rich UI: Product Recommendation */}
                                 {msg.type === 'product-recommendation' && msg.data && (
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                       {msg.data.map((prod: any) => (
                                          <div key={prod.id} className="border border-gray-200 rounded-xl p-3 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer bg-gray-50" onClick={() => navigate(`/products/${prod.id}`)}>
                                             <div className="flex items-center mb-2">
                                                <img src={prod.logo} alt={prod.institution} className="w-6 h-6 rounded-full mr-2" />
                                                <span className="text-xs font-bold text-gray-500">{prod.institution}</span>
                                             </div>
                                             <h4 className="font-bold text-brand-900 text-sm mb-1">{prod.name}</h4>
                                             <p className="text-accent-600 font-bold text-xs">{prod.rate}</p>
                                          </div>
                                       ))}
                                    </div>
                                 )}

                                 {/* Rich UI: Tool Suggestion */}
                                 {msg.type === 'tool-suggestion' && (
                                    <div className="mt-4">
                                       <button onClick={() => setShowCalculator(true)} className="flex items-center text-sm font-bold text-brand-600 bg-brand-50 px-4 py-2 rounded-lg hover:bg-brand-100 transition-colors">
                                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                          Open Calculator Tool
                                       </button>
                                    </div>
                                 )}
                              </div>
                           </div>

                           {/* Delete Button (Model) */}
                           <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="ml-2 mb-2 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete message"
                           >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                     )}
                  </div>
               ))}

               {isLoading && (
                  <div className="flex w-full justify-start">
                     <div className="w-8 h-8 rounded-full bg-brand-600 flex-shrink-0 flex items-center justify-center text-white mr-3">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                     </div>
                     <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4 flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </div>
                  </div>
               )}

               {/* Bottom Clear All Button - Visible only if there are messages (excluding welcome if desired, but here we check length > 1 for simplicity if user typed something) */}
               {messages.length > 1 && (
                  <div className="flex justify-center pt-4 pb-2">
                     <button
                        onClick={handleClearChat}
                        className="flex items-center text-xs font-bold text-gray-400 hover:text-red-500 transition-colors px-4 py-2 rounded-full hover:bg-red-50"
                     >
                        <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Clear Conversation History
                     </button>
                  </div>
               )}

               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 md:p-6">
               {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                     {QUICK_PROMPTS.map((prompt, i) => (
                        <button
                           key={i}
                           onClick={() => handleSend(prompt)}
                           className="text-xs bg-gray-50 border border-gray-200 hover:bg-brand-50 hover:border-brand-200 text-gray-600 hover:text-brand-700 px-3 py-1.5 rounded-full transition-all"
                        >
                           {prompt}
                        </button>
                     ))}
                  </div>
               )
               }

               < div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all shadow-sm" >
                  <button className="p-3 text-gray-400 hover:text-brand-600 transition-colors">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  </button>
                  <input
                     type="text"
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                     placeholder="Ask anything about finance..."
                     className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 h-14"
                  />
                  <button
                     onClick={() => handleSend()}
                     disabled={!input.trim() || isLoading}
                     className={`p-2 rounded-xl mr-2 transition-all ${!input.trim() || isLoading ? 'bg-gray-200 text-gray-400' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md'}`}
                  >
                     <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
               </div>
               <p className="text-center text-xs text-gray-400 mt-3">
                  FinVerse can make mistakes. Consider checking important information.
               </p>
            </div>

         </div>
      </div>
   );
};

export default ChatPage;
