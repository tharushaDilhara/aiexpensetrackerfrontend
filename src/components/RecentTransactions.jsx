import React from 'react';

const transactions = [
  { name: 'Spotify Premium', category: 'Entertainment', amount: 15.99, date: 'Today' },
  { name: 'Uber Ride – Downtown', category: 'Transport', amount: 28.40, date: 'Yesterday' },
  { name: 'Whole Foods Market', category: 'Groceries', amount: 127.30, date: '2 days ago' },
  { name: 'Netflix', category: 'Entertainment', amount: 17.99, date: '3 days ago' },
  { name: 'Apple Store', category: 'Shopping', amount: 1299.00, date: '5 days ago' },
];

export default function RecentTransactions({ darkMode }) {
  return (
    <div className={`mt-16 rounded-3xl p-8 shadow-2xl backdrop-blur-xl border ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/80 border-white/50'}`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold">Recent Transactions</h3>
        <button className="text-purple-600 dark:text-purple-400 font-medium hover:underline">View all</button>
      </div>

      <div className="space-y-4">
        {transactions.map((tx, i) => (
          <div key={i} className={`flex items-center justify-between p-5 rounded-2xl transition-all hover:scale-[1.02] ${
            darkMode ? 'bg-gray-700/40 hover:bg-gray-700' : 'bg-gray-50/70 hover:bg-gray-100'
          }`}>
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg">
                {tx.name.includes('Spotify') ? 'M' : tx.name.includes('Uber') ? 'C' : 'S'}
              </div>
              <div>
                <p className={`font-bold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{tx.name.includes('Spotify') ? 'Music' : tx.name.includes('Uber') ? 'Car' : 'Shopping cart'}</p>
                <p className={`font-semibold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{tx.name}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tx.category} • {tx.date}</p>
              </div>
            </div>
            <p className="text-2xl font-black text-red-500">
              –${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition">
          Load More Transactions
        </button>
      </div>
    </div>
  );
}