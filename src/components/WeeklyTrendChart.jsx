import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', amount: 240 },
  { day: 'Tue', amount: 180 },
  { day: 'Wed', amount: 420 },
  { day: 'Thu', amount: 290 },
  { day: 'Fri', amount: 580 },
  { day: 'Sat', amount: 720 },
  { day: 'Sun', amount: 480 },
];

export default function WeeklyTrendChart({ darkMode }) {
  const totalThisWeek = weeklyData.reduce((sum, d) => sum + d.amount, 0);
  const avgDaily = Math.round(totalThisWeek / 7);
  const lastWeekChange = +18; // Can be dynamic later
  const highestDay = weeklyData.reduce((max, d) => d.amount > max.amount ? d : max, weeklyData[0]);

  return (
    <div className={`lg:col-span-2 rounded-3xl p-8 shadow-2xl backdrop-blur-xl border ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/80 border-white/50'} transition-all`}>
      <h3 className="text-2xl font-bold mb-6">Weekly Spending Trend</h3>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="day" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
          <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#8b5cf6" 
            strokeWidth={6} 
            dot={{ fill: '#8b5cf6', r: 8 }}
            activeDot={{ r: 10 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Meaningful Footer Stats */}
      <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {/* This Week Total */}
          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>This Week</p>
            <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${totalThisWeek.toLocaleString()}
            </p>
          </div>

          {/* vs Last Week */}
          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>vs Last Week</p>
            <div className={`flex items-center justify-center gap-2 ${lastWeekChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {lastWeekChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span className="text-2xl font-bold">{Math.abs(lastWeekChange)}%</span>
            </div>
          </div>

          {/* Daily Average */}
          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Daily Average</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">
              ${avgDaily}
            </p>
          </div>

          {/* Peak Day */}
          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Highest Day</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold">
              <Calendar className="w-4 h-4" />
              {highestDay.day}
            </div>
            <p className="text-lg font-semibold mt-1">${highestDay.amount}</p>
          </div>
        </div>

        {/* Bonus Insight */}
        <div className="mt-8 text-center">
          <p className={`text-sm italic ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Your weekend spending (Fri–Sun) makes up <strong>58%</strong> of the week — AI suggests setting a weekend cap
          </p>
        </div>
      </div>
    </div>
  );
}