import React from 'react';

const stats = [
  { label: "Total Spent", value: "$4,238", change: "+18%" },
  { label: "Budget Left", value: "$1,762", change: "+5%" },
  { label: "Transactions", value: "127", change: "+31%" },
  { label: "AI Saved You", value: "$589", change: "New" },
];

export default function StatsCards({ darkMode, remaining }) {
  const updatedStats = stats.map(stat => {
    if (stat.label === "Budget Left") {
      return { ...stat, value: remaining >= 0 ? `$${remaining.toLocaleString()}` : `-$${Math.abs(remaining).toLocaleString()}` };
    }
    return stat;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {updatedStats.map((stat, i) => (
        <div
          key={i}
          className={`rounded-3xl p-7 shadow-xl backdrop-blur-xl border border-white/50 dark:border-gray-800
            ${darkMode ? 'bg-gray-800/70' : 'bg-white/80'} hover:scale-105 transition`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
          <p className="text-4xl font-black mt- mt-3">{stat.value}</p>
          <p className="text-sm font-bold text-green-500 mt-3">{stat.change}</p>
        </div>
      ))}
    </div>
  );
}