import React, { useEffect, useState } from 'react';
import { X, Sparkles, Upload, Image as ImageIcon, CameraIcon } from 'lucide-react';
import axios from "axios"


export default function AddExpenseModal({ isOpen, onClose, darkMode, onAnalyse ,setError }) {
  const [receiptText, setReceiptText] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const[imageToAnalyseThroughAI,setImageToAnalyseThroughAI] = useState(null)
  const[loading,setLoading]=useState(false);
  
  

  if (!isOpen) return null;

const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      setImageToAnalyseThroughAI(file); //row file use to send through request body with the help of FormData 
      reader.onloadend = () => {
        setUploadedImage(reader.result)
      };
      
      
      reader.readAsDataURL(file);
    }
};




  //text message analyse with AI
const requestAIExtrctedRecieptTextDetail=async(receiptText)=>{

  setLoading(true)
  try {
    axios.post("http://localhost:3000/api/v1/aigeneratedtext",{receiptText:receiptText})
    .then((res)=>{
        
          setLoading(false)
          const extracted = {
            name:res.data.data.name,
            amount:res.data.data.amount,
            category:res.data.data.category,
            date:res.data.data.date || new Date().toLocaleDateString(),
            type:res.data.data.type,
         }
          console.log(res);

          /* if (res.data.declinemessage!=="") {
            setError({message:res.data.data.declinemessage})//set AI decline error
          }
           */
         if (!loading) {
            //onClose();
            setReceiptText("")
            onAnalyse(extracted); //passed to summery
         }
    })
    .catch((error)=>{
      console.log(error);
      setError({message:error.message})//set error
      setLoading(false) //stop loading
      
    })
    
  } catch (error) {
    
    setError({
        title: "No Internet Connection",
        message: "Can't reach the server. Check your network and try again.",
        retry: true,
        });//set error
    setLoading(false) //stop loading
  }
}

  //Analyse through an image
  //row file send to end point if image is also added
const requestAIExtrctedRecieptImageDetails=async()=>{
      setLoading(true)
      const formData = new FormData()
      formData.append('image',imageToAnalyseThroughAI)
    try {
      axios.post("http://localhost:3000/api/v1/aiextractedimage",formData)
      .then(res=>{
       
        console.log(res.data.data)
         setLoading(false)

          const extracted = {
            name:res.data.data.name,
            amount:res.data.data.amount,
            category:res.data.data.category,
            date:res.data.data.date || new Date().toLocaleDateString(),
            type:res.data.data.type,
         }
          
         if (!loading) {
            //setUploadedImage(null)
            onAnalyse(extracted); //passed to summery
         }
        
      })
      .catch((error)=>{
        console.log(error);
        setError({message:error.response.data.message})//set error
        setLoading(false) //stop loading
      })
    } catch (error) {
      console.log(error);
      setError({
        title: "No Internet Connection",
        message: "Can't reach the server. Check your network and try again.",
        retry: true,
        });//set error
      setLoading(false) //stop loading
    }
}

  const handleAnalyse = () => {
    
    //if both oprions are selected
    if (receiptText!=="" && imageToAnalyseThroughAI) {
    
      // Critical error with retry
      setError({
        message: "You can only use one method to extract data at a time",
        // no title, no retry → auto dismiss
      });

      setReceiptText("")
      setUploadedImage(null)
    }

    if (receiptText!=="") {
      requestAIExtrctedRecieptTextDetail(receiptText)
    }

    if (imageToAnalyseThroughAI) {
        requestAIExtrctedRecieptImageDetails()
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
              Paste receipt text or upload image
            </p>
          </div>

          <textarea
            value={receiptText}
            onChange={(e) => setReceiptText(e.target.value)}
            placeholder="Paste receipt text/SMS here or type like,
                        Ex- 
                        Shopping 
                        Rs.5000 
                        2025-**-** or (keep it empty)"
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

          {!uploadedImage ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-3 border-dashed border-purple-400/40 rounded-2xl cursor-pointer hover:bg-purple-50/50 dark:hover:bg-gray-800/40 transition group">
              <Upload className="w-14 h-14 text-purple-500 mb-3 group-hover:scale-110 transition" />
              <span className="text-purple-600 dark:text-purple-400 font-semibold text-lg">Upload bill photo</span>
              <input type="file" capture="environment" /*camera capturing*/ accept="image/*" onChange={handleImageUpload} className="hidden" />
              <input type="file"  /*camera capturing*/ accept="image/*" onChange={handleImageUpload} className="hidden" />
              
            </label>
            
          ) : (
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-purple-300/50">
              <img src={uploadedImage} alt="Receipt" className="w-full h-auto max-h-80 object-contain" />
              <button onClick={() => setUploadedImage(null)} className="absolute top-3 right-3 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="mt-10">
            <button
              onClick={handleAnalyse}
              disabled={!receiptText && !uploadedImage}
              className={`w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:scale-105 transition flex items-center justify-center gap-4 ${
                !receiptText && !uploadedImage ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <Sparkles className={`w-7 h-7 ${loading ? 'animate-spin':'animate-none'} `} />
              Analyse with AI
            </button>
            <span className='text-red-400 font-medium'>Note: </span><span className='text-gray-600 font-medium'>Use one method per action</span>
          </div>
        </div>
      </div>
    </div>
  );
}