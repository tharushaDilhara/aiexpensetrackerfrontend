import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function CategoryBreakdown({ darkMode }) {
  const [categoryData, setCategoryData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Predefined colors for categories
  const categoryColors = {
    Food: '#f59e0b',
    Transport: '#3b82f6',
    Shopping: '#10b981',
    Entertainment: '#8b5cf6',
    Health: '#8baaf6',
    Bills: '#ef4444',
    Others: '#6b7280',
    Income: '#6b5000',
    Salary: '#22c55e',
    Freelance: '#06b6d4',
    Investment: '#a855f7',
    Education: '#dc2626',
    default: '#9ca3af',
  };

  const getColor = (category) => categoryColors[category] || categoryColors.default;

  useEffect(() => {
    const fetchTransactions = async () => {
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

        // Calculate total spent
        const total = expenses.reduce((sum, tx) => sum + tx.amount, 0);
        setTotalSpent(total);

        if (total === 0) {
          setCategoryData([]);
          return;
        }

        // Group by category and sum amounts
        const categoryMap = expenses.reduce((acc, tx) => {
          const cat = tx.category || 'Others';
          acc[cat] = (acc[cat] || 0) + tx.amount;
          return acc;
        }, {});

        // Convert to array with precise percentages (1 decimal place for display)
        const data = Object.entries(categoryMap)
          .map(([name, amount]) => {
            const percentage = (amount / total) * 100;

            return {
              name,
              amount,
              value: percentage,                    // Exact percentage for PieChart (float)
              displayPercentage: percentage.toFixed(1), // For list & tooltip: e.g., 3.7%
              color: getColor(name),
            };
          })
          .filter(item => item.amount > 0)         // Remove any zero-amount categories
          .sort((a, b) => b.amount - a.amount);    // Largest first

        setCategoryData(data);
      } catch (error) {
        console.error("Failed to load transactions for breakdown:", error);
        setCategoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-xl border ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-white/60'}`}>
        <p className="text-center text-lg">Loading spending breakdown...</p>
      </div>
    );
  }

  if (categoryData.length === 0 || totalSpent === 0) {
    return (
      <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-xl border ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-white/60'}`}>
        <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Spending by Category
        </h3>
        <p className="text-center text-gray-500">No expenses recorded yet this month.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-xl border ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-white/60'}`}>
      <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Spending by Category
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            dataKey="value"
            paddingAngle={5}
          >
            {categoryData.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${Number(value).toFixed(1)}%`}
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ fontWeight: 'bold' }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-10 space-y-4">
        {categoryData.map((cat) => (
          <div
            key={cat.name}
            className={`flex items-center justify-between p-5 rounded-2xl transition-all hover:scale-105 shadow-md ${
              darkMode
                ? 'bg-gray-700/60 hover:bg-gray-700'
                : 'bg-gradient-to-r from-purple-50/70 to-pink-50/70 hover:from-purple-100/80 hover:to-pink-100/80'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-6 h-6 rounded-full shadow-lg ring-4 ring-white dark:ring-gray-800"
                style={{ backgroundColor: cat.color }}
              ></div>
              <span className={`font-semibold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {cat.name}
              </span>
            </div>
            <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {cat.displayPercentage}%
            </p>
          </div>
        ))}
      </div>

      <div className={`mt-10 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-purple-200'}`}>
        <div className="flex justify-between items-end">
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total this month</p>
            <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Rs. {totalSpent.toLocaleString('en-US')}
            </p>
          </div>
          <span className="text-sm font-medium text-green-500 bg-green-100 dark:bg-green-900/40 px-4 py-2 rounded-full">
            Real-time data
          </span>
        </div>
      </div>
    </div>
  );
}