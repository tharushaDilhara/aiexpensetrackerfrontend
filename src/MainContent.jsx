import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import BudgetCard from './components/BudgetCard';
import WeeklyTrendChart from './components/WeeklyTrendChart';
import CategoryBreakdown from './components/CategoryBreakdown';
import RecentTransactions from './components/RecentTransactions';
import AddExpenseModal from './components/AddExpenseModal';
import AuthModal from './components/AuthModal';
import AIChat from './components/AIChat';
import AISummaryModal from './components/AISummaryModal';
import ErrorDisplay from './components/ErrorDisplay';
import LoginModal from './components/LoginModal';
import axios from 'axios';


export default function MainContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const[loggedUserName,setLoggedUserName] = useState(JSON.parse(localStorage.getItem("user")).fullname.split(" ")[0])

  console.log(loggedUserName);
  
  // Budget Logic
  const [budget, setBudget] = useState(0);

  

  const [tempBudget, setTempBudget] = useState('');
  const totalSpent = 4238;//change here with Real data
  const remaining = budget;

  //load current budget
  useEffect(()=>{
    axios.get("http://localhost:3000/api/v1/getcurrentbudget",{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    .then((res)=>{
      
      if (!res.data) {
        console.log(res.data.userBudget.currentBudget);
        //localStorage.setItem('monthlyBudget', res.data.userBudget.currentBudget);
        setBudget(res.data.userBudget.currentBudget);
      }
      setBudget(res.data.userBudget.currentBudget);
      
      
    }).catch((error)=>{
      console.log(error);
      
    })
  },[budget])

  

  //POST budget saving
  const saveBudget = async() => {

      try {
        
        if (!tempBudget || tempBudget <= 0) return;
          const newBudget = parseInt(tempBudget);
         
        axios.post('http://localhost:3000/api/v1/savebudget',{currentBudget:newBudget},{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        })
        .then((res)=>{
          setBudget(newBudget);
          //localStorage.setItem('monthlyBudget', newBudget);
          setTempBudget('');
          console.log(res.data);
          
        }).catch((error)=>{
          console.log(error);
          
        })
      } catch (error) {
        console.log(error.message);
      }

    
  };

   
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);

  const handleAnalyse = (extracted) => {
    setAiSummary(extracted);
    setIsSummaryOpen(true);
  };

  const handleSaveExpense = () => {
    // In real app: save to state/database
    alert('Expense saved successfully!');
    setIsSummaryOpen(false);
  };

  const [error, setError] = useState(null);

  // Example trigger
  const simulateError = () => {
    setError({
      title: "Network Error",
      message: "Failed to connect to the server. Check your internet connection.",
      retry: true,
    });
  };

  const handleRetry = () => {
    // Retry logic here
    console.log("Retrying...");
    setError(null); // or show loading
  };

  return (
    
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-950 text-white' : 'bg-gradient-to-br from-violet-50 via-pink-50 to-blue-50 text-gray-900'}`}>
      <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode) } openAuth={() => setIsAuthOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-12">
          <h2 className="md:text-5xl text-4xl font-black mb-3">
            Welcome back, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{loggedUserName}</span>
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Let AI track and optimize your spending
          </p>
        </div>

        <StatsCards darkMode={darkMode} remaining={remaining} />
        <BudgetCard darkMode={darkMode} budget={budget} tempBudget={tempBudget} setTempBudget={setTempBudget} saveBudget={saveBudget} totalSpent={totalSpent} remaining={remaining} />

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <WeeklyTrendChart darkMode={darkMode} />
          <CategoryBreakdown darkMode={darkMode} />
        </div>

        <RecentTransactions darkMode={darkMode} />
      </main>

      <button
        onClick={() => setIsAddExpenseOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center text-4xl hover:scale-110 transition z-40"
      >
        +
      </button>

      <AuthModal 
      isOpen={isAuthOpen} 
      onClose={() => setIsAuthOpen(false)} 
      darkMode={darkMode} 
      />
      {/*login*/}
      
      <AddExpenseModal 
        isOpen={isAddExpenseOpen} 
        onClose={() => setIsAddExpenseOpen(false)} 
        darkMode={darkMode}
        onAnalyse={handleAnalyse}
        setError={setError}
      />
      <AISummaryModal 
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        darkMode={darkMode}
        summary={aiSummary || {}}
        onSave={handleSaveExpense}
      />
      {/* AI Chat */}
      <AIChat darkMode={darkMode} />
      {/* Error Modal */}
      {error && (
        <ErrorDisplay
          title={error.title}
          message={error.message}
          onRetry={error.retry ? handleRetry : null}
          onClose={() => setError(null)}
          darkMode={darkMode}
          autoDismiss={!error.retry} // Auto close if no retry needed
        />
      )}
    </div>
  );
}