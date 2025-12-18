import React, { useRef, useState } from 'react';
import { X, Sparkles, Upload, Camera, Image as ImageIcon } from 'lucide-react';
import axios from "axios";

export default function AddExpenseModal({ isOpen, onClose, darkMode, onAnalyse, setError }) {
  const [receiptText, setReceiptText] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageToAnalyseThroughAI, setImageToAnalyseThroughAI] = useState(null);
  const [loading, setLoading] = useState(false);

  // Refs for camera and file inputs
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageCapture = (file) => {
    if (!file) return;

    setImageToAnalyseThroughAI(file); // Raw file for API

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result); // Preview
    };
    reader.readAsDataURL(file);
  };

  // Handle both camera and file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    handleImageCapture(file);
  };

  // Trigger camera or file picker
  const openCamera = () => cameraInputRef.current?.click();
  const openGallery = () => fileInputRef.current?.click();

  // Your existing AI functions (unchanged)
  const requestAIExtrctedRecieptTextDetail = async (receiptText) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/v1/aigeneratedtext", { receiptText });
      
      console.log(res);
      
      if (res.statusText==="OK") {
        setLoading(false);
        const amountToRe = parseFloat(res.data.data.amount,2)
        const extracted = {
          name: res.data.data.name,
          amount: amountToRe,
          category: res.data.data.category,
          date: res.data.data.date || new Date().toLocaleDateString(),
          type: res.data.data.type,
        };
        console.log(res.data.data);
        setReceiptText("");
        onAnalyse(extracted);

        return;
      }
      onAnalyse(res);
      setError({ message: error.response?.data?.message || error.message });
      console.log(res);
      
     
    } catch (error) {
      console.log(error.message);
      
      setError({ message: error.response?.data?.message || error.message });
      setLoading(false);
      
      
    }
  };

  const requestAIExtrctedRecieptImageDetails = async () => {
    if (!imageToAnalyseThroughAI) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', imageToAnalyseThroughAI);

    try {
      const res = await axios.post("http://localhost:3000/api/v1/aiextractedimage", formData);
      setLoading(false);

      const amountSize = parseFloat(res.data.data.amount,2)

      const extracted = {
        name: res.data.data.name,
        amount: amountSize,
        category: res.data.data.category,
        date: res.data.data.date || new Date().toLocaleDateString(),
        type: res.data.data.type,
      };
      console.log(extracted);
      setUploadedImage(null)
      setImageToAnalyseThroughAI(null)
      onAnalyse(extracted);
    } catch (error) {
      setError({ message: error.response?.data?.message || "Analysis failed" });
      setLoading(false);
    }
  };

  const handleAnalyse = () => {
    if (receiptText && imageToAnalyseThroughAI) {
      setError({ message: "Please use only one method: text OR image" });
      return;
    }

    if (receiptText) {
      requestAIExtrctedRecieptTextDetail(receiptText);
    } else if (imageToAnalyseThroughAI) {
      requestAIExtrctedRecieptImageDetails();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-2xl border ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>

          <button onClick={onClose} className="absolute top-5 right-5 p-2.5 rounded-xl bg-gray-200/60 dark:bg-gray-800/60 hover:bg-gray-300 dark:hover:bg-gray-700">
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8 pt-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-xl mx-auto">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Add New Expense
            </h2>
            <p className={`mt-3 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Paste text or capture/upload a receipt
            </p>
          </div>

          {/* Text Input */}
          <textarea
            value={receiptText}
            onChange={(e) => setReceiptText(e.target.value)}
            placeholder="Paste receipt text/SMS here...
            text Ex: 
            I paid Rs.1500 for class fees
            Vehicle rental payment received Rs.50000"
            rows={7}
            className={`w-full p-5 rounded-2xl border text-base resize-none focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition mb-6 ${
              darkMode ? 'bg-gray-800/60 border-gray-700 text-white' : 'bg-gray-100/70 border-gray-300 text-gray-900'
            }`}
          />

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
            </div>
            <span className={`relative px-4 bg-${darkMode ? 'gray-900/95' : 'white/95'} text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>OR</span>
          </div>

          {/* Image Preview or Upload Options */}
          {!uploadedImage ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Take Photo Button */}
              <button
                onClick={openCamera}
                className="flex flex-col items-center justify-center h-48 border-3 border-dashed border-purple-400/40 rounded-2xl hover:bg-purple-50/50 dark:hover:bg-gray-800/40 transition group"
              >
                <Camera className="w-14 h-14 text-purple-500 mb-3 group-hover:scale-110 transition" />
                <span className="text-purple-600 dark:text-purple-400 font-semibold text-lg">Take Photo</span>
                <span className='text-green-400 font-bold text-[14px]'>(Image must be clear)</span>
              </button>

              {/* Upload from Gallery */}
              <button
                onClick={openGallery}
                className="flex flex-col items-center justify-center h-48 border-3 border-dashed border-purple-400/40 rounded-2xl hover:bg-purple-50/50 dark:hover:bg-gray-800/40 transition group"
              >
                <Upload className="w-14 h-14 text-purple-500 mb-3 group-hover:scale-110 transition" />
                <span className="text-purple-600 dark:text-purple-400 font-semibold text-lg">Upload Photo</span>
              </button>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-purple-300/50">
              <img src={uploadedImage} alt="Receipt preview" className="w-full h-auto max-h-96 object-contain" />
              <button
                onClick={() => {
                  setUploadedImage(null);
                  setImageToAnalyseThroughAI(null);
                }}
                className="absolute top-3 right-3 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-green-500/90 text-white text-sm font-bold rounded-full flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                Ready for AI
              </div>
            </div>
          )}

          {/* Hidden Inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user" 
            onChange={handleImageUpload}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Analyse Button */}
          <div className="mt-10">
            <button
              onClick={handleAnalyse}
              disabled={!receiptText && !uploadedImage}
              className={`w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:scale-105 transition flex items-center justify-center gap-4 ${
                !receiptText && !uploadedImage ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <Sparkles className={`w-7 h-7 ${loading ? 'animate-spin' : ''}`} />
              Analyse with AI
            </button>
            <p className="text-center mt-3 text-sm text-gray-500">
              <span className="text-red-500 font-medium">Note:</span> Use only one method at a time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}