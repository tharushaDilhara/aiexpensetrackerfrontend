import React from 'react';
import { X, Sparkles, Upload } from 'lucide-react';

export default function AddExpenseModal({ isOpen, onClose, darkMode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-2xl border ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
          <button onClick={onClose} className="absolute top-5 right-5 p-2.5 rounded-xl bg-gray-200/60 dark:bg-gray-800/60 hover:bg-gray-300 dark:hover:bg-gray-700">
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8 pt-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-xl mx-auto">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Add New Expense
            </h2>
            <p className={`mt-3 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Paste receipt text or upload a bill image — AI will extract everything automatically
            </p>
          </div>

          <textarea
            placeholder="Paste receipt text here..."
            rows={7}
            className={`w-full p-5 rounded-2xl border text-base resize-none focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition ${
              darkMode ? 'bg-gray-800/60 border-gray-700 text-white' : 'bg-gray-100/70 border-gray-300 text-gray-900'
            }`}
          />

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
            </div>
            <span className={`relative px-4 bg-${darkMode ? 'gray-900/95' : 'white/95'} text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>OR</span>
          </div>

          <label className="flex flex-col items-center justify-center w-full h-40 border-3 border-dashed border-purple-400/40 rounded-2xl cursor-pointer hover:bg-purple-50/50 dark:hover:bg-gray-800/40 transition group">
            <Upload className="w-12 h-12 text-purple-500 mb-3 group-hover:scale-110 transition" />
            <span className="text-purple-600 dark:text-purple-400 font-semibold text-lg">Click to upload bill photo</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>

          <div className="mt-10 pt-4">
            <button className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:scale-105 transition flex items-center justify-center gap-4">
              <Sparkles className="w-7 h-7" />
              Analyse with AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}