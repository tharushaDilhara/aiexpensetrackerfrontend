/* import React, { useEffect, useState } from 'react';
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


export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const[isUserLogged,setIsUserLogged] = useState(false)

  // Budget Logic
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? parseInt(saved) : 0;
  });

  

  const [tempBudget, setTempBudget] = useState('');
  const totalSpent = 4238;
  const remaining = budget - totalSpent;

  const saveBudget = () => {
    if (!tempBudget || tempBudget <= 0) return;
    const newBudget = parseInt(tempBudget);
    setBudget(newBudget);
    localStorage.setItem('monthlyBudget', newBudget);
    setTempBudget('');
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

  return (
    
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-950 text-white' : 'bg-gradient-to-br from-violet-50 via-pink-50 to-blue-50 text-gray-900'}`}>
      <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode) } openAuth={() => setIsAuthOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-12">
          <h2 className="text-5xl font-black mb-3">
            Welcome back, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Tharusha</span>
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

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} darkMode={darkMode} />
      <AddExpenseModal 
        isOpen={isAddExpenseOpen} 
        onClose={() => setIsAddExpenseOpen(false)} 
        darkMode={darkMode}
        onAnalyse={handleAnalyse}
      />
      <AISummaryModal 
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        darkMode={darkMode}
        summary={aiSummary || {}}
        onSave={handleSaveExpense}
      />
      {/* AI Chat */
   /*    <AIChat darkMode={darkMode} />
    </div>
  );
}*/ 
import React, { useEffect, useState } from 'react'
import AuthModal from './components/AuthModal'
import MainContent from './MainContent'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'
import { BrowserRouter, Routes, Route, Link, Outlet, Router } from 'react-router-dom';

const App = () => {

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(true);
  const [isUserLogged, setIsUserLogged] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  //const[user,setUser]=useState(null)

  
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginModal />} />
          <Route path='/' element={<RegisterModal />}/>
          {isUserLogged ? <Route path='/expenza-ai' element={<MainContent />} />
            :
          <Route path='/login' element={<LoginModal />} />}
          
        </Routes>
      </BrowserRouter>
  
  )
}

export default App
