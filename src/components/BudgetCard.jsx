import React from 'react';
 
export default function BudgetCard({ darkMode, budget, tempBudget, setTempBudget, saveBudget, totalSpent, remaining }) {
  return (
    <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-xl border  ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-white/60'} mb-12`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Monthly Started Budget
        </h3>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Set your spending limit</span>
      </div>
 
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center sm:text-left">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your Started budget</p>
          <p className="text-5xl font-black mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Rs.{budget.toLocaleString()}
          </p>
          <p className={`text-sm mt-3 ${budget > 0 ? 'text-green-500' : 'text-gray-500'}`}>
            {budget > 0 ? 'Active' : 'Not set yet'}
          </p>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
              <input
                type="number"
                value={tempBudget}
                disabled= {budget ? true:false}
                onChange={(e) => setTempBudget(e.target.value)}
                placeholder="5000"
                className={`w-full pl-12 pr-5 py-5 text-2xl font-bold rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition ${
                  darkMode 
                    ? 'bg-gray-900/70 border-gray-600 text-white placeholder-gray-500' 
                    : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <button
              onClick={saveBudget}
              className="px-8 py-5 w-[80%] md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:scale-105 transition"
            >
              Save Budget
            </button>
          </div>
          <p className={`text-sm mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            You have spent <strong>Rs.{totalSpent.toLocaleString()}</strong> •{' '}
            <strong className={remaining >= 0 ? 'text-green-500' : 'text-red-500'}>
              Rs.{Math.abs(remaining).toLocaleString()} {remaining >= 0 ? 'left' : 'over'}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}