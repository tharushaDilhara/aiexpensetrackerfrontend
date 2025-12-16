import React, { useState } from 'react';
import { X, Sparkles, Calendar, Tag, DollarSign } from 'lucide-react';
import axios from 'axios';

export default function AISummaryModal({ isOpen, onClose, darkMode, summary, onSave }) {
  if (!isOpen) return null;

  const { name, category, amount, date,type } = summary;
  const[transaction,setTransaction] = useState(
    {
      name:summary.name ,
     category:summary.category,
     amount:summary.amount,
     date:new Date(summary.date) || new Date(),
     type:summary.type.toLowerCase()
    })

  
  const categoryColors = {
    Food: '#8b5cf6',
    Transport: '#3b82f6',
    Shopping: '#10b981',
    Entertainment: '#f59e0b',
    Bills: '#ef4444',
  };

  const saveTransaction=async()=>{
    const userToken = localStorage.getItem("token")
    try {
      
          axios.post("http://localhost:3000/api/v1/saveexpense",
            transaction,{
            headers:{
              Authorization:`Bearer ${userToken}`}
          })
          .then((res)=>{
            console.log(res.data);
            console.log("success");
            onSave()
            
          })
          .catch((error)=>{
            console.log(error);
            
          })
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="relative w-full max-w-md">
        <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-2xl border ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} animate-in zoom-in duration-300`}>
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-xl bg-gray-200/60 dark:bg-gray-800/60 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-xl mx-auto">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Analysis Complete
            </h2>
            <p className={`mt-3 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Here's what I found from your receipt
            </p>
          </div>

          {/* Summary Card */}
          <div className={`rounded-2xl p-6 border-2 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/70'}`}>
            {/* Title */}
            <div className="mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Tag className="w-4 h-4" />
                Transaction Title
              </div>
              <p className="text-2xl font-bold">{name || 'Unknown Merchant'}</p>
            </div>

            {/* Category */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: categoryColors[category] || '#888' }}></div>
                  Category
                </div>
                <p className="text-xl font-semibold">{category || 'Uncategorized'}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Amount
                </div>
                <p className="text-3xl font-black text-red-500">${amount || '0.00'}</p>
                
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  Date & Time
                </div>
                <p className="text-lg font-medium">{date || 'Today'}</p>
                <p className="text-lg font-medium">{type}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveTransaction}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              Save Expense
            </button>
          </div>

          <p className={`text-center mt-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            You can edit any field before saving
          </p>
        </div>
      </div>
    </div>
  );
}