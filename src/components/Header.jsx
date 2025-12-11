import React from 'react';
import { Moon, Sun, Brain } from 'lucide-react';

export default function Header({ darkMode, toggleDarkMode, openAuth }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/70 dark:bg-gray-950/80 border-b border-gray-200/30 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Expenza
          </h1>
          <div className="hidden sm:flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">AI Powered</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-2xl bg-gray-200/50 dark:bg-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-white" />}
          </button>

          <button
            onClick={openAuth}
            className="px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}