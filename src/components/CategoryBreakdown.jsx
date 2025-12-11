import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const categories = [
  { name: 'Food', value: 32, color: '#8b5cf6' },
  { name: 'Transport', value: 22, color: '#3b82f6' },
  { name: 'Shopping', value: 18, color: '#10b981' },
  { name: 'Entertainment', value: 15, color: '#f59e0b' },
  { name: 'Bills', value: 13, color: '#ef4444' },
];

export default function CategoryBreakdown({ darkMode }) {
  return (
    <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-xl border ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-white/60'}`}>
      <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Spending by Category
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={categories} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="value" paddingAngle={5}>
            {categories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '16px' }} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-10 space-y-4">
        {categories.map((cat) => (
          <div key={cat.name} className={`flex items-center justify-between p-5 rounded-2xl transition-all hover:scale-105 shadow-md ${
            darkMode 
              ? 'bg-gray-700/60 hover:bg-gray-700' 
              : 'bg-gradient-to-r from-purple-50/70 to-pink-50/70 hover:from-purple-100/80 hover:to-pink-100/80'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 rounded-full shadow-lg ring-4 ring-white dark:ring-gray-800" style={{ backgroundColor: cat.color }}></div>
              <span className={`font-semibold text-lg ${darkMode ? 'text-gray-gray-100' : 'text-gray-800'}`}>{cat.name}</span>
            </div>
            <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {cat.value}%
            </p>
          </div>
        ))}
      </div>

      <div className={`mt-10 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-purple-200'}`}>
        <div className="flex justify-between items-end">
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total this month</p>
            <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">$4,238</p>
          </div>
          <span className="text-sm font-medium text-green-500 bg-green-100 dark:bg-green-900/40 px-4 py-2 rounded-full">+12% vs last month</span>
        </div>
      </div>
    </div>
  );
}