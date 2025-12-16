import React, { useEffect, useState } from 'react';
import { X, Brain, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginModal({ isOpen=true, onClose, darkMode, setIsUserLogged }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ 
                                            email: "", 
                                            password: "" 
                                          });
const[uservalidatity,setUservalidity]=useState(false)
const[loading,setLoading]=useState(true)

const navigate = useNavigate();

  if (!isOpen) return null;

  

  const handleLogin = async(e) => {
    e.preventDefault();
    // Add your login logic here (API call, validation, etc.)
   // setIsUserLogged(true);
  /*  const checkExisting = JSON.parse(localStorage.getItem("user")) */
    
    /* console.log(loginData);
    try {
      axios.post("http://localhost:3000/api/v1/auth/login",loginData)
      .then((res)=>{
        console.log(res);
        if (res.statusText!=="OK") {
          return;
        }
        axios.interceptors.request.use((req)=>{
          
        })
        const usertoken = res.data.token 
        localStorage.set("token",usertoken)
        
      })
      .catch((error)=>{
        console.log(error);
        
      })
    } catch (error) {
      console.log(error);
    } */
    
   
   //email: "asd@gmail.com"
   //password: "Asd@333"
   try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/login", loginData);

      // Success: 200 or 201
      if (response.status === 200 || response.status === 201) {
        const { token, user } = response.data; // Adjust based on your backend response

        // Save token securely
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user)); // Optional: save user info

        // Optional: Set Axios default header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Navigate to dashboard
        navigate("/expenzaai"); // or "/" depending on your route
      }
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
      
      alert( error.response.data.message)

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Invalid input. Please check your details.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        // Network error
        errorMessage = "No internet connection or server is down.";
      }

      // Show error via your ErrorDisplay component
      setError?.({
        title: "Login Failed",
        message: errorMessage,
        retry: true,
      });
    } finally {
      setLoading(false);
    }
   
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700 p-10 animate-in zoom-in duration-300">

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-xl bg-gray-200/60 dark:bg-gray-800/60 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-xl mx-auto">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                className={`w-full pl-12 pr-5 py-4 rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-100/70 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition`}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:scale-105 transition flex items-center justify-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              Sign In Now
            </button>
            
          </form>

          <p className={`text-center mt-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <button 
            onClick={()=>navigate("/register")}
            className="font-bold text-purple-500 hover:text-purple-600 transition">
              Sign up free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}