import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import axios from 'axios';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, isWithinInterval } from 'date-fns';

export default function WeeklyTrendChart({ darkMode }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState({
    totalThisWeek: 0,
    dailyAverage: 0,
    highestDay: { day: '—', amount: 0 },
    lastWeekChange: 0,
    weekendPercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/v1/getalltransactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const transactions = res.data.data || res.data;

        // Filter only expenses
        const expenses = transactions.filter(tx => tx.type === 'expense');

        // Parse dates
        const parsedExpenses = expenses.map(tx => ({
          ...tx,
          date: new Date(tx.date)
        }));

        // Current week: from Monday to today (or full week if Sunday)
        const now = new Date();
        const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const thisWeekEnd = now;

        const lastWeekStart = subWeeks(thisWeekStart, 1);
        const lastWeekEnd = subWeeks(thisWeekEnd, 1);

        // Get this week's expenses
        const thisWeekExpenses = parsedExpenses.filter(tx =>
          isWithinInterval(tx.date, { start: thisWeekStart, end: thisWeekEnd })
        );

        // Last week's expenses
        const lastWeekExpenses = parsedExpenses.filter(tx =>
          isWithinInterval(tx.date, { start: lastWeekStart, end: lastWeekEnd })
        );

        const totalThisWeek = thisWeekExpenses.reduce((sum, tx) => sum + tx.amount, 0);
        const totalLastWeek = lastWeekExpenses.reduce((sum, tx) => sum + tx.amount, 0);

        // Calculate percentage change
        const lastWeekChange = totalLastWeek === 0
          ? totalThisWeek > 0 ? 100 : 0
          : Math.round(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100);

        // Weekend spending (Fri, Sat, Sun)
        const weekendDays = [5, 6, 0]; // Friday=5, Saturday=6, Sunday=0
        const weekendSpending = thisWeekExpenses
          .filter(tx => weekendDays.includes(tx.date.getDay()))
          .reduce((sum, tx) => sum + tx.amount, 0);
        const weekendPercentage = totalThisWeek > 0
          ? Math.round((weekendSpending / totalThisWeek) * 100)
          : 0;

        // Generate daily data for the current week (Mon → Today)
        const daysInWeek = eachDayOfInterval({ start: thisWeekStart, end: thisWeekEnd });
        const dailyData = daysInWeek.map(day => {
          const dayExpenses = thisWeekExpenses.filter(tx =>
            tx.date.toDateString() === day.toDateString()
          );
          const amount = dayExpenses.reduce((sum, tx) => sum + tx.amount, 0);

          return {
            day: format(day, 'EEE'), // Mon, Tue, etc.
            amount,
          };
        });

        // Find highest day
        const highestDay = dailyData.reduce((max, d) => d.amount > max.amount ? d : max, dailyData[0] || { day: '—', amount: 0 });

        const dailyAverage = dailyData.length > 0 ? Math.round(totalThisWeek / dailyData.length) : 0;

        setWeeklyData(dailyData);
        setStats({
          totalThisWeek,
          dailyAverage,
          highestDay,
          lastWeekChange,
          weekendPercentage,
        });

      } catch (error) {
        console.error("Failed to load weekly trend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  if (loading) {
    return (
      <div className={`lg:col-span-2 rounded-3xl p-8 shadow-2xl backdrop-blur-xl border ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/80 border-white/50'}`}>
        <p className="text-center text-lg">Loading weekly trend...</p>
      </div>
    );
  }

  if (weeklyData.length === 0) {
    return (
      <div className={`lg:col-span-2 rounded-3xl p-8 shadow-2xl backdrop-blur-xl border ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/80 border-white/50'}`}>
        <h3 className="text-2xl font-bold mb-6">Weekly Spending Trend</h3>
        <p className="text-center text-gray-500 mt-20">No expenses recorded this week yet.</p>
      </div>
    );
  }

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
            formatter={(value) => `Rs. ${Number(value).toLocaleString()}`}
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

      {/* Stats Footer */}
      <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>This Week</p>
            <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Rs. {stats.totalThisWeek.toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>vs Last Week</p>
            <div className={`flex items-center justify-center gap-2 ${stats.lastWeekChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {stats.lastWeekChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span className="text-2xl font-bold">{Math.abs(stats.lastWeekChange)}%</span>
            </div>
          </div>

          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Daily Average</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">
              Rs. {stats.dailyAverage}
            </p>
          </div>

          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Highest Day</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold">
              <Calendar className="w-4 h-4" />
              {stats.highestDay.day}
            </div>
            <p className="text-lg font-semibold mt-1">Rs. {stats.highestDay.amount.toLocaleString()}</p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="mt-8 text-center">
          <p className={`text-sm italic ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Your weekend spending (Fri–Sun) makes up <strong>{stats.weekendPercentage}%</strong> of the week
            {stats.weekendPercentage > 50 && ' — consider setting a weekend budget cap!'}
          </p>
        </div>
      </div>
    </div>
  );
}