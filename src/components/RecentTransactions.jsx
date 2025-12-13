import React, { useState, useMemo } from 'react';
import { format, startOfDay, endOfDay, isWithinInterval, subDays } from 'date-fns';

// Real working data with proper dates
const rawTransactions = [
  { id: 1, name: 'Salary – December', category: 'Salary', amount: 6500.00, date: new Date('2025-12-01') },
  { id: 2, name: 'Freelance Payment', category: 'Freelance', amount: 1200.00, date: subDays(new Date(), 2) },
  { id: 3, name: 'Tax Refund', category: 'Refund', amount: 380.50, date: subDays(new Date(), 5) },
  { id: 4, name: 'Dividend Income', category: 'Investment', amount: 145.00, date: subDays(new Date(), 4) },
  { id: 5, name: 'Spotify Premium', category: 'Entertainment', amount: -15.99, date: new Date() },
  { id: 6, name: 'Uber Ride', category: 'Transport', amount: -28.40, date: subDays(new Date(), 1) },
  { id: 7, name: 'Whole Foods', category: 'Groceries', amount: -127.30, date: subDays(new Date(), 2) },
  { id: 8, name: 'Netflix', category: 'Entertainment', amount: -17.99, date: subDays(new Date(), 3) },
  { id: 9, name: 'Starbucks', category: 'Food & Drink', amount: -8.75, date: new Date() },
  { id: 10, name: 'Amazon Purchase', category: 'Shopping', amount: -89.99, date: subDays(new Date(), 1) },
];

// Fixed: Real working emojis + fallbacks
const categoryConfig = {
  Salary:       { emoji: '💼', color: 'from-emerald-500 to-teal-600' },
  Freelance:    { emoji: '💻', color: 'from-cyan-500 to-blue-600' },
  Investment:   { emoji: '📈', color: 'from-indigo-500 to-purple-600' },
  Refund:       { emoji: '↩️', color: 'from-lime-500 to-green-600' },
  Groceries:    { emoji: '🛒', color: 'from-green-500 to-emerald-600' },
  'Food & Drink': { emoji: '☕', color: 'from-orange-500 to-amber-600' },
  Transport:    { emoji: '🚗', color: 'from-blue-500 to-cyan-600' },
  Entertainment:{ emoji: '🎵', color: 'from-purple-500 to-pink-600' },
  Shopping:     { emoji: '🛍️', color: 'from-pink-500 to-rose-600' },
  // Fallback
  Other:        { emoji: '💰', color: 'from-gray-500 to-gray-600' },
};

const getCategoryInfo = (category) => {
  return categoryConfig[category] || categoryConfig.Other;
};

export default function RecentTransactions({ darkMode = false }) {
  const [dateRange, setDateRange] = useState('today');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all'); // all | income | expense

  const transactions = useMemo(() => {
    let filtered = [...rawTransactions];

    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // === Date Filtering ===
    if (dateRange === 'today') {
      filtered = filtered.filter(tx => 
        tx.date >= startOfToday && tx.date <= endOfToday
      );
    } else if (dateRange === 'last7') {
      const sevenDaysAgo = subDays(startOfToday, 6); // includes today
      filtered = filtered.filter(tx => tx.date >= sevenDaysAgo);
    } else if (dateRange === 'custom' && customStart && customEnd) {
      const start = startOfDay(new Date(customStart));
      const end = endOfDay(new Date(customEnd));
      if (end >= start) {
        filtered = filtered.filter(tx => tx.date >= start && tx.date <= end);
      }
    }

    // === Type Filtering ===
    if (filterType === 'income') {
      filtered = filtered.filter(tx => tx.amount > 0);
    } else if (filterType === 'expense') {
      filtered = filtered.filter(tx => tx.amount < 0);
    }

    // === Sorting ===
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return b.date - a.date; // newest first
      } else {
        return a.category.localeCompare(b.category);
      }
    });

    return filtered;
  }, [dateRange, customStart, customEnd, sortBy, filterType]);

  const formatDateLabel = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className={`mt-16 rounded-3xl p-8 shadow-2xl backdrop-blur-xl border ${
      darkMode 
        ? 'bg-gray-800/70 border-gray-700' 
        : 'bg-white/80 border-white/50'
    }`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <h3 className="text-2xl font-bold">All Transactions</h3>

        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === type
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {type === 'all' ? 'All' : type === 'income' ? 'Income' : 'Expenses'}
              </button>
            ))}
          </div>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="today">Today</option>
            <option value="last7">Last 7 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {/* Custom Date Inputs */}
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          )}

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="date">Latest First</option>
            <option value="category">By Category</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filterType === 'income' 
                ? 'No income found' 
                : filterType === 'expense' 
                ? 'No expenses found' 
                : 'No transactions'
              } for the selected period.
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const isIncome = tx.amount > 0;
            const { emoji, color } = getCategoryInfo(tx.category);

            return (
              <div
                key={tx.id}
                className={`flex items-center justify-between p-5 rounded-2xl transition-all hover:scale-[1.02] ${
                  darkMode 
                    ? 'bg-gray-700/40 hover:bg-gray-700' 
                    : 'bg-gray-50/70 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl shadow-lg`}>
                    {emoji}
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {tx.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {tx.category} • {formatDateLabel(tx.date)}
                    </p>
                  </div>
                </div>

                <p className={`text-2xl font-black ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                  {isIncome ? '+' : '−'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition">
          Load More Transactions
        </button>
      </div>
    </div>
  );
}