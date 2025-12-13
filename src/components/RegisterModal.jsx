import React, { useState } from 'react';
import { X, Brain, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RegisterModal({ isOpen=true, onClose, darkMode, setIsUserLogged }) {
  const [showPassword, setShowPassword] = useState(false);
  const [register, setRegister] = useState({ fullname: "", email: "", password: "" });
  const [errors, setErrors] = useState({ fullname: "", email: "", password: "" });

  const navigate = useNavigate();

  if (!isOpen) return null;

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
  const passwordPattern = /^[a-zA-Z0-9@#$%^&*!]{6,8}$/;
  const fullnamePattern = /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "email":
        error = emailPattern.test(value) ? "" : "Email must include '@' and end with '.com'";
        break;
      case "password":
        error = passwordPattern.test(value) ? "" : "Password must be 6-8 characters with letters, numbers, or symbols";
        break;
      case "fullname":
        error = fullnamePattern.test(value) ? "" : "Enter first and last name";
        break;
      default:
        break;
    }

    setErrors({ ...errors, [name]: error });
    setRegister({ ...register, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Final validation
    if (errors.email || errors.password || errors.fullname || !register.email || !register.password || !register.fullname) {
      alert("Please fix the errors before submitting");
      return;
    }

    // API call would go here
    console.log("Registering:", register);
    
    setIsUserLogged(true);
    onClose();
  };

  return (
    <div className="fixed overflow-auto inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="relative w-full max-h-screen max-w-md mx-4">
        <div className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700 p-10 animate-in zoom-in duration-300">

          {/* <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-xl bg-gray-200/60 dark:bg-gray-800/60 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button> */}

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-xl mx-auto">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Join ExpenseAI
            </h2>
            <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Start tracking smarter with AI
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={register.fullname}
                onChange={handleInputChange}
                required
                className={`w-full pl-12 pr-5 py-4 rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-100/70 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition`}
              />
              {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={register.email}
                onChange={handleInputChange}
                required
                className={`w-full pl-12 pr-5 py-4 rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-100/70 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={register.password}
                onChange={handleInputChange}
                required
                className={`w-full pl-12 pr-14 py-4 rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-100/70 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:scale-105 transition flex items-center justify-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              Create Free Account
            </button>
          </form>

          <p className={`text-center mt-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <button onClick={()=>navigate("/login")} className="font-bold text-purple-500 hover:text-purple-600 transition">
              Sign in instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}