import React, { useState } from 'react';
import { Send, Sparkles, X, Brain } from 'lucide-react';

const sampleMessages = [
  { sender: 'ai', text: "Hey Sarah! I'm your AI finance assistant. Ask me anything about your spending, budget tips, or expense analysis." },
  { sender: 'user', text: "What's my biggest spending category this month?" },
  { sender: 'ai', text: "Food & Dining takes the lead at 32% ($1,356) of your total spend. Mostly weekends — want tips to optimize?" },
  { sender: 'user', text: "Yes please!" },
  { sender: 'ai', text: "Great! Try meal prepping on Sundays (saves ~$200/month) and set a $150 weekend dining cap. I'll remind you! 💡" },
];

export default function AIChat({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(sampleMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: "That's a great question! Let me analyze your data..." }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-28 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition z-40"
      >
        <Brain className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 md:w-96 w-[300px] h-[600px] z-50">
      <div className={`h-full rounded-3xl shadow-2xl backdrop-blur-2xl border flex flex-col ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Expenza AI Assistant</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Always here to help</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={msg.sender === 'user' ? 'flex justify-end' : ''}>
              <div className={`max-w-xs px-5 py-4 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className={`px-5 py-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200/50 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about your finances..."
              className={`flex-1 md:w-auto w-[70%] px-5 py-4 rounded-2xl border focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition ${
                darkMode ? 'bg-gray-800/70 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-100/70 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              onClick={sendMessage}
              className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:scale-105 transition shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}