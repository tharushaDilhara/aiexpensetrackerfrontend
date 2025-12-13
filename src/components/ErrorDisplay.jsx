import React, { useEffect } from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

export default function ErrorDisplay({
  title = "Something went wrong",
  message = "Please try again later",
  onRetry,
  onClose,
  autoDismiss = false,
  duration = 5000, // ms
  darkMode = false,
}) {
  useEffect(() => {
    if (autoDismiss && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration, onClose]);

  //Errors styles
  {/*// 1. Network error with retry
        setError({
        title: "No Internet Connection",
        message: "Can't reach the server. Check your network and try again.",
        retry: true,
        });

        // 2. Simple info message (auto closes)
        setError({
        message: "Expense saved successfully!",
        // no title, no retry → auto dismiss
        });

        // 3. AI analysis failed
        setError({
        title: "AI Couldn't Read Receipt",
        message: "The image is too blurry. Please upload a clearer photo.",
        retry: true,
        });*/}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto max-w-sm w-full animate-in slide-in-from-bottom duration-500">
        <div className={`rounded-2xl shadow-2xl backdrop-blur-xl border overflow-hidden ${
          darkMode 
            ? 'bg-red-900/90 border-red-800/50' 
            : 'bg-white/95 border-red-200'
        }`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">{title}</h3>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/20 transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6">
            <p className={`text-base leading-relaxed ${darkMode ? 'text-red-100' : 'text-gray-700'}`}>
              {message}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
              )}
              {onClose && !onRetry && (
                <button
                  onClick={onClose}
                  className="flex-1 px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-xl hover:scale-105 transition"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}