import React, { useState, useMemo, useEffect } from 'react';
import { format, startOfDay, endOfDay, subDays, parseISO } from 'date-fns';
import axios from 'axios';
import { Delete, Trash } from 'lucide-react';

// Category → emoji + gradient color
const categoryConfig = {
  Salary:       { emoji: '💼', color: 'from-emerald-500 to-teal-600' },
  Freelance:    { emoji: '💻', color: 'from-cyan-500 to-blue-600' },
  Investment:   { emoji: '📈', color: 'from-indigo-500 to-purple-600' },
  Refund:       { emoji: '↩️', color: 'from-lime-500 to-green-600' },
  Groceries:    { emoji: '🛒', color: 'from-green-500 to-emerald-600' },
  Food: { emoji: '☕', color: 'from-orange-500 to-amber-600' },
  Transport:    { emoji: '🚗', color: 'from-blue-500 to-cyan-600' },
  Entertainment:{ emoji: '🎵', color: 'from-purple-500 to-pink-600' },
  Shopping:     { emoji: '🛍️', color: 'from-pink-500 to-rose-600' },
  Income :{ emoji: '💲', color: 'from-yellow-500 to-green-500' },
  Health :{ emoji: '💊', color: 'from-green-500 to-blue-600' },
  Utility:    { emoji: '💴', color: 'from-pink-500 to-rose-600' },
  Others:       { emoji: '💰', color: 'from-gray-500 to-gray-700' },
  // Fallback for any unknown category
  default:      { emoji: '📌', color: 'from-gray-500 to-gray-600' },
};

const getCategoryInfo = (category) => {
  return categoryConfig[category] || categoryConfig.default;
};

export default function RecentTransactions({ darkMode = false }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateRange, setDateRange] = useState('last14');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all'); // all | income | expense

  // Fetch all transactions from your backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/v1/getalltransactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        // Assuming backend returns: { success: true, data: [...] }
        const data = res.data.data || res.data; // adjust if needed
        setTransactions(data);
        
        
        setError(null);
      } catch (err) {
        console.error("Failed to load transactions:", err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  },[]);

  // Filter + Sort logic
  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    const today = new Date();
    const startOfToday = startOfDay(today);

    // Date filtering
    if (dateRange === 'today') {
      list = list.filter(tx => {
        const txDate = parseISO(tx.date);
        return txDate >= startOfToday && txDate <= endOfDay(today);
      });
    } else if (dateRange === 'last7') {
      const sevenDaysAgo = subDays(startOfToday, 6);
      list = list.filter(tx => parseISO(tx.date) >= sevenDaysAgo);
    } else if (dateRange === 'custom' && customStart && customEnd) {
      const start = startOfDay(new Date(customStart));
      const end = endOfDay(new Date(customEnd));
      if (end >= start) {
        list = list.filter(tx => {
          const txDate = parseISO(tx.date);
          return txDate >= start && txDate <= end;
        });
      }
    }

    // Type filtering
    if (filterType === 'income') {
      list = list.filter(tx => tx.type === 'income');
    } else if (filterType === 'expense') {
      list = list.filter(tx => tx.type === 'expense');
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date); // newest first
      }
      return a.category.localeCompare(b.category);
    });

    return list;
  }, [transactions, dateRange, customStart, customEnd, sortBy, filterType]);

  const formatDateLabel = (isoString) => {
    const date = parseISO(isoString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return format(date, 'MMM d, yyyy');
  };

  if (loading) {
    return (
      <div className={`mt-16 rounded-3xl p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Loading transactions...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`mt-16 rounded-3xl p-8 text-center text-red-500`}>
        {error}
      </div>
    );
  }

  const deleteTransaction=async(tid)=>{

    const confirmBox = window.confirm("Do you Confirm the transaction deletion ?")

    if (confirmBox) {
      try {
        axios.delete(`http://localhost:3000/api/v1/delete/${tid}`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        })
        .then((res)=>{
          console.log(res.data);
          window.location.reload()
        }).catch((error)=>{
          console.log(error);
          
        })
      } catch (error) {
        console.log(error);
        
      }
    }else{
      alert("Transaction Deletion Canceled")
    }

    
  }

  return (
    <div className={`mt-16 rounded-3xl p-8 shadow-2xl backdrop-blur-xl border ${
      darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/80 border-white/50'
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
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border ${
              darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="today">Today</option>
            <option value="last7">Last 7 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {/* Custom Dates */}
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
              <span className="text-gray-500">to</span>
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
            </div>
          )}

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border ${
              darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="date">Latest First</option>
            <option value="category">By Category</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No transactions found for the selected filters.
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const { emoji, color } = getCategoryInfo(tx.category);

            return (
              <div
                key={tx._id}
                className={`flex items-center justify-between p-5 rounded-2xl transition-all hover:scale-[1.02] ${
                  darkMode ? 'bg-gray-700/40 hover:bg-gray-700' : 'bg-gray-50/70 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl shadow-lg`}>
                    {emoji}
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {tx.name.length > 15 ? <p>{tx.name.substring(0,14)}- <br></br>{tx.name.substring(14,tx.name.length)}</p>
                      
                      :tx.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {tx.category} • {formatDateLabel(tx.date)}
                    </p>
                  </div>
                </div>

                <p className={`text-2xl font-black ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                  {isIncome ? '+' : '−'}Rs. {Math.abs(tx.amount).toLocaleString('en-US')}
                </p>
                <button
                onClick={()=>deleteTransaction(tx._id)}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 
                            bg-red-600 hover:bg-red-700 active:bg-red-800 
                            text-white shadow-sm hover:shadow 
                            dark:bg-red-500 dark:hover:bg-red-600 dark:active:bg-red-700
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                            dark:focus:ring-offset-gray-900"
                >
                  <Trash />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Load More (optional) */}
      {filteredTransactions.length > 0 && (
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}