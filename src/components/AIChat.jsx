import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, X, Brain, Eye, EyeOff, MessageSquare } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1/chat'; // Change if needed

export default function AIChat({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]); // List of all user chats
  const [activeChat, setActiveChat] = useState(null); // Current open chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMsgExample, setShowMsgExample] = useState(true);
  const messagesEndRef = useRef(null);

  const msgExample = [
    "What's my biggest spending category this month?",
    "How much have I earned this month?",
    "How much did I spend on entertainment?",
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load all chats when widget opens
  useEffect(() => {
    if (isOpen && chats.length === 0) {
      fetchChats();
    }
  }, [isOpen]);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/userchats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setChats(res.data.data);
        // Auto-open most recent chat or create new
        if (res.data.data.length > 0) {
          const recent = res.data.data[0];
          loadChat(recent.sessionId);
        }
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const loadChat = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const chat = res.data.data;
        setActiveChat(chat);
        setMessages(
          chat.messages.map((m) => ({
            sender: m.role, // 'user' or 'ai'
            text: m.content,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE}/send`,
        {
          message: userMessage,
          sessionId: activeChat?.sessionId || null, // null = new chat
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const aiMsg = res.data.data.message.content;
        const newSessionId = res.data.data.sessionId;

        setMessages((prev) => [...prev, { sender: 'ai', text: aiMsg }]);

        // Update active chat and refresh chat list
        setActiveChat((prev) => ({ ...prev, sessionId: newSessionId }));
        fetchChats(); // Refresh sidebar
      }
    } catch (error) {
      console.error('Send failed:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, something went wrong. Try again.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExampleClick = (msg) => {
    setInput(msg);
    document.querySelector('input')?.focus();
  };

  const startNewChat = () => {
    setActiveChat(null);
    setMessages([]);
    setInput('');
    setShowMsgExample(true);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-28 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-50"
      >
        <Brain className="w-9 h-9" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-8 md:w-[800px] w-[92vw] max-w-md h-[620px] z-50 flex gap-4">
      {/* Chat List Sidebar */}
      <div className={`w-20 h-full rounded-3xl shadow-2xl flex flex-col border ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white border-gray-300'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={startNewChat}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 transition"
            title="New Chat"
          >
            <MessageSquare className="w-6 h-6 mx-auto" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {chats.map((chat) => (
            <button
              key={chat.sessionId}
              onClick={() => loadChat(chat.sessionId)}
              className={`w-full p-3 rounded-xl text-left transition ${
                activeChat?.sessionId === chat.sessionId
                  ? 'bg-purple-600 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
              title={chat.title}
            >
              <MessageSquare className="w-5 h-5 mx-auto" />
              <p className="text-xs mt-1 truncate">{chat.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className={`flex-1 h-full rounded-3xl shadow-2xl flex flex-col border ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white border-gray-300 shadow-xl'} overflow-hidden`}>
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between" style={{ background: darkMode ? '#111827' : '#f8fafc' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Expenza AI Assistant</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {activeChat ? activeChat.title : 'New Chat'}
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Start a conversation!</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div
                className={`max-w-[80%] px-5 py-4 rounded-3xl shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md'
                    : darkMode
                    ? 'bg-gray-800 text-gray-100 rounded-bl-md'
                    : 'bg-gray-200/90 text-gray-900 rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className={`px-5 py-4 rounded-3xl rounded-bl-md shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-gray-200/90'}`}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - FIXED */}
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 shrink-0">
          {/* Toggle Suggestions */}
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setShowMsgExample(!showMsgExample)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {showMsgExample ? (
                <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Example Suggestions - Only show in new/empty chats */}
          {showMsgExample && messages.length === 0 && (
            <div className="mb-4 space-y-3">
              {msgExample.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(msg)}
                  className="w-full text-left px-5 py-3.5 rounded-xl font-medium text-sm bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {msg}
                </button>
              ))}
            </div>
          )}

          {/* Input + Send Button Row - CRITICAL FIX */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about your finances..."
              className={`flex-1 px-5 py-3.5 rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-200 font-medium text-base
                ${darkMode
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500'
                  : 'bg-white border-gray-400 text-gray-900 placeholder-gray-600 focus:border-purple-600 shadow-md'
                }`}
            />
            
            {/* SEND BUTTON - Now visible and properly sized */}
            <button
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}