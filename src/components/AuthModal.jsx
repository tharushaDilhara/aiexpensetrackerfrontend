import React, { useEffect, useState } from 'react';
import { X, Brain, Mail, Lock, User, Eye, EyeOff, Sparkles, Regex } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, darkMode,setIsUserLogged }) {
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const[loginData,setloginData] = useState({
    email:"",
    password:""
  })

  const [register,setRegister]=useState({
    fullname:"",
    email:"",
    password:""
  })

  const[errors,setErrors]=useState({
    fullnameerror:"",
    emailerror:"",
    passworderror:""
  })

  if (!isOpen) return null;

  const confirmUserLogin=()=>{
    setIsUserLogged(true)
  }

useEffect(()=>{

},[isLogin])

const handleOnchange=(e)=>{
  switch (isLogin) {
    case true:
      setloginData({...loginData,[e.target.name]:e.target.value})
      break;
    case false:
      setRegister({...loginData,[e.target.name]:e.target.value})
      break;
  
    default:
      break;
  }
}

const handleLoginClick=(e)=>{
  e.preventDefault()
  console.log(loginData);
  console.log(register);
  
  
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700 p-10 animate-in zoom-in duration-300">
          
          {/* <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-xl bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button> */}

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-2xl mx-auto">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isLogin ? 'Welcome Back' : 'Join ExpenseAI'}
            </h2>
            <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isLogin ? 'Sign in to continue your journey' : 'Start tracking smarter with AI'}
            </p>
          </div>

          <form className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  name='fullname'
                  onChange={handleOnchange}
                  className={`w-full pl-12 pr-5 py-4 rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-100/70 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition`}
                />
                
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                 onChange={handleOnchange}
                className={`w-full pl-12 pr-5 py-4 rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-100/70 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition`}
              />
              {/* <span 
              className={`${errors.emailerror ? 'text-red-500':'text-green-500 font-bold'}`}
              >{errors.emailerror ? errors.emailerror : "Valid Email"}</span> */}
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                onChange={handleOnchange}
                name='password'
                className={`w-full pl-12 pr-14 py-4 rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-100/70 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={handleLoginClick}
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:scale-105 transition flex items-center justify-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              {isLogin ? 'Sign In Now' : 'Create Free Account'}
            </button>
          </form>

          <p className={`text-center mt-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-purple-500 hover:text-purple-600 transition"
            >
              {isLogin ? 'Sign up free' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}