import axios from 'axios';
import React, { useEffect, useState } from 'react';

const stats = [
  { label: "Total Spent", value: "$4,238", change: "+18%" },
  { label: "Total Earned", value: "$589", change: "New" },
  { label: "Budget Left", value: "$1,762", change: "+5%" },
  { label: "Transactions", value: "127", change: "+31%" },
  
];



export default function StatsCards({ darkMode, remaining }) {

  const[checkIsbudgetAvailable,setcheckIsbudgetAvailable]=useState(0)

  const[statsList,setStatsList] = useState([
          {label:"Total Spent",value:`Rs.0`,Change:"+5%"},
          {label:"Total Earned",value:`Rs.0`,Change:"+5%"},
          {label:"Budget Left",value:`Rs.${0}`,Change:"+5%"},
          {label:"Transactions",value:0,Change:"+5%"}
        ])
  const[statsLayout,setStatLayout] =useState({
    label:"",
    value:"",
    Change:""
  })


  //load all transactions
  useEffect(()=>{
    axios.get("http://localhost:3000/api/v1/getcurrentbudget",{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    }).then((res)=>{
      
      //setStatsList(res.data);
      //setStatsList(res.data)
      
      //console.log(res.data);
      if (res.data && res.data.userBudget) {
       // const {totalTransactions,totalexpensed,totalincomes,avialblebudget} = res.data.userBudget
        const {totalTransactions,totalexpensed,totalincomes,avialblebudget,currentBudget} = res.data.userBudget
        let per = (totalexpensed/(totalincomes+avialblebudget))*100
        console.log(per.toFixed(2));
        
        const updatedList = [
          {label:"Total Spent",value:`Rs.${totalexpensed.toLocaleString('en-US')}`,Change:`${((totalexpensed/currentBudget)*100).toFixed(2)}%`},
          {label:"Total Earned",value:`Rs.${totalincomes.toLocaleString('en-US')}`,Change:`${((totalincomes/(totalincomes+avialblebudget))*100).toFixed(2)}%`},
          {label:"Budget Left",value:`Rs.${avialblebudget.toLocaleString('en-US')}`,Change:`${((avialblebudget/(currentBudget))*100).toFixed(2)}%`},
          {label:"Transactions",value:totalTransactions.toLocaleString('en-US'),Change:"+5%"}
        ]

        //setcheckIsbudgetAvailable(avialblebudget)
        //console.log(checkIsbudgetAvailable);
        setStatsList(updatedList)
      //console.log(res.data.userBudget);
      
      }
        
    }).catch((error)=>{
      console.log(error);
      
    })
  })

  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statsList.map((stat, i) => (
        <div
          key={i}
          className={`rounded-3xl p-7 shadow-xl backdrop-blur-xl border border-white/50 dark:border-gray-800
            ${darkMode ? 'bg-gray-800/70' : 'bg-white/80'} hover:scale-105 transition`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
          <p className="text-4xl font-black mt- mt-3">{stat.value}</p>
          <p className="text-sm font-bold text-green-500 mt-3">{stat.Change}</p>
        </div>
      ))}
    </div> 
  );
}